
import React, { useState, useEffect } from 'react';
import { getBaseUrl } from '../services/api';

const HealthPage = () => {
    const API_BASE_URL = getBaseUrl();
    const [healthStatus, setHealthStatus] = useState('Checking...');
    const [isHealthy, setIsHealthy] = useState(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
              
                const response = await fetch(`${API_BASE_URL}/healthz`);
                if (response.ok) {
                    setHealthStatus('Backend service is operational (HTTP 200).');
                    setIsHealthy(true);
                } else {
                    const errorText = await response.text();
                    setHealthStatus(`Backend service responded with status ${response.status}. Details: ${errorText.substring(0, 50)}...`);
                    setIsHealthy(false);
                }
            } catch (err) {
                setHealthStatus(`Failed to connect to the backend service at ${API_BASE_URL}. Check server status.`);
                setIsHealthy(false);
            }
        };

        checkHealth();
    }, [API_BASE_URL]);

    const statusClasses = isHealthy === true ? 'bg-green-100 text-green-800 border-green-400' : 
                         isHealthy === false ? 'bg-red-100 text-red-800 border-red-400' :
                                               'bg-yellow-100 text-yellow-800 border-yellow-400';

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">System Health Check 🏥</h2>
            <div className={`p-6 border rounded-lg shadow-md ${statusClasses}`}>
                <h3 className="text-xl font-semibold mb-3">API Server Status</h3>
                <p className="mb-2"><strong>Base URL:</strong> <code>{API_BASE_URL}</code></p>
                <p><strong>Status:</strong> {healthStatus}</p>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600">This page checks the availability of the backend URL shortening API.</p>
            </div>
        </div>
    );
};

export default HealthPage;