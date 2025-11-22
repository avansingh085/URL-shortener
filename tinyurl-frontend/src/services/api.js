
const API_BASE_URL =import.meta.env.VITE_BACKEND_URL;

export const fetchTinyUrls = async () => {
    console.log(API_BASE_URL)
    const response = await fetch(`${API_BASE_URL}/api/links`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.links ?? [];
};

export const deleteTinyUrl = async (linkId) => {
    const response = await fetch(`${API_BASE_URL}/api/links/${linkId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Deletion failed with status: ${response.status}`);
    }
   
};


export const createTinyUrl = async (d) => {
    console.log(d,"data in api")
    const response = await fetch(`${API_BASE_URL}/api/links`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(d),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to create link.');
    }
    return data;
};

export const getBaseUrl = () => API_BASE_URL;