package com.payroll.service;

import com.payroll.entity.*;
import com.payroll.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.*;

@Service
public class LeaveService {

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    // Leave Types
    public List<LeaveType> getLeaveTypes(Long organizationId) {
        return leaveTypeRepository.findByOrganizationId(organizationId);
    }

    public List<LeaveType> getActiveLeaveTypes(Long organizationId) {
        return leaveTypeRepository.findByOrganizationIdAndIsActiveTrue(organizationId);
    }

    @Transactional
    public LeaveType createLeaveType(LeaveType leaveType) {
        return leaveTypeRepository.save(leaveType);
    }

    @Transactional
    public LeaveType updateLeaveType(Long id, LeaveType leaveType) {
        LeaveType existing = leaveTypeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leave type not found"));
        
        existing.setName(leaveType.getName());
        existing.setCode(leaveType.getCode());
        existing.setDescription(leaveType.getDescription());
        existing.setDaysPerYear(leaveType.getDaysPerYear());
        existing.setIsPaid(leaveType.getIsPaid());
        existing.setIsCarryForward(leaveType.getIsCarryForward());
        existing.setMaxCarryForwardDays(leaveType.getMaxCarryForwardDays());
        existing.setIsEncashable(leaveType.getIsEncashable());
        existing.setMaxEncashmentDays(leaveType.getMaxEncashmentDays());
        existing.setIsActive(leaveType.getIsActive());
        existing.setColor(leaveType.getColor());
        
        return leaveTypeRepository.save(existing);
    }

    @Transactional
    public void initializeDefaultLeaveTypes(Long organizationId) {
        List<LeaveType> existingTypes = leaveTypeRepository.findByOrganizationId(organizationId);
        if (!existingTypes.isEmpty()) return;

        List<LeaveType> defaultTypes = Arrays.asList(
            createDefaultLeaveType(organizationId, "Casual Leave", "CL", "For personal matters", 12, true, false, "#3B82F6"),
            createDefaultLeaveType(organizationId, "Sick Leave", "SL", "For health-related absences", 12, true, false, "#EF4444"),
            createDefaultLeaveType(organizationId, "Earned Leave", "EL", "Privilege/Annual leave", 15, true, true, "#10B981"),
            createDefaultLeaveType(organizationId, "Maternity Leave", "ML", "For maternity", 182, true, false, "#EC4899"),
            createDefaultLeaveType(organizationId, "Paternity Leave", "PL", "For paternity", 15, true, false, "#8B5CF6"),
            createDefaultLeaveType(organizationId, "Comp Off", "CO", "Compensatory off", 0, true, false, "#F59E0B"),
            createDefaultLeaveType(organizationId, "Loss of Pay", "LOP", "Unpaid leave", 0, false, false, "#6B7280")
        );

        leaveTypeRepository.saveAll(defaultTypes);
    }

    private LeaveType createDefaultLeaveType(Long orgId, String name, String code, String desc, 
                                              int days, boolean paid, boolean carryForward, String color) {
        LeaveType type = new LeaveType();
        type.setOrganizationId(orgId);
        type.setName(name);
        type.setCode(code);
        type.setDescription(desc);
        type.setDaysPerYear(days);
        type.setIsPaid(paid);
        type.setIsCarryForward(carryForward);
        type.setColor(color);
        type.setIsActive(true);
        return type;
    }

    // Leave Requests
    public List<LeaveRequest> getLeaveRequests(Long organizationId) {
        return leaveRequestRepository.findByOrganizationId(organizationId);
    }

    public List<LeaveRequest> getEmployeeLeaveRequests(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getPendingLeaveRequests(Long organizationId) {
        return leaveRequestRepository.findPendingByOrganizationId(organizationId);
    }

    @Transactional
    public LeaveRequest applyLeave(LeaveRequest request) {
        // Check for overlapping leaves
        List<LeaveRequest> overlapping = leaveRequestRepository.findOverlappingLeaves(
            request.getEmployeeId(), request.getStartDate(), request.getEndDate());
        
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Leave already applied for this period");
        }

        // Calculate total days (excluding weekends)
        double totalDays = calculateLeaveDays(request.getStartDate(), request.getEndDate(), request.getIsHalfDay());
        request.setTotalDays(totalDays);

        // Check balance
        LeaveBalance balance = getOrCreateBalance(request.getEmployeeId(), request.getLeaveTypeId(), Year.now().getValue());
        if (balance.getAvailableBalance() < totalDays) {
            LeaveType leaveType = leaveTypeRepository.findById(request.getLeaveTypeId()).orElse(null);
            if (leaveType != null && !"LOP".equals(leaveType.getCode())) {
                throw new RuntimeException("Insufficient leave balance");
            }
        }

        request.setStatus("PENDING");
        return leaveRequestRepository.save(request);
    }

