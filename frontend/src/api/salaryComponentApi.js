import { api } from '../services/authService';

// Ensure we have an organizationId; discover and cache if missing
const ensureOrgId = async () => {
    let organizationId = localStorage.getItem('selectedOrganizationId') || localStorage.getItem('organizationId');
    if (!organizationId) {
        try {
            const res = await api.get('/organizations');
            const list = res?.data || [];
            if (list.length > 0) {
                organizationId = String(list[0].id);
                localStorage.setItem('selectedOrganizationId', organizationId);
                console.info('[salaryComponentApi] cached organizationId', organizationId);
            }
        } catch (e) {
            console.warn('[salaryComponentApi] unable to resolve organizationId');
        }
    }
    return organizationId;
};

/**
 * Get all salary components for the organization
 */
export const getAllComponents = async () => {
    const organizationId = await ensureOrgId();
    if (!organizationId) return [];
    const response = await api.get(`/salary-components?organizationId=${organizationId}`);
    return response.data;
};

/**
 * Get variable components for pay run dropdown
 * @param {string} type - 'EARNING' or 'DEDUCTION'
 */
export const getVariableComponents = async (type) => {
    const organizationId = await ensureOrgId();
    if (!organizationId) return [];
    const response = await api.get(`/salary-components/variable?organizationId=${organizationId}&type=${type}`);
    return response.data;
};

/**
 * Get components by type
 * @param {string} type - 'EARNING' or 'DEDUCTION'
 */
export const getComponentsByType = async (type) => {
    const organizationId = await ensureOrgId();
    if (!organizationId) return [];
    const response = await api.get(`/salary-components/by-type?organizationId=${organizationId}&type=${type}`);
    return response.data;
};

/**
 * Get a specific salary component by ID
 */
export const getComponentById = async (id) => {
    const response = await api.get(`/salary-components/${id}`);
    return response.data;
};

/**
 * Create a new salary component
 */
export const createComponent = async (componentData) => {
    const organizationId = await ensureOrgId();
    const response = await api.post('/salary-components', {
        ...componentData,
        organizationId: parseInt(organizationId, 10)
    });
    return response.data;
};

/**
 * Update an existing salary component
 */
export const updateComponent = async (id, componentData) => {
    const response = await api.put(`/salary-components/${id}`, componentData);
    return response.data;
};

/**
 * Delete a salary component
 */
export const deleteComponent = async (id) => {
    const response = await api.delete(`/salary-components/${id}`);
    return response.data;
};
