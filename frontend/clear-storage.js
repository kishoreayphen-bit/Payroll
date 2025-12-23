// Clear corrupted localStorage data
// Run this in browser console if you see JSON parse errors

console.log('Clearing localStorage...');
localStorage.removeItem('token');
localStorage.removeItem('user');
console.log('✓ localStorage cleared!');
console.log('Please refresh the page.');
