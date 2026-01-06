// Debug utility to check authentication state
export const debugAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('=== Auth Debug Info ===');
    console.log('Token exists:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('User exists:', !!user);
    console.log('User data:', user);
    
    if (token) {
        try {
            // Decode JWT token (basic decode without verification)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            console.log('Token payload:', decoded);
            console.log('Token expiry:', new Date(decoded.exp * 1000));
            console.log('Token expired:', decoded.exp < Date.now() / 1000);
        } catch (e) {
            console.error('Error decoding token:', e);
        }
    }
    console.log('======================');
};
