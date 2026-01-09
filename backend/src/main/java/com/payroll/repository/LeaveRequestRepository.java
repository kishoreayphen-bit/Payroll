package com.payroll.repository;

import com.payroll.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeId(Long employeeId);

    List<LeaveRequest> findByOrganizationId(Long organizationId);

    List<LeaveRequest> findByOrganizationIdAndStatus(Long organizationId, String status);

    List<LeaveRequest> findByEmployeeIdAndStatus(Long employeeId, String status);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employeeId = :empId AND lr.startDate <= :endDate AND lr.endDate >= :startDate")
    List<LeaveRequest> findOverlappingLeaves(@Param("empId") Long employeeId, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.organizationId = :orgId AND lr.status = 'PENDING' ORDER BY lr.createdAt DESC")
    List<LeaveRequest> findPendingByOrganizationId(@Param("orgId") Long organizationId);

    @Query("SELECT SUM(lr.totalDays) FROM LeaveRequest lr WHERE lr.employeeId = :empId AND lr.leaveTypeId = :typeId AND lr.status = 'APPROVED' AND YEAR(lr.startDate) = :year")
    Double sumApprovedLeavesByEmployeeAndType(@Param("empId") Long employeeId, 
                                               @Param("typeId") Long leaveTypeId, 
                                               @Param("year") int year);
}