    @Transactional
    public LeaveRequest approveLeave(Long requestId, Long approvedBy) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Leave request is not pending");
        }

        request.setStatus("APPROVED");
        request.setApprovedBy(approvedBy);
        request.setApprovedAt(LocalDateTime.now());

        // Deduct from balance
        LeaveBalance balance = getOrCreateBalance(request.getEmployeeId(), request.getLeaveTypeId(), Year.now().getValue());
        balance.setUsed(balance.getUsed() + request.getTotalDays());
        leaveBalanceRepository.save(balance);

        // Mark attendance as LEAVE
        markLeaveInAttendance(request);

        return leaveRequestRepository.save(request);
    }

    @Transactional
    public LeaveRequest rejectLeave(Long requestId, Long rejectedBy, String reason) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Leave request is not pending");
        }

        request.setStatus("REJECTED");
        request.setApprovedBy(rejectedBy);
        request.setApprovedAt(LocalDateTime.now());
        request.setRejectionReason(reason);

        return leaveRequestRepository.save(request);
    }

    @Transactional
    public LeaveRequest cancelLeave(Long requestId) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if ("APPROVED".equals(request.getStatus())) {
            // Restore balance
            LeaveBalance balance = getOrCreateBalance(request.getEmployeeId(), request.getLeaveTypeId(), Year.now().getValue());
            balance.setUsed(balance.getUsed() - request.getTotalDays());
            leaveBalanceRepository.save(balance);

            // Remove from attendance
            removeLeaveFromAttendance(request);
        }

        request.setStatus("CANCELLED");
        return leaveRequestRepository.save(request);
    }

    private void markLeaveInAttendance(LeaveRequest request) {
        for (LocalDate date = request.getStartDate(); !date.isAfter(request.getEndDate()); date = date.plusDays(1)) {
            if (date.getDayOfWeek() != DayOfWeek.SATURDAY && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(request.getEmployeeId(), date);
                
                Attendance attendance;
                if (existing.isPresent()) {
                    attendance = existing.get();
                } else {
                    attendance = new Attendance();
                    attendance.setEmployeeId(request.getEmployeeId());
                    attendance.setOrganizationId(request.getOrganizationId());
                    attendance.setDate(date);
                }
                
                if (request.getIsHalfDay() != null && request.getIsHalfDay()) {
                    attendance.setStatus("HALF_DAY");
                } else {
                    attendance.setStatus("LEAVE");
                }
                attendance.setRemarks("Leave: " + request.getReason());
                
                // Set leave type and request references for LOP calculation
                attendance.setLeaveTypeId(request.getLeaveTypeId());
                attendance.setLeaveRequestId(request.getId());
                
                attendanceRepository.save(attendance);
            }
        }
    }

    private void removeLeaveFromAttendance(LeaveRequest request) {
        for (LocalDate date = request.getStartDate(); !date.isAfter(request.getEndDate()); date = date.plusDays(1)) {
            Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(request.getEmployeeId(), date);
            if (existing.isPresent() && ("LEAVE".equals(existing.get().getStatus()) || "HALF_DAY".equals(existing.get().getStatus()))) {
                attendanceRepository.delete(existing.get());
            }
        }
    }

    private double calculateLeaveDays(LocalDate startDate, LocalDate endDate, Boolean isHalfDay) {
        if (isHalfDay != null && isHalfDay) {
            return 0.5;
        }

        double days = 0;
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            if (date.getDayOfWeek() != DayOfWeek.SATURDAY && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                days++;
            }
        }
        return days;
    }

    // Leave Balances
    public List<LeaveBalance> getEmployeeBalances(Long employeeId, int year) {
        return leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year);
    }

    public List<Map<String, Object>> getEmployeeBalancesWithDetails(Long employeeId, Long organizationId, int year) {
        List<LeaveType> leaveTypes = leaveTypeRepository.findByOrganizationIdAndIsActiveTrue(organizationId);
        List<Map<String, Object>> balances = new ArrayList<>();

        for (LeaveType type : leaveTypes) {
            LeaveBalance balance = getOrCreateBalance(employeeId, type.getId(), year);
            
            Map<String, Object> balanceMap = new HashMap<>();
            balanceMap.put("leaveTypeId", type.getId());
            balanceMap.put("leaveTypeName", type.getName());
            balanceMap.put("leaveTypeCode", type.getCode());
            balanceMap.put("color", type.getColor());
            balanceMap.put("allocated", type.getDaysPerYear());
            balanceMap.put("used", balance.getUsed());
            balanceMap.put("available", balance.getAvailableBalance());
            balanceMap.put("carryForward", balance.getCarryForward());
            
            balances.add(balanceMap);
        }

        return balances;
    }

    private LeaveBalance getOrCreateBalance(Long employeeId, Long leaveTypeId, int year) {
        return leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(employeeId, leaveTypeId, year)
            .orElseGet(() -> {
                LeaveType type = leaveTypeRepository.findById(leaveTypeId).orElse(null);
                
                LeaveBalance balance = new LeaveBalance();
                balance.setEmployeeId(employeeId);
                balance.setLeaveTypeId(leaveTypeId);
                balance.setYear(year);
                balance.setOpeningBalance(type != null ? type.getDaysPerYear().doubleValue() : 0.0);
                balance.setUsed(0.0);
                balance.setAccrued(0.0);
                balance.setAdjustment(0.0);
                balance.setCarryForward(0.0);
                balance.setEncashed(0.0);
                
                if (type != null) {
                    balance.setOrganizationId(type.getOrganizationId());
                }
                
                return leaveBalanceRepository.save(balance);
            });
    }

    @Transactional
    public void adjustBalance(Long employeeId, Long leaveTypeId, int year, double adjustment, String reason) {
        LeaveBalance balance = getOrCreateBalance(employeeId, leaveTypeId, year);
        balance.setAdjustment(balance.getAdjustment() + adjustment);
        leaveBalanceRepository.save(balance);
    }
}
