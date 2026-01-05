package com.payroll.service;

import com.payroll.dto.PayScheduleDTO;
import com.payroll.entity.PaySchedule;
import com.payroll.repository.PayScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PayScheduleService {

    @Autowired
    private PayScheduleRepository payScheduleRepository;

    public List<PayScheduleDTO> getPaySchedulesByOrganization(Long organizationId) {
        return payScheduleRepository.findByOrganizationId(organizationId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PayScheduleDTO> getActivePaySchedules(Long organizationId) {
        return payScheduleRepository.findByOrganizationIdAndIsActiveTrue(organizationId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PayScheduleDTO getPayScheduleById(Long id, Long organizationId) {
        PaySchedule schedule = payScheduleRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new RuntimeException("Pay schedule not found"));
        return toDTO(schedule);
    }

    public PayScheduleDTO getDefaultPaySchedule(Long organizationId) {
        return payScheduleRepository.findByOrganizationIdAndIsDefaultTrue(organizationId)
                .map(this::toDTO)
                .orElse(null);
    }

    @Transactional
    public PayScheduleDTO createPaySchedule(PayScheduleDTO dto) {
        // Check for duplicate name
        if (payScheduleRepository.existsByOrganizationIdAndScheduleName(dto.getOrganizationId(), dto.getScheduleName())) {
            throw new RuntimeException("A pay schedule with this name already exists");
        }

        PaySchedule schedule = new PaySchedule();
        updateEntityFromDTO(schedule, dto);

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            unsetOtherDefaults(dto.getOrganizationId(), null);
        }

        PaySchedule saved = payScheduleRepository.save(schedule);
        return toDTO(saved);
    }

    @Transactional
    public PayScheduleDTO updatePaySchedule(Long id, PayScheduleDTO dto) {
        PaySchedule schedule = payScheduleRepository.findByIdAndOrganizationId(id, dto.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Pay schedule not found"));

        // Check for duplicate name (excluding current)
        if (payScheduleRepository.existsByOrganizationIdAndScheduleNameAndIdNot(
                dto.getOrganizationId(), dto.getScheduleName(), id)) {
            throw new RuntimeException("A pay schedule with this name already exists");
        }

        updateEntityFromDTO(schedule, dto);

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            unsetOtherDefaults(dto.getOrganizationId(), id);
        }

        PaySchedule saved = payScheduleRepository.save(schedule);
        return toDTO(saved);
    }

    @Transactional
    public void deletePaySchedule(Long id, Long organizationId) {
        PaySchedule schedule = payScheduleRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new RuntimeException("Pay schedule not found"));
        
        // Soft delete - just mark as inactive
        schedule.setIsActive(false);
        payScheduleRepository.save(schedule);
    }

    @Transactional
    public PayScheduleDTO setAsDefault(Long id, Long organizationId) {
        PaySchedule schedule = payScheduleRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new RuntimeException("Pay schedule not found"));

        // Unset other defaults
        unsetOtherDefaults(organizationId, id);

        schedule.setIsDefault(true);
        PaySchedule saved = payScheduleRepository.save(schedule);
        return toDTO(saved);
    }

    private void unsetOtherDefaults(Long organizationId, Long excludeId) {
        List<PaySchedule> schedules = payScheduleRepository.findByOrganizationId(organizationId);
        for (PaySchedule s : schedules) {
            if (!s.getId().equals(excludeId) && Boolean.TRUE.equals(s.getIsDefault())) {
                s.setIsDefault(false);
                payScheduleRepository.save(s);
            }
        }
    }

    private void updateEntityFromDTO(PaySchedule entity, PayScheduleDTO dto) {
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setScheduleName(dto.getScheduleName());
        entity.setPayFrequency(dto.getPayFrequency());
        entity.setPayDay(dto.getPayDay());
        entity.setWeekDay(dto.getWeekDay());
        entity.setFirstPayDay(dto.getFirstPayDay());
        entity.setSecondPayDay(dto.getSecondPayDay());
        entity.setCutOffDays(dto.getCutOffDays());
        entity.setProcessingDays(dto.getProcessingDays());
        entity.setEffectiveFrom(dto.getEffectiveFrom());
        entity.setIsDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false);
        entity.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
    }

    private PayScheduleDTO toDTO(PaySchedule entity) {
        PayScheduleDTO dto = new PayScheduleDTO();
        dto.setId(entity.getId());
        dto.setOrganizationId(entity.getOrganizationId());
        dto.setScheduleName(entity.getScheduleName());
        dto.setPayFrequency(entity.getPayFrequency());
        dto.setPayDay(entity.getPayDay());
        dto.setWeekDay(entity.getWeekDay());
        dto.setFirstPayDay(entity.getFirstPayDay());
        dto.setSecondPayDay(entity.getSecondPayDay());
        dto.setCutOffDays(entity.getCutOffDays());
        dto.setProcessingDays(entity.getProcessingDays());
        dto.setEffectiveFrom(entity.getEffectiveFrom());
        dto.setIsDefault(entity.getIsDefault());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
