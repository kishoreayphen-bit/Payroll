import { api } from './authService';

export const payRunManagementApi = {
    // Skip employee from pay run
    skipEmployee: (payRunId, employeeId, data, tenantId, userId) => {
        return api.post(`/pay-runs/${payRunId}/employees/${employeeId}/skip`, data, {
            headers: {
                'X-Tenant-ID': tenantId,
                ...(userId && { 'X-User-ID': userId })
            }
        });
    },

    // Unskip employee
    unskipEmployee: (payRunId, employeeId, tenantId) => {
        return api.delete(`/pay-runs/${payRunId}/employees/${employeeId}/skip`, {
            headers: {
                'X-Tenant-ID': tenantId
            }
        });
    },

    // Add one-time component
    addOneTimeComponent: (payRunId, employeeId, data, tenantId, userId) => {
        return api.post(`/pay-runs/${payRunId}/employees/${employeeId}/components`, data, {
            headers: {
                'X-Tenant-ID': tenantId,
                ...(userId && { 'X-User-ID': userId })
            }
        });
    },

    // Delete one-time component
    deleteComponent: (componentId, tenantId) => {
        return api.delete(`/pay-runs/components/${componentId}`, {
            headers: {
                'X-Tenant-ID': tenantId
            }
        });
    },

    // Add LOP
    addLOP: (payRunId, employeeId, data, tenantId) => {
        return api.post(`/pay-runs/${payRunId}/employees/${employeeId}/lop`, data, {
            headers: {
                'X-Tenant-ID': tenantId
            }
        });
    },

    // Withhold salary
    withholdSalary: (payRunId, employeeId, tenantId) => {
        return api.post(`/pay-runs/${payRunId}/employees/${employeeId}/withhold`, {}, {
            headers: {
                'X-Tenant-ID': tenantId
            }
        });
    },

    // Release salary
    releaseSalary: (payRunId, employeeId, tenantId) => {
        return api.post(`/pay-runs/${payRunId}/employees/${employeeId}/release`, {}, {
            headers: {
                'X-Tenant-ID': tenantId
            }
        });
    },

    // Get employee details in pay run
    getEmployeeDetail: (payRunId, employeeId, tenantId) => {
        return api.get(`/pay-runs/${payRunId}/employees/${employeeId}/details`, {
            headers: {
                'X-Tenant-ID': tenantId
            }
        });
    }
};
