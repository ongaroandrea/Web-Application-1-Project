
export const SERVER_URL = 'http://localhost:3001/api';

export async function handleInvalidResponse(response) {
    if (!response.ok) {
        let message = response.statusText;
        await response.json().then(errorResponse => {
            // Handle error response
            message = errorResponse.message;
        });
        throw Error(message);
    }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}