export const request = async <T>(url: string, options: RequestInit): Promise<T> => {
    const response = await fetch(url, options);
    try {
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error occurred during fetch request", error);
        throw new Error("Request failed");
    }
}