package com.payroll.enums;

public enum CalculationType {
    FIXED, // Fixed amount (e.g., Conveyance = 1600)
    PERCENTAGE, // Percentage of another component (e.g., HRA = 50% of Basic)
    FORMULA // Complex formula-based calculation (e.g., TDS calculation)
}
