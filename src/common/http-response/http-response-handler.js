const HttpResponseHandler = (response, responseConfig) => {
    response
        .status(responseConfig.status)
        .header(responseConfig.header)
        .body({
            message: responseConfig.message,
        })
        .send();
};

export default HttpResponseHandler;