package com.payroll.service;

import com.payroll.entity.Attendance;
import com.payroll.entity.Employee;
import com.payroll.entity.LeaveType;
import com.payroll.repository.AttendanceRepository;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.LeaveTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
@Slf4j
public class AttendanceImportService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        dateStr = dateStr.trim();

        // Try different date formats including DD-MMM-YY format
        String[] formats = {
                "yyyy-MM-dd",
                "dd/MM/yyyy",
                "dd-MM-yyyy",
                "MM/dd/yyyy",
                "yyyy/MM/dd",
                "dd-MMM-yy",
                "dd-MMM-yyyy"
        };

        for (String format : formats) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // Try next format
            }
        }

        return null;
    }

    private boolean isValidStatus(String status) {
        return Arrays.asList("PRESENT", "ABSENT", "LEAVE", "HALF_DAY", "HOLIDAY", "WEEKEND").contains(status);
    }

    public byte[] generateTemplate() throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Attendance");

            // Create header style (orange background like in screenshot)
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ORANGE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            // Create header row with Date, Sprint, Day, then sample employee names
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "Date",
                    "Sprint",
                    "Day",
                    "Employee1",
                    "Employee2",
                    "Employee3"
            };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, i < 3 ? 4000 : 5000);
            }

            // Add sample data rows - empty = PRESENT, leave type name = LEAVE
            // Format: Date, Sprint, Day, Employee1 status, Employee2 status, Employee3 status
            String[][] sampleData = {
                    {"12-Jan-26", "", "Monday", "", "", ""},
                    {"13-Jan-26", "", "Tuesday", "", "Casual", ""},
                    {"14-Jan-26", "", "Wednesday", "Sick", "", ""},
                    {"15-Jan-26", "", "Thursday", "", "", "Casual"},
                    {"16-Jan-26", "", "Friday", "", "", ""},
                    {"17-Jan-26", "", "Saturday", "", "", ""},
                    {"18-Jan-26", "", "Sunday", "", "", ""}
            };

            for (int i = 0; i < sampleData.length; i++) {
                Row row = sheet.createRow(i + 1);
                for (int j = 0; j < sampleData[i].length; j++) {
                    row.createCell(j).setCellValue(sampleData[i][j]);
                }
            }

            // Add instructions sheet
            Sheet instructionSheet = workbook.createSheet("Instructions");
            String[] instructions = {
                    "ATTENDANCE IMPORT INSTRUCTIONS",
                    "",
                    "Column A: Date - Enter dates in DD-MMM-YY or DD/MM/YYYY format",
                    "Column B: Sprint - Optional, for your reference",
                    "Column C: Day - Day name (Monday, Tuesday, etc.) - Optional",
                    "Columns D onwards: Replace 'Employee1', 'Employee2', etc. with actual Employee IDs",
                    "",
                    "CELL VALUES:",
                    "- Empty cell = PRESENT (employee attended work)",
                    "- Leave type name (Casual, Sick, etc.) = LEAVE",
                    "- 'ABSENT' = Employee was absent",
                    "- 'HALF_DAY' = Half day attendance",
                    "- 'HOLIDAY' = Public holiday",
                    "- 'WEEKEND' = Weekend (Saturday/Sunday)",
                    "",
                    "NOTES:",
                    "- Weekends (Saturday/Sunday) will be auto-detected if cell is empty",
                    "- Leave types must match names configured in the system"
            };

            for (int i = 0; i < instructions.length; i++) {
                Row row = instructionSheet.createRow(i);
                row.createCell(0).setCellValue(instructions[i]);
            }
            instructionSheet.setColumnWidth(0, 20000);

            // Write to byte array
            java.io.ByteArrayOutputStream outputStream = new java.io.ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    /**
     * Import attendance from pivot-style Excel (Date rows, Employee columns)
     */
    @Transactional
    public Map<String, Object> importAttendanceFromPivotExcel(MultipartFile file, Long tenantId) throws IOException {
        log.info("Starting pivot-style attendance import for tenant: {}", tenantId);

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        int successCount = 0;
        int errorCount = 0;
        int updatedCount = 0;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            // Validate header row
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new RuntimeException("Excel file is empty or missing header row");
            }

            // Get leave types for mapping
            List<LeaveType> leaveTypes = leaveTypeRepository.findByOrganizationId(tenantId);
            Map<String, LeaveType> leaveTypeMap = new HashMap<>();
            for (LeaveType lt : leaveTypes) {
                // Only include active leave types
                if (lt.getIsActive() != null && lt.getIsActive()) {
                    leaveTypeMap.put(lt.getName().toUpperCase(), lt);
                    if (lt.getCode() != null && !lt.getCode().isEmpty()) {
                        leaveTypeMap.put(lt.getCode().toUpperCase(), lt);
                    }
                }
            }

            // Parse employee IDs from header (columns D onwards, index 3+)
            List<String> employeeIds = new ArrayList<>();
            Map<Integer, Employee> columnToEmployee = new HashMap<>();

            for (int col = 3; col <= headerRow.getLastCellNum(); col++) {
                Cell cell = headerRow.getCell(col);
                String employeeId = getCellValueAsString(cell);
                if (employeeId != null && !employeeId.trim().isEmpty()) {
                    Employee employee = employeeRepository.findByEmployeeIdAndOrganizationId(employeeId.trim(), tenantId)
                            .orElse(null);
                    if (employee != null) {
                        columnToEmployee.put(col, employee);
                        employeeIds.add(employeeId);
                    } else {
                        warnings.add("Employee not found in header: " + employeeId);
                    }
                }
            }

            if (columnToEmployee.isEmpty()) {
                throw new RuntimeException("No valid employees found in header row. Please use Employee IDs in columns D onwards.");
            }

            // Process data rows (skip header)
            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);
                if (row == null) continue;

                // Parse date from column A
                String dateStr = getCellValueAsString(row.getCell(0));
                if (dateStr == null || dateStr.trim().isEmpty()) continue;

                LocalDate date = parseDate(dateStr);
                if (date == null) {
                    errors.add("Row " + (rowNum + 1) + ": Invalid date format: " + dateStr);
                    errorCount++;
                    continue;
                }

                // Determine if weekend
                boolean isWeekend = date.getDayOfWeek().getValue() >= 6;

                // Process each employee column
                for (Map.Entry<Integer, Employee> entry : columnToEmployee.entrySet()) {
                    int col = entry.getKey();
                    Employee employee = entry.getValue();

                    String cellValue = getCellValueAsString(row.getCell(col));
                    String status;
                    Long leaveTypeId = null;

                    if (cellValue == null || cellValue.trim().isEmpty()) {
                        // Empty cell = PRESENT or WEEKEND
                        status = isWeekend ? "WEEKEND" : "PRESENT";
                    } else {
                        cellValue = cellValue.trim().toUpperCase();
                        
                        // Check if it's a direct status
                        if (isValidStatus(cellValue)) {
                            status = cellValue;
                        } else {
                            // Assume it's a leave type name
                            LeaveType leaveType = leaveTypeMap.get(cellValue);
                            if (leaveType != null) {
                                status = "LEAVE";
                                leaveTypeId = leaveType.getId();
                            } else {
                                // Try partial match
                                LeaveType matchedType = null;
                                for (Map.Entry<String, LeaveType> ltEntry : leaveTypeMap.entrySet()) {
                                    if (ltEntry.getKey().contains(cellValue) || cellValue.contains(ltEntry.getKey())) {
                                        matchedType = ltEntry.getValue();
                                        break;
                                    }
                                }
                                if (matchedType != null) {
                                    status = "LEAVE";
                                    leaveTypeId = matchedType.getId();
                                } else {
                                    warnings.add("Row " + (rowNum + 1) + ", Employee " + employee.getEmployeeId() + ": Unknown value '" + cellValue + "', marking as ABSENT");
                                    status = "ABSENT";
                                }
                            }
                        }
                    }

                    // Create or update attendance
                    try {
                        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), date)
                                .orElse(new Attendance());

                        boolean isNew = attendance.getId() == null;

                        attendance.setEmployeeId(employee.getId());
                        attendance.setOrganizationId(tenantId);
                        attendance.setDate(date);
                        attendance.setStatus(status);
                        attendance.setLeaveTypeId(leaveTypeId);

                        attendanceRepository.save(attendance);

                        if (isNew) {
                            successCount++;
                        } else {
                            updatedCount++;
                        }
                    } catch (Exception e) {
                        errors.add("Row " + (rowNum + 1) + ", Employee " + employee.getEmployeeId() + ": " + e.getMessage());
                        errorCount++;
                    }
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", errors.isEmpty());
        result.put("successCount", successCount);
        result.put("updatedCount", updatedCount);
        result.put("errorCount", errorCount);
        result.put("errors", errors.size() > 20 ? errors.subList(0, 20) : errors);
        result.put("warnings", warnings.size() > 20 ? warnings.subList(0, 20) : warnings);
        result.put("totalProcessed", successCount + updatedCount + errorCount);

        log.info("Pivot import completed: {} created, {} updated, {} errors", successCount, updatedCount, errorCount);

        return result;
    }

    /**
     * Import attendance from pivot-style CSV (Date rows, Employee columns)
     */
    @Transactional
    public Map<String, Object> importAttendanceFromPivotCsv(MultipartFile file, Long tenantId) throws IOException {
        log.info("Starting pivot-style CSV attendance import for tenant: {}", tenantId);

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        int successCount = 0;
        int errorCount = 0;
        int updatedCount = 0;

        try (java.io.BufferedReader reader = new java.io.BufferedReader(
                new java.io.InputStreamReader(file.getInputStream()))) {

            // Get leave types for mapping
            List<LeaveType> leaveTypes = leaveTypeRepository.findByOrganizationId(tenantId);
            Map<String, LeaveType> leaveTypeMap = new HashMap<>();
            for (LeaveType lt : leaveTypes) {
                if (lt.getIsActive() != null && lt.getIsActive()) {
                    leaveTypeMap.put(lt.getName().toUpperCase(), lt);
                    if (lt.getCode() != null && !lt.getCode().isEmpty()) {
                        leaveTypeMap.put(lt.getCode().toUpperCase(), lt);
                    }
                }
            }

            // Read header row
            String headerLine = reader.readLine();
            if (headerLine == null || headerLine.trim().isEmpty()) {
                throw new RuntimeException("CSV file is empty or missing header row");
            }

            String[] headers = headerLine.split(",");
            if (headers.length < 4) {
                throw new RuntimeException("Invalid CSV format. Expected: Date, Sprint, Day, Employee1, Employee2, ...");
            }

            // Parse employee IDs from header (columns 3+, index 3+)
            Map<Integer, Employee> columnToEmployee = new HashMap<>();
            for (int col = 3; col < headers.length; col++) {
                String employeeId = headers[col].trim();
                if (!employeeId.isEmpty()) {
                    Employee employee = employeeRepository.findByEmployeeIdAndOrganizationId(employeeId, tenantId)
                            .orElse(null);
                    if (employee != null) {
                        columnToEmployee.put(col, employee);
                    } else {
                        warnings.add("Employee not found in header: " + employeeId);
                    }
                }
            }

            if (columnToEmployee.isEmpty()) {
                throw new RuntimeException("No valid employees found in header row. Please use Employee IDs in columns after Date, Sprint, Day.");
            }

            // Process data rows
            String line;
            int rowNum = 1;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;

                String[] values = line.split(",", -1); // -1 to keep empty trailing fields
                if (values.length < 1) continue;

                // Parse date from column 0
                String dateStr = values[0].trim();
                if (dateStr.isEmpty()) continue;

                LocalDate date = parseDate(dateStr);
                if (date == null) {
                    errors.add("Row " + (rowNum + 1) + ": Invalid date format: " + dateStr);
                    errorCount++;
                    rowNum++;
                    continue;
                }

                // Determine if weekend
                boolean isWeekend = date.getDayOfWeek().getValue() >= 6;

                // Process each employee column
                for (Map.Entry<Integer, Employee> entry : columnToEmployee.entrySet()) {
                    int col = entry.getKey();
                    Employee employee = entry.getValue();

                    String cellValue = col < values.length ? values[col].trim() : "";
                    String status;
                    Long leaveTypeId = null;

                    if (cellValue.isEmpty()) {
                        status = isWeekend ? "WEEKEND" : "PRESENT";
                    } else {
                        String upperValue = cellValue.toUpperCase();
                        
                        if (isValidStatus(upperValue)) {
                            status = upperValue;
                        } else {
                            LeaveType leaveType = leaveTypeMap.get(upperValue);
                            if (leaveType != null) {
                                status = "LEAVE";
                                leaveTypeId = leaveType.getId();
                            } else {
                                // Try partial match
                                LeaveType matchedType = null;
                                for (Map.Entry<String, LeaveType> ltEntry : leaveTypeMap.entrySet()) {
                                    if (ltEntry.getKey().contains(upperValue) || upperValue.contains(ltEntry.getKey())) {
                                        matchedType = ltEntry.getValue();
                                        break;
                                    }
                                }
                                if (matchedType != null) {
                                    status = "LEAVE";
                                    leaveTypeId = matchedType.getId();
                                } else {
                                    warnings.add("Row " + (rowNum + 1) + ", Employee " + employee.getEmployeeId() + ": Unknown value '" + cellValue + "', marking as ABSENT");
                                    status = "ABSENT";
                                }
                            }
                        }
                    }

                    // Create or update attendance
                    try {
                        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), date)
                                .orElse(new Attendance());

                        boolean isNew = attendance.getId() == null;

                        attendance.setEmployeeId(employee.getId());
                        attendance.setOrganizationId(tenantId);
                        attendance.setDate(date);
                        attendance.setStatus(status);
                        attendance.setLeaveTypeId(leaveTypeId);

                        attendanceRepository.save(attendance);

                        if (isNew) {
                            successCount++;
                        } else {
                            updatedCount++;
                        }
                    } catch (Exception e) {
                        errors.add("Row " + (rowNum + 1) + ", Employee " + employee.getEmployeeId() + ": " + e.getMessage());
                        errorCount++;
                    }
                }
                rowNum++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", errors.isEmpty());
        result.put("successCount", successCount);
        result.put("updatedCount", updatedCount);
        result.put("errorCount", errorCount);
        result.put("errors", errors.size() > 20 ? errors.subList(0, 20) : errors);
        result.put("warnings", warnings.size() > 20 ? warnings.subList(0, 20) : warnings);
        result.put("totalProcessed", successCount + updatedCount + errorCount);

        log.info("CSV import completed: {} created, {} updated, {} errors", successCount, updatedCount, errorCount);

        return result;
    }
}
