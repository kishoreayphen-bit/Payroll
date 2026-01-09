package com.payroll.service;

import com.payroll.entity.OrganizationSettings;
import com.payroll.entity.Holiday;
import com.payroll.repository.OrganizationSettingsRepository;
import com.payroll.repository.HolidayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class OrganizationSettingsService {

    @Autowired
    private OrganizationSettingsRepository settingsRepository;

    @Autowired
    private HolidayRepository holidayRepository;

    public OrganizationSettings getOrCreateSettings(Long organizationId) {
        return settingsRepository.findByOrganizationId(organizationId)
            .orElseGet(() -> {
                OrganizationSettings settings = new OrganizationSettings();
                settings.setOrganizationId(organizationId);
                return settingsRepository.save(settings);
            });
    }

    public OrganizationSettings updateSettings(Long organizationId, OrganizationSettings updatedSettings) {
        OrganizationSettings settings = getOrCreateSettings(organizationId);
        
        if (updatedSettings.getSaturdayRule() != null) {
            settings.setSaturdayRule(updatedSettings.getSaturdayRule());
        }
        if (updatedSettings.getSundayOff() != null) {
            settings.setSundayOff(updatedSettings.getSundayOff());
        }
        if (updatedSettings.getHolidayWorkEnabled() != null) {
            settings.setHolidayWorkEnabled(updatedSettings.getHolidayWorkEnabled());
        }
        if (updatedSettings.getHolidayCompensationType() != null) {
            settings.setHolidayCompensationType(updatedSettings.getHolidayCompensationType());
        }
        if (updatedSettings.getHolidayPayMultiplier() != null) {
            settings.setHolidayPayMultiplier(updatedSettings.getHolidayPayMultiplier());
        }
        if (updatedSettings.getAutoMarkGovtHolidays() != null) {
            settings.setAutoMarkGovtHolidays(updatedSettings.getAutoMarkGovtHolidays());
        }
        if (updatedSettings.getStateCode() != null) {
            settings.setStateCode(updatedSettings.getStateCode());
        }
        
        return settingsRepository.save(settings);
    }

    /**
     * Check if a given Saturday should be off based on organization settings
     */
    public boolean isSaturdayOff(Long organizationId, LocalDate date) {
        if (date.getDayOfWeek() != DayOfWeek.SATURDAY) {
            return false;
        }

        OrganizationSettings settings = getOrCreateSettings(organizationId);
        String saturdayRule = settings.getSaturdayRule();

        if (saturdayRule == null || saturdayRule.equals("ALL_SATURDAYS_OFF")) {
            return true;
        }

        if (saturdayRule.equals("NO_SATURDAY_OFF")) {
            return false;
        }

        // Calculate which Saturday of the month this is
        int dayOfMonth = date.getDayOfMonth();
        int saturdayNumber = (dayOfMonth - 1) / 7 + 1;

        switch (saturdayRule) {
            case "SECOND_FOURTH_SATURDAY":
            case "ALTERNATE_SATURDAYS":
                return saturdayNumber == 2 || saturdayNumber == 4;
            case "FIRST_THIRD_SATURDAY":
                return saturdayNumber == 1 || saturdayNumber == 3;
            case "SECOND_SATURDAY_ONLY":
                return saturdayNumber == 2;
            case "FOURTH_SATURDAY_ONLY":
                return saturdayNumber == 4;
            default:
                return true;
        }
    }

    /**
     * Check if Sunday is off for the organization
     */
    public boolean isSundayOff(Long organizationId) {
        OrganizationSettings settings = getOrCreateSettings(organizationId);
        return settings.getSundayOff() != null ? settings.getSundayOff() : true;
    }

    /**
     * Check if a date is a weekend (Saturday/Sunday) based on org settings
     */
    public boolean isWeekend(Long organizationId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        
        if (dayOfWeek == DayOfWeek.SUNDAY) {
            return isSundayOff(organizationId);
        }
        
        if (dayOfWeek == DayOfWeek.SATURDAY) {
            return isSaturdayOff(organizationId, date);
        }
        
        return false;
    }

    // Holiday Management
    public List<Holiday> getHolidays(Long organizationId) {
        return holidayRepository.findByOrganizationIdAndIsActiveTrue(organizationId);
    }

    public List<Holiday> getHolidaysForMonth(Long organizationId, int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        return holidayRepository.findByOrganizationIdAndHolidayDateBetweenAndIsActiveTrue(
            organizationId, startDate, endDate);
    }

    public List<Holiday> getHolidaysForYear(Long organizationId, int year) {
        return holidayRepository.findByOrganizationIdAndYear(organizationId, year);
    }

    public Holiday addHoliday(Holiday holiday) {
        return holidayRepository.save(holiday);
    }

    public void deleteHoliday(Long holidayId) {
        holidayRepository.deleteById(holidayId);
    }

    public boolean isHoliday(Long organizationId, LocalDate date) {
        return holidayRepository.existsByOrganizationIdAndHolidayDate(organizationId, date);
    }

    public Optional<Holiday> getHolidayForDate(Long organizationId, LocalDate date) {
        return holidayRepository.findByOrganizationIdAndHolidayDate(organizationId, date);
    }

    /**
     * Initialize default Indian government holidays for a year
     */
    @Transactional
    public void initializeDefaultHolidays(Long organizationId, int year) {
        // Check if holidays already exist for this year
        List<Holiday> existing = holidayRepository.findByOrganizationIdAndYear(organizationId, year);
        if (!existing.isEmpty()) {
            return; // Already initialized
        }

        // National Holidays (applicable across India)
        addDefaultHoliday(organizationId, "Republic Day", LocalDate.of(year, 1, 26), "NATIONAL");
        addDefaultHoliday(organizationId, "Holi", LocalDate.of(year, 3, 14), "NATIONAL");
        addDefaultHoliday(organizationId, "Good Friday", LocalDate.of(year, 4, 18), "NATIONAL");
        addDefaultHoliday(organizationId, "Dr. Ambedkar Jayanti", LocalDate.of(year, 4, 14), "NATIONAL");
        addDefaultHoliday(organizationId, "May Day", LocalDate.of(year, 5, 1), "NATIONAL");
        addDefaultHoliday(organizationId, "Independence Day", LocalDate.of(year, 8, 15), "NATIONAL");
        addDefaultHoliday(organizationId, "Janmashtami", LocalDate.of(year, 8, 26), "NATIONAL");
        addDefaultHoliday(organizationId, "Gandhi Jayanti", LocalDate.of(year, 10, 2), "NATIONAL");
        addDefaultHoliday(organizationId, "Dussehra", LocalDate.of(year, 10, 2), "NATIONAL");
        addDefaultHoliday(organizationId, "Diwali", LocalDate.of(year, 10, 21), "NATIONAL");
        addDefaultHoliday(organizationId, "Diwali Holiday", LocalDate.of(year, 10, 22), "NATIONAL");
        addDefaultHoliday(organizationId, "Guru Nanak Jayanti", LocalDate.of(year, 11, 15), "NATIONAL");
        addDefaultHoliday(organizationId, "Christmas", LocalDate.of(year, 12, 25), "NATIONAL");

        // Tamil Nadu specific holidays
        addDefaultHoliday(organizationId, "Pongal", LocalDate.of(year, 1, 14), "STATE");
        addDefaultHoliday(organizationId, "Thiruvalluvar Day", LocalDate.of(year, 1, 15), "STATE");
        addDefaultHoliday(organizationId, "Uzhavar Thirunal", LocalDate.of(year, 1, 16), "STATE");
        addDefaultHoliday(organizationId, "Tamil New Year", LocalDate.of(year, 4, 14), "STATE");
    }

    private void addDefaultHoliday(Long organizationId, String name, LocalDate date, String type) {
        if (!holidayRepository.existsByOrganizationIdAndHolidayDate(organizationId, date)) {
            Holiday holiday = new Holiday();
            holiday.setOrganizationId(organizationId);
            holiday.setName(name);
            holiday.setHolidayDate(date);
            holiday.setHolidayType(type);
            holiday.setIsRecurring(true);
            holiday.setIsActive(true);
            holidayRepository.save(holiday);
        }
    }
}
