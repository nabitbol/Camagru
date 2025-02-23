const apiCall = async (method, url, body) => {
    const BACKEND_BASE_URL = "127.0.0.1";
    const BACKEND_PORT = "3000";
    locals = {
        url: ""
    };

    console.log({ method, url, body })

    locals.url = BACKEND_BASE_URL + ':' + BACKEND_PORT + url;

    console.log(locals.url)
    try {
        const response = await fetch("http://127.0.0.1:3000/signup", {
            method,
            body: JSON.stringify(body)
        })

        const data = response.json()
        console.log(data)

        return data;
    } catch (err) {
        throw err;
    }
}

export {
    apiCall
}