
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { RefreshCcw, Link, TrendingUp, Clock, Terminal } from 'lucide-react';
import { getBaseUrl } from '../services/api';



const fetchLinkStats = async (linkCode) => {
    
    const API_BASE_URL = getBaseUrl();
    const endpoint = `${API_BASE_URL}/api/links/${linkCode}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status===302) {
            const data = await response.json();
            return data;
        } else if (response.status === 404) {
            throw new Error(`Link with code '/${linkCode}' not found.`);
        } else {
            throw new Error(`API returned status code: ${response.status}`);
        }

    }
    catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
};


const StatsPage = () => {
    const { code: linkCode } = useParams();

    const [linkData, setLinkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fallbackUserId = 'user_api_demo_01';

    useEffect(() => {
        setLoading(true);
        setError('');
        setLinkData(null);

        if (!linkCode) {
            setError('No link code provided in the URL.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const data = await fetchLinkStats(linkCode);
                console.log("Fetched Link Data:", data);
                setLinkData(data);
            } catch (err) {
                console.error("Fetch Error:", err.message);
                setError(`Failed to load data for /${linkCode}. ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [linkCode]);

    
    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 flex-1 min-w-[200px]">
            <div className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</div>
            <div className="flex items-center text-gray-500 mt-1">
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm">{title}</span>
            </div>
        </div>
    );

    const DetailItem = ({ label, value, isCode = false, isLink = false }) => (
        <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-500 w-1/3">{label}:</span>
            {isLink ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-words max-w-[60%] text-right"
                    title={value}
                >
                    {value}
                </a>
            ) : (
                <span className={`text-sm text-gray-800 break-words max-w-[60%] text-right ${isCode ? 'font-mono text-indigo-700 font-semibold' : ''}`}>
                    {value}
                </span>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
                <div className="text-indigo-600 flex items-center">
                    <RefreshCcw className="w-5 h-5 animate-spin mr-3" />
                    Connecting to API and fetching statistics for <strong>/{linkCode}</strong>...
                </div>
            </div>
        );
    }

    if (error || !linkData) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-lg max-w-lg text-center">
                    <h2 className="text-xl font-bold mb-3">Error Loading Data</h2>
                    <p>{error}</p>
                    <p className="mt-4 text-sm text-red-500">
                        Please check the short code in the URL path.
                        User ID: {fallbackUserId} (API Demo)
                    </p>
                    <RouterLink
                        to="/"
                        className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
                    >
                        Go to Dashboard
                    </RouterLink>
                </div>
            </div>
        );
    }

    const { ShortCode, url:TargetURL, TotalClicks, createdAt } = linkData;

    let displayCreationDate = 'N/A';
    try {
        displayCreationDate = new Date(createdAt).toLocaleDateString();
    } catch (e) {
        displayCreationDate = 'Invalid Date';
    }

    return (
        <div className="min-h-full bg-white p-4 md:p-8 font-sans rounded-xl shadow-lg">
            <div className="max-w-4xl mx-auto">

                <header className="mb-8 border-b pb-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        Link Analytics: <span className="text-indigo-600">/{ShortCode}</span>
                    </h1>
                    <p className="text-gray-600 mt-2 flex items-center text-sm md:text-base">
                        <Terminal className="w-4 h-4 mr-2 text-indigo-500" />
                        Short Code ID: <span className='font-mono ml-1 font-semibold'>{ShortCode}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">User Context ID: {fallbackUserId} (API Demo)</p>
                </header>

                <div className="flex flex-wrap justify-start gap-6 mb-10">
                    <StatCard
                        title="Total Clicks"
                        value={TotalClicks}
                        icon={TrendingUp}
                        color="text-indigo-600"
                    />
                    <StatCard
                        title="Link Created On"
                        value={displayCreationDate}
                        icon={Clock}
                        color="text-yellow-600"
                    />
                </div>

                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Link className="w-6 h-6 mr-2 text-green-600" />
                        Target Destination
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-100">
                        <DetailItem label="Short Code" value={`/${ShortCode}`} isCode={true} />
                        <DetailItem label="Target URL" value={TargetURL} isLink={true} />
                        <DetailItem label="Total Clicks" value={TotalClicks.toLocaleString()} />
                        <DetailItem label="Creation Date" value={displayCreationDate} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default StatsPage;