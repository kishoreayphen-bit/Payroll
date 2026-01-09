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
import java.time.LocalTime;
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

    @Autowired
    private AttendanceService attendanceService;

    @Transactional
    public Map<String, Object> importAttendanceFromExcel(MultipartFile file, Long tenantId) throws IOException {
        log.info("Starting attendance import for tenant: {}", tenantId);

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
            List<LeaveType> leaveTypes = leaveTypeRepository.findByOrganizationIdAndIsActiveTrue(tenantId);
            Map<String, LeaveType> leaveTypeMap = new HashMap<>();
            for (LeaveType lt : leaveTypes) {
                leaveTypeMap.put(lt.getName().toUpperCase(), lt);
                leaveTypeMap.put(lt.getCode().toUpperCase(), lt);
            }

            // Process data rows (skip header)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || isRowEmpty(row)) {
                    continue;
                }

                try {
                    // Parse row data
                    String employeeId = getCellValueAsString(row.getCell(0));
                    String dateStr = getCellValueAsString(row.getCell(1));
                    String status = getCellValueAsString(row.getCell(2));
                    String leaveTypeName = getCellValueAsString(row.getCell(3));
                    String checkInTime = getCellValueAsString(row.getCell(4));
                    String checkOutTime = getCellValueAsString(row.getCell(5));
                    String remarks = getCellValueAsString(row.getCell(6));

                    // Validate required fields
                    if (employeeId == null || employeeId.trim().isEmpty()) {
                        errors.add("Row " + (i + 1) + ": Employee ID is required");
                        errorCount++;
                        continue;
                    }

                    if (dateStr == null || dateStr.trim().isEmpty()) {
                        errors.add("Row " + (i + 1) + ": Date is required");
                        errorCount++;
                        continue;
                    }

                    if (status == null || status.trim().isEmpty()) {
                        errors.add("Row " + (i + 1) + ": Status is required");
                        errorCount++;
                        continue;
                    }

                    // Find employee
                    Employee employee = employeeRepository.findByEmployeeIdAndOrganizationId(employeeId.trim(), tenantId)
                            .orElse(null);
                    if (employee == null) {
                        errors.add("Row " + (i + 1) + ": Employee not found: " + employeeId);
                        errorCount++;
                        continue;
                    }

                    // Parse date
                    LocalDate date = parseDate(dateStr);
                    if (date == null) {
                        errors.add("Row " + (i + 1) + ": Invalid date format: " + dateStr + " (use YYYY-MM-DD or DD/MM/YYYY)");
                        errorCount++;
                        continue;
                    }

                    // Validate status
                    status = status.trim().toUpperCase();
                    if (!isValidStatus(status)) {
                        errors.add("Row " + (i + 1) + ": Invalid status: " + status + " (use PRESENT, ABSENT, LEAVE, HALF_DAY, HOLIDAY, WEEKEND)");
                        errorCount++;
                        continue;
                    }

                    // Create or update attendance
                    Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), date)
                            .orElse(new Attendance());

                    boolean isNew = attendance.getId() == null;

                    attendance.setEmployeeId(employee.getId());
                    attendance.setOrganizationId(tenantId);
                    attendance.setDate(date);
                    attendance.setStatus(status);
                    attendance.setRemarks(remarks != null && !remarks.trim().isEmpty() ? remarks.trim() : null);

                    // Handle leave type for LEAVE status
                    if ("LEAVE".equals(status)) {
                        if (leaveTypeName != null && !leaveTypeName.trim().isEmpty()) {
                            LeaveType leaveType = leaveTypeMap.get(leaveTypeName.trim().toUpperCase());
                            if (leaveType != null) {
                                attendance.setLeaveTypeId(leaveType.getId());
                            } else {
                                warnings.add("Row " + (i + 1) + ": Leave type not found: " + leaveTypeName + ", attendance marked without leave type");
                            }
                        } else {
                            warnings.add("Row " + (i + 1) + ": Leave type not specified for LEAVE status");
                        }
                    } else {
                        attendance.setLeaveTypeId(null);
                    }

                    // Handle check-in/out times for PRESENT status
                    if ("PRESENT".equals(status) || "HALF_DAY".equals(status)) {
                        if (checkInTime != null && !checkInTime.trim().isEmpty()) {
                            LocalTime checkIn = parseTime(checkInTime);
                            if (checkIn != null) {
                                attendance.setCheckInTime(checkIn);
                            }
                        }
                        if (checkOutTime != null && !checkOutTime.trim().isEmpty()) {
                            LocalTime checkOut = parseTime(checkOutTime);
                            if (checkOut != null) {
                                attendance.setCheckOutTime(checkOut);
                            }
                        }
                    }

                    // Calculate work hours
                    attendanceService.calculateWorkHours(attendance);

                    // Save attendance
                    attendanceRepository.save(attendance);

                    if (isNew) {
                        successCount++;
                    } else {
                        updatedCount++;
                    }

                } catch (Exception e) {
                    log.error("Error processing row {}: {}", i + 1, e.getMessage());
                    errors.add("Row " + (i + 1) + ": " + e.getMessage());
                    errorCount++;
                }
            }
        }

        log.info("Import completed: {} created, {} updated, {} errors", successCount, updatedCount, errorCount);

        Map<String, Object> result = new HashMap<>();
        result.put("success", errorCount == 0);
        result.put("successCount", successCount);
        result.put("updatedCount", updatedCount);
        result.put("errorCount", errorCount);
        result.put("errors", errors);
        result.put("warnings", warnings);
        result.put("totalProcessed", successCount + updatedCount + errorCount);

        return result;
    }

    private boolean isRowEmpty(Row row) {
        for (int i = 0; i < 7; i++) {
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                String value = getCellValueAsString(cell);
                if (value != null && !value.trim().isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

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

        // Try different date formats
        String[] formats = {
                "yyyy-MM-dd",
                "dd/MM/yyyy",
                "dd-MM-yyyy",
                "MM/dd/yyyy",
                "yyyy/MM/dd"
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

    private LocalTime parseTime(String timeStr) {
        if (timeStr == null || timeStr.trim().isEmpty()) {
            return null;
        }

        timeStr = timeStr.trim();

        // Try different time formats
        String[] formats = {
                "HH:mm",
                "HH:mm:ss",
                "h:mm a",
                "h:mm:ss a"
        };

        for (String format : formats) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                return LocalTime.parse(timeStr, formatter);
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

            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "Employee ID*",
                    "Date* (YYYY-MM-DD)",
                    "Status* (PRESENT/ABSENT/LEAVE/HALF_DAY/HOLIDAY/WEEKEND)",
                    "Leave Type (for LEAVE status)",
                    "Check In Time (HH:mm)",
                    "Check Out Time (HH:mm)",
                    "Remarks"
            };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 6000);
            }

            // Add sample data rows
            String[][] sampleData = {
                    {"EMP001", "2026-01-15", "PRESENT", "", "09:00", "18:00", ""},
                    {"EMP001", "2026-01-16", "LEAVE", "Sick Leave", "", "", "Sick"},
                    {"EMP002", "2026-01-15", "HALF_DAY", "", "09:00", "13:00", "Personal work"},
                    {"EMP002", "2026-01-16", "ABSENT", "", "", "", ""}
            };

            for (int i = 0; i < sampleData.length; i++) {
                Row row = sheet.createRow(i + 1);
                for (int j = 0; j < sampleData[i].length; j++) {
                    row.createCell(j).setCellValue(sampleData[i][j]);
                }
            }

            // Write to byte array
            java.io.ByteArrayOutputStream outputStream = new java.io.ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
}
