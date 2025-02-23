const BACKEND_BASE_URL = "127.0.0.1";
const BACKEND_PORT = "3000";

const signup = async (userData) => {
    const PATH = "/signup";
    const METHOD = 'POST';
    const url = `http://${BACKEND_BASE_URL}:${BACKEND_PORT}${PATH}`;
    const body = JSON.stringify(userData);


    try {
        const response = await fetch(url, {
            method: METHOD,
            body,
        })

        const data = response.json()

        if (!response.ok)
            console.log(data)

        return data;
    } catch (err) {
        throw err
        // window.location.replace('/errors/500.html')
    }
}

export {
    signup
}