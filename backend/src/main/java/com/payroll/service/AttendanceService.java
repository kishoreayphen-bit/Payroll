package com.payroll.service;

import com.payroll.entity.Attendance;
import com.payroll.entity.Employee;
import com.payroll.entity.LeaveBalance;
import com.payroll.entity.LeaveType;
import com.payroll.repository.AttendanceRepository;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.LeaveBalanceRepository;
import com.payroll.repository.LeaveTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @Autowired
    private OrganizationSettingsService settingsService;

    public List<Attendance> getAttendanceByEmployee(Long employeeId, Long organizationId) {
        return attendanceRepository.findByEmployeeIdAndOrganizationId(employeeId, organizationId);
    }

    public List<Attendance> getAttendanceByDateRange(Long organizationId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByOrganizationIdAndDateBetween(organizationId, startDate, endDate);
    }

    public List<Attendance> getEmployeeAttendanceByDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
    }

    public List<Attendance> getAttendanceByMonthYear(Long organizationId, int month, int year) {
        return attendanceRepository.findByOrganizationIdAndMonthYear(organizationId, month, year);
    }

    @Transactional
    public Attendance markAttendance(Attendance attendance) {
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(
            attendance.getEmployeeId(), attendance.getDate());
        
        if (existing.isPresent()) {
            Attendance existingAttendance = existing.get();
            existingAttendance.setCheckInTime(attendance.getCheckInTime());
            existingAttendance.setCheckOutTime(attendance.getCheckOutTime());
            existingAttendance.setStatus(attendance.getStatus());
            existingAttendance.setRemarks(attendance.getRemarks());
            existingAttendance.setLeaveTypeId(attendance.getLeaveTypeId()); // FIX: Save leave type ID
            calculateWorkHours(existingAttendance);
            return attendanceRepository.save(existingAttendance);
        }
        
        calculateWorkHours(attendance);
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkIn(Long employeeId, Long organizationId) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setOrganizationId(organizationId);
        attendance.setDate(today);
        attendance.setCheckInTime(now);
        attendance.setStatus("PRESENT");
        
        LocalTime standardCheckIn = LocalTime.of(9, 0);
        if (now.isAfter(standardCheckIn)) {
            int lateMinutes = (int) ChronoUnit.MINUTES.between(standardCheckIn, now);
            attendance.setLateMinutes(lateMinutes);
        }
        
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);
        
        if (existing.isEmpty()) {
            throw new RuntimeException("No check-in found for today");
        }
        
        Attendance attendance = existing.get();
        attendance.setCheckOutTime(now);
        
        LocalTime standardCheckOut = LocalTime.of(18, 0);
        if (now.isBefore(standardCheckOut)) {
            int earlyMinutes = (int) ChronoUnit.MINUTES.between(now, standardCheckOut);
            attendance.setEarlyLeavingMinutes(earlyMinutes);
        }
        
        calculateWorkHours(attendance);
        return attendanceRepository.save(attendance);
    }

    public void calculateWorkHours(Attendance attendance) {
        if (attendance.getCheckInTime() != null && attendance.getCheckOutTime() != null) {
            long minutes = ChronoUnit.MINUTES.between(attendance.getCheckInTime(), attendance.getCheckOutTime());
            double hours = minutes / 60.0;
            attendance.setWorkHours(Math.round(hours * 100.0) / 100.0);
            
            if (hours > 9) {
                attendance.setOvertimeHours(Math.round((hours - 9) * 100.0) / 100.0);
            }
        }
    }

    @Transactional
    public void bulkMarkAttendance(Long organizationId, LocalDate date, List<Map<String, Object>> attendanceData) {
        for (Map<String, Object> data : attendanceData) {
            Long employeeId = Long.valueOf(data.get("employeeId").toString());
            String status = (String) data.get("status");
            
            Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);
            
            Attendance attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
            } else {
                attendance = new Attendance();
                attendance.setEmployeeId(employeeId);
                attendance.setOrganizationId(organizationId);
                attendance.setDate(date);
            }
            
            attendance.setStatus(status);
            if (data.containsKey("checkInTime")) {
                attendance.setCheckInTime(LocalTime.parse((String) data.get("checkInTime")));
            }
            if (data.containsKey("checkOutTime")) {
                attendance.setCheckOutTime(LocalTime.parse((String) data.get("checkOutTime")));
            }
            if (data.containsKey("remarks")) {
                attendance.setRemarks((String) data.get("remarks"));
            }
            
            calculateWorkHours(attendance);
            attendanceRepository.save(attendance);
        }
    }

    public Map<String, Object> getAttendanceSummary(Long employeeId, int month, int year) {
        List<Attendance> attendanceList = attendanceRepository.findByEmployeeIdAndMonthYear(employeeId, month, year);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalDays", attendanceList.size());
        summary.put("present", attendanceList.stream().filter(a -> "PRESENT".equals(a.getStatus())).count());
        summary.put("absent", attendanceList.stream().filter(a -> "ABSENT".equals(a.getStatus())).count());
        summary.put("halfDay", attendanceList.stream().filter(a -> "HALF_DAY".equals(a.getStatus())).count());
        summary.put("leave", attendanceList.stream().filter(a -> "LEAVE".equals(a.getStatus())).count());
        summary.put("holiday", attendanceList.stream().filter(a -> "HOLIDAY".equals(a.getStatus())).count());
        summary.put("weekend", attendanceList.stream().filter(a -> "WEEKEND".equals(a.getStatus())).count());
        
        double totalWorkHours = attendanceList.stream()
            .filter(a -> a.getWorkHours() != null)
            .mapToDouble(Attendance::getWorkHours)
            .sum();
        summary.put("totalWorkHours", Math.round(totalWorkHours * 100.0) / 100.0);
        
        double totalOvertime = attendanceList.stream()
            .filter(a -> a.getOvertimeHours() != null)
            .mapToDouble(Attendance::getOvertimeHours)
            .sum();
        summary.put("totalOvertimeHours", Math.round(totalOvertime * 100.0) / 100.0);
        
        return summary;
    }

    public Map<String, Object> getOrganizationAttendanceSummary(Long organizationId, LocalDate date) {
        List<Attendance> attendanceList = attendanceRepository.findByOrganizationIdAndDate(organizationId, date);
        List<Employee> employees = employeeRepository.findByStatusAndOrganizationId("Active", organizationId);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEmployees", employees.size());
        summary.put("present", attendanceList.stream().filter(a -> "PRESENT".equals(a.getStatus())).count());
        summary.put("absent", employees.size() - attendanceList.size());
        summary.put("onLeave", attendanceList.stream().filter(a -> "LEAVE".equals(a.getStatus())).count());
        summary.put("halfDay", attendanceList.stream().filter(a -> "HALF_DAY".equals(a.getStatus())).count());
        
        return summary;
    }

    @Transactional
    public void initializeMonthAttendance(Long organizationId, int month, int year) {
        List<Employee> employees = employeeRepository.findByStatusAndOrganizationId("Active", organizationId);
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        for (Employee employee : employees) {
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), date);
                if (existing.isEmpty()) {
                    Attendance attendance = new Attendance();
                    attendance.setEmployeeId(employee.getId());
                    attendance.setOrganizationId(organizationId);
                    attendance.setDate(date);
                    
                    DayOfWeek dayOfWeek = date.getDayOfWeek();
                    if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                        attendance.setStatus("WEEKEND");
                    } else {
                        attendance.setStatus("ABSENT");
                    }
                    
                    attendanceRepository.save(attendance);
                }
            }
        }
    }

    /**
     * Calculate LOP (Loss of Pay) days for an employee in a given month/year.
     * LOP occurs when:
     * 1. Employee is ABSENT (not on approved leave)
     * 2. Employee took unpaid leave (leave type with isPaid=false)
     * 3. Employee exceeded their leave balance and took leave without balance
     * 
     * This method checks each leave against the employee's YEAR-TO-DATE leave balance
     * to properly account for leaves taken in previous months of the same year.
     * 
     * @return number of LOP days (half days counted as 0.5)
     */
    public double calculateLopDays(Long employeeId, int month, int year) {
        log.info("=== CALCULATE LOP CALLED === Employee: {}, Month: {}, Year: {}", employeeId, month, year);
        
        List<Attendance> attendanceList = attendanceRepository.findByEmployeeIdAndMonthYear(employeeId, month, year);
        log.info("Found {} attendance records for month {}/{}", attendanceList.size(), month, year);
        
        // Log all attendance records with LEAVE status
        for (Attendance att : attendanceList) {
            if ("LEAVE".equals(att.getStatus())) {
                log.info("  - Date: {}, Status: LEAVE, LeaveTypeId: {}", att.getDate(), att.getLeaveTypeId());
            }
        }
        
        // Get ALL attendance records for this year UP TO (but not including) this month
        // to track cumulative leave usage from previous months
        LocalDate yearStart = LocalDate.of(year, 1, 1);
        LocalDate monthStart = LocalDate.of(year, month, 1);
        
        List<Attendance> previousMonthsAttendance = attendanceRepository
            .findByEmployeeIdAndDateBetween(employeeId, yearStart, monthStart.minusDays(1));
        
        // Calculate cumulative leave usage by type for previous months only
        Map<Long, Double> previousMonthsUsageByType = new HashMap<>();
        for (Attendance a : previousMonthsAttendance) {
            if ("LEAVE".equals(a.getStatus()) && a.getLeaveTypeId() != null) {
                DayOfWeek dayOfWeek = a.getDate().getDayOfWeek();
                // Skip weekends
                if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                    continue;
                }
                double currentUsage = previousMonthsUsageByType.getOrDefault(a.getLeaveTypeId(), 0.0);
                previousMonthsUsageByType.put(a.getLeaveTypeId(), currentUsage + 1.0);
            }
        }
        
        log.info("Employee {}: Previous months usage: {}", employeeId, previousMonthsUsageByType);
        
        // First pass: Count total leaves by type in current month (excluding unpaid leaves)
        Map<Long, Double> currentMonthUsageByType = new HashMap<>();
        Map<Long, LeaveType> leaveTypeCache = new HashMap<>();
        
        for (Attendance a : attendanceList) {
            DayOfWeek dayOfWeek = a.getDate().getDayOfWeek();
            // Skip weekends
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                continue;
            }
            
            if ("LEAVE".equals(a.getStatus()) && a.getLeaveTypeId() != null) {
                LeaveType leaveType = leaveTypeCache.computeIfAbsent(a.getLeaveTypeId(), 
                    id -> leaveTypeRepository.findById(id).orElse(null));
                
                if (leaveType != null && (leaveType.getIsPaid() == null || leaveType.getIsPaid())) {
                    // Only count paid leaves for balance checking
                    double currentUsage = currentMonthUsageByType.getOrDefault(a.getLeaveTypeId(), 0.0);
                    currentMonthUsageByType.put(a.getLeaveTypeId(), currentUsage + 1.0);
                }
            }
        }
        
        // Calculate excess leaves (LOP) by type
        Map<Long, Double> excessLeavesByType = new HashMap<>();
        for (Map.Entry<Long, Double> entry : currentMonthUsageByType.entrySet()) {
            Long leaveTypeId = entry.getKey();
            double currentMonthUsage = entry.getValue();
            double previousUsage = previousMonthsUsageByType.getOrDefault(leaveTypeId, 0.0);
            double totalUsage = previousUsage + currentMonthUsage;
            
            LeaveType leaveType = leaveTypeCache.get(leaveTypeId);
            if (leaveType != null) {
                double totalAllocation = leaveType.getDaysPerYear();
                
                log.info("Employee {}: Leave Type: {}, Previous: {}, Current: {}, Total: {}, Limit: {}", 
                    employeeId, leaveType.getName(), previousUsage, currentMonthUsage, totalUsage, totalAllocation);
                
                if (totalUsage > totalAllocation) {
                    double excess = totalUsage - totalAllocation;
                    excessLeavesByType.put(leaveTypeId, excess);
                    log.info("Employee {}: Leave Type {} EXCEEDS allocation by {} days", 
                        employeeId, leaveType.getName(), excess);
                }
            }
        }
        
        // Second pass: Calculate actual LOP days
        double lopDays = 0.0;
        Map<Long, Double> lopCountedByType = new HashMap<>();
        
        for (Attendance a : attendanceList) {
            DayOfWeek dayOfWeek = a.getDate().getDayOfWeek();
            // Skip weekends
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                continue;
            }
            
            // ABSENT days are always LOP
            if ("ABSENT".equals(a.getStatus())) {
                lopDays += 1.0;
            } 
            // HALF_DAY without leave type is LOP
            else if ("HALF_DAY".equals(a.getStatus()) && a.getLeaveTypeId() == null) {
                lopDays += 0.5;
            }
            // LEAVE status - check if it's paid or unpaid
            else if ("LEAVE".equals(a.getStatus()) && a.getLeaveTypeId() != null) {
                LeaveType leaveType = leaveTypeCache.get(a.getLeaveTypeId());
                
                if (leaveType != null) {
                    // If leave type is marked as unpaid, it's always LOP
                    if (leaveType.getIsPaid() != null && !leaveType.getIsPaid()) {
                        lopDays += 1.0;
                        continue;
                    }
                    
                    // For paid leave types, check if there's excess to deduct
                    Double excessForType = excessLeavesByType.get(a.getLeaveTypeId());
                    if (excessForType != null && excessForType > 0) {
                        double alreadyCounted = lopCountedByType.getOrDefault(a.getLeaveTypeId(), 0.0);
                        if (alreadyCounted < excessForType) {
                            // This leave counts as LOP (part of the excess)
                            lopDays += 1.0;
                            lopCountedByType.put(a.getLeaveTypeId(), alreadyCounted + 1.0);
                            log.info("Employee {}: Leave on {} marked as LOP (excess leave)", 
                                employeeId, a.getDate());
                        }
                    }
                } else {
                    // If leave type not found, treat as LOP
                    lopDays += 1.0;
                }
            }
        }
        
        log.info("Employee {}: Month {}/{} - Total LOP Days: {}", employeeId, month, year, lopDays);
        return lopDays;
    }
    
    /**
     * Calculate total working days in a month (excluding weekends)
     */
    public int calculateWorkingDaysInMonth(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        int workingDays = 0;
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
                workingDays++;
            }
        }
        return workingDays;
    }
    
    /**
     * Calculate days actually worked (present + paid leaves)
     */
    public double calculateDaysWorked(Long employeeId, int month, int year) {
        List<Attendance> attendanceList = attendanceRepository.findByEmployeeIdAndMonthYear(employeeId, month, year);
        
        double daysWorked = 0.0;
        for (Attendance a : attendanceList) {
            DayOfWeek dayOfWeek = a.getDate().getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                continue;
            }
            
            if ("PRESENT".equals(a.getStatus()) || "LEAVE".equals(a.getStatus())) {
                daysWorked += 1.0;
            } else if ("HALF_DAY".equals(a.getStatus())) {
                daysWorked += 0.5;
            }
        }
        
        return daysWorked;
    }

    /**
     * Mark all employees present for a specific date
     */
    @Transactional
    public void markAllEmployeesPresent(Long tenantId, LocalDate date) {
        // Skip weekends
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Cannot mark attendance for weekends");
        }

        List<Employee> employees = employeeRepository.findByOrganizationId(tenantId);
        
        for (Employee employee : employees) {
            // Check if attendance already exists
            var existing = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), date);
            
            if (existing.isEmpty()) {
                Attendance attendance = new Attendance();
                attendance.setEmployeeId(employee.getId());
                attendance.setOrganizationId(tenantId);
                attendance.setDate(date);
                attendance.setStatus("PRESENT");
                attendance.setCheckInTime(LocalTime.of(9, 0));
                attendance.setCheckOutTime(LocalTime.of(18, 0));
                attendance.setWorkHours(9.0);
                attendanceRepository.save(attendance);
            }
        }
    }

    /**
     * Mark an employee's attendance for entire month
     */
    @Transactional
    public void markEmployeeForMonth(Long employeeId, Long tenantId, int month, int year, String status) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            // Skip weekends
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                continue;
            }
            
            // Check if attendance already exists
            var existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, date);
            
            if (existing.isEmpty()) {
                Attendance attendance = new Attendance();
                attendance.setEmployeeId(employeeId);
                attendance.setOrganizationId(tenantId);
                attendance.setDate(date);
                attendance.setStatus(status);
                
                if ("PRESENT".equals(status)) {
                    attendance.setCheckInTime(LocalTime.of(9, 0));
                    attendance.setCheckOutTime(LocalTime.of(18, 0));
                    attendance.setWorkHours(9.0);
                }
                
                attendanceRepository.save(attendance);
            }
        }
    }

    /**
     * Mark all employees' attendance for entire month
     */
    @Transactional
    public void markAllEmployeesForMonth(Long tenantId, int month, int year, String status) {
        List<Employee> employees = employeeRepository.findByOrganizationId(tenantId);
        
        for (Employee employee : employees) {
            markEmployeeForMonth(employee.getId(), tenantId, month, year, status);
        }
    }

    /**
     * Auto-initialize attendance for all employees for a month
     * - Automatically initializes government holidays if not already done
     * - Uses organization settings for weekend rules
     * - Marks holidays based on organization holiday list
     * - Marks working days as PRESENT by default
     * - Only creates records that don't already exist
     */
    @Transactional
    public void autoInitializeAttendanceForMonth(Long tenantId, int month, int year) {
        // Auto-initialize holidays for the year if not already done
        System.out.println("Initializing default holidays for year: " + year);
        settingsService.initializeDefaultHolidays(tenantId, year);
        
        List<Employee> employees = employeeRepository.findByOrganizationId(tenantId);
        System.out.println("Found " + employees.size() + " employees");
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        // Get holidays for this month
        List<com.payroll.entity.Holiday> holidays = settingsService.getHolidaysForMonth(tenantId, month, year);
        System.out.println("Found " + holidays.size() + " holidays for month " + month + "/" + year);
        for (com.payroll.entity.Holiday h : holidays) {
            System.out.println("  - " + h.getName() + " on " + h.getHolidayDate());
        }
        
        Set<LocalDate> holidayDates = holidays.stream()
            .map(com.payroll.entity.Holiday::getHolidayDate)
            .collect(Collectors.toSet());
        
        for (Employee employee : employees) {
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                // Check if attendance already exists
                var existing = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), date);
                
                if (existing.isEmpty()) {
                    Attendance attendance = new Attendance();
                    attendance.setEmployeeId(employee.getId());
                    attendance.setOrganizationId(tenantId);
                    attendance.setDate(date);
                    
                    // Check if it's a holiday first
                    if (holidayDates.contains(date)) {
                        attendance.setStatus("HOLIDAY");
                        // Set holiday ID if available
                        settingsService.getHolidayForDate(tenantId, date)
                            .ifPresent(h -> attendance.setHolidayId(h.getId()));
                    }
                    // Check if it's a weekend based on organization settings
                    else if (settingsService.isWeekend(tenantId, date)) {
                        attendance.setStatus("WEEKEND");
                    } else {
                        // Mark working days as PRESENT by default
                        attendance.setStatus("PRESENT");
                        attendance.setCheckInTime(LocalTime.of(9, 0));
                        attendance.setCheckOutTime(LocalTime.of(18, 0));
                        attendance.setWorkHours(9.0);
                    }
                    
                    attendanceRepository.save(attendance);
                }
            }
        }
    }

    /**
     * Reset/Clear all attendance records for a specific month
     * Allows starting fresh with attendance marking
     */
    @Transactional
    public int resetAttendanceForMonth(Long tenantId, int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        // Get all attendance records for the month and organization
        List<Attendance> attendanceRecords = attendanceRepository
            .findByOrganizationIdAndDateBetween(tenantId, startDate, endDate);
        
        int deletedCount = attendanceRecords.size();
        
        // Delete all records
        attendanceRepository.deleteAll(attendanceRecords);
        
        return deletedCount;
    }
}
