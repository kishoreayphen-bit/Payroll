package com.payroll.service;

import com.payroll.entity.*;
import com.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class BankFileService {

    private final PayRunRepository payRunRepository;
    private final PayRunEmployeeRepository payRunEmployeeRepository;
    private final EmployeeRepository employeeRepository;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("ddMMyyyy");

    /**
     * Generate NEFT/RTGS bank payment file for a pay run
     * Format: Standard bank payment file format
     */
    public byte[] generateBankPaymentFile(Long payRunId, Long tenantId, String fileType) {
        log.info("Generating {} bank file for pay run: {}", fileType, payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(baos);

        // Header record
        String headerDate = LocalDate.now().format(DATE_FORMAT);
        writer.println(String.format("H|%s|%s|SALARY|%d", 
            payRun.getPayRunNumber(), 
            headerDate, 
            employees.size()));

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Detail records
        for (PayRunEmployee pre : employees) {
            Employee emp = pre.getEmployee();
            
            if (emp.getAccountNumber() != null && emp.getIfscCode() != null) {
                String record = String.format("D|%s|%s|%s|%s|%s|%.2f|%s",
                    emp.getEmployeeId(),
                    emp.getFullName().replace("|", " "),
                    emp.getAccountNumber(),
                    emp.getIfscCode(),
                    emp.getBankName() != null ? emp.getBankName().replace("|", " ") : "BANK",
                    pre.getNetSalary(),
                    fileType.equals("RTGS") && pre.getNetSalary().compareTo(new BigDecimal("200000")) >= 0 ? "RTGS" : "NEFT"
                );
                writer.println(record);
                totalAmount = totalAmount.add(pre.getNetSalary());
            }
        }

        // Trailer record
        writer.println(String.format("T|%d|%.2f", employees.size(), totalAmount));

        writer.flush();
        writer.close();

        return baos.toByteArray();
    }

    /**
     * Generate HDFC Bank specific payment file format
     */
    public byte[] generateHDFCBankFile(Long payRunId, Long tenantId) {
        log.info("Generating HDFC bank file for pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(baos);

        String paymentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        // HDFC Format: Beneficiary Code, Beneficiary Name, Instrument Amount, Payment Date, 
        // Instrument Number, MICR Number, IFS Code, Beneficiary Bank Account Number, 
        // Beneficiary Bank Name, E-mail ID
        
        writer.println("Beneficiary Code,Beneficiary Name,Instrument Amount,Payment Date,Instrument Number,MICR Number,IFS Code,Beneficiary Bank Account Number,Beneficiary Bank Name,E-mail ID");

        int instrumentNo = 1;
        for (PayRunEmployee pre : employees) {
            Employee emp = pre.getEmployee();
            
            if (emp.getAccountNumber() != null && emp.getIfscCode() != null) {
                writer.println(String.format("%s,%s,%.2f,%s,%d,,%s,%s,%s,%s",
                    emp.getEmployeeId(),
                    "\"" + emp.getFullName() + "\"",
                    pre.getNetSalary(),
                    paymentDate,
                    instrumentNo++,
                    emp.getIfscCode(),
                    emp.getAccountNumber(),
                    emp.getBankName() != null ? "\"" + emp.getBankName() + "\"" : "",
                    emp.getWorkEmail()
                ));
            }
        }

        writer.flush();
        writer.close();

        return baos.toByteArray();
    }

    /**
     * Generate ICICI Bank specific payment file format
     */
    public byte[] generateICICIBankFile(Long payRunId, Long tenantId) {
        log.info("Generating ICICI bank file for pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(baos);

        String paymentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy"));

        // ICICI Format
        writer.println("PAYMENT DATE,DEBIT ACC NO,BENEFICIARY CODE,BENEFICIARY ACC NO,TXN AMOUNT,BENEFICIARY NAME,IFSC CODE,BENE BANK NAME,BENE EMAIL");

        for (PayRunEmployee pre : employees) {
            Employee emp = pre.getEmployee();
            
            if (emp.getAccountNumber() != null && emp.getIfscCode() != null) {
                writer.println(String.format("%s,COMPANY_ACCOUNT,%s,%s,%.2f,%s,%s,%s,%s",
                    paymentDate,
                    emp.getEmployeeId(),
                    emp.getAccountNumber(),
                    pre.getNetSalary(),
                    "\"" + emp.getFullName() + "\"",
                    emp.getIfscCode(),
                    emp.getBankName() != null ? "\"" + emp.getBankName() + "\"" : "",
                    emp.getWorkEmail()
                ));
            }
        }

        writer.flush();
        writer.close();

        return baos.toByteArray();
    }

    /**
     * Get bank file generation summary
     */
    public Map<String, Object> getBankFileSummary(Long payRunId, Long tenantId) {
        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);

        int validAccounts = 0;
        int invalidAccounts = 0;
        BigDecimal neftTotal = BigDecimal.ZERO;
        BigDecimal rtgsTotal = BigDecimal.ZERO;
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PayRunEmployee pre : employees) {
            Employee emp = pre.getEmployee();
            
            if (emp.getAccountNumber() != null && emp.getIfscCode() != null) {
                validAccounts++;
                totalAmount = totalAmount.add(pre.getNetSalary());
                
                if (pre.getNetSalary().compareTo(new BigDecimal("200000")) >= 0) {
                    rtgsTotal = rtgsTotal.add(pre.getNetSalary());
                } else {
                    neftTotal = neftTotal.add(pre.getNetSalary());
                }
            } else {
                invalidAccounts++;
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("payRunId", payRunId);
        summary.put("payRunNumber", payRun.getPayRunNumber());
        summary.put("payPeriod", payRun.getPayPeriodStart() + " to " + payRun.getPayPeriodEnd());
        summary.put("totalEmployees", employees.size());
        summary.put("validBankAccounts", validAccounts);
        summary.put("invalidBankAccounts", invalidAccounts);
        summary.put("neftTransactions", validAccounts);
        summary.put("rtgsTransactions", 0);
        summary.put("neftTotal", neftTotal);
        summary.put("rtgsTotal", rtgsTotal);
        summary.put("totalAmount", totalAmount);

        return summary;
    }
}
