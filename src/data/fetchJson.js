export const fetchJson = async (URL) => {
    try {
        const response = await fetch(URL);
        return await response.json();
    } catch (err) {
        console.error(`error occurred: ${err.message}`);
        return null;
    }
};