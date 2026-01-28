package com.payroll.repository;

import com.payroll.entity.PayRunOneTimeComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayRunOneTimeComponentRepository extends JpaRepository<PayRunOneTimeComponent, Long> {

    List<PayRunOneTimeComponent> findByPayRunEmployeeIdAndTenantId(Long payRunEmployeeId, Long tenantId);

    List<PayRunOneTimeComponent> findByPayRunEmployeeId(Long payRunEmployeeId);

    void deleteByPayRunEmployeeId(Long payRunEmployeeId);

    void deleteByPayRunEmployeeIdIn(List<Long> payRunEmployeeIds);
}
