import React, { useState } from 'react';
import { api } from '../services/authService';

export default function TestOrganizations() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testFetch = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Testing API call...');
            const response = await api.get('/organizations');
            console.log('Full response:', response);
            setResult(JSON.stringify(response.data, null, 2));
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Organizations API</h1>
            <button
                onClick={testFetch}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? 'Loading...' : 'Fetch Organizations'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div className="mt-4">
                    <h2 className="font-bold mb-2">Result:</h2>
                    <pre className="p-4 bg-gray-100 rounded overflow-auto">
                        {result}
                    </pre>
                </div>
            )}
        </div>
    );
}
