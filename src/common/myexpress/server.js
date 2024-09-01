import http from "http";

const defaultHealthCheck = (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("health check");
  }
};

const addBodyRequestAndCallHandler = (req, res, handlers) => {
  let body = [];

  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      const tmp = Buffer.concat(body).toString();
      if (tmp) req.body = JSON.parse(tmp);
      handlers.forEach((handler) => handler(req, res));
    });
};

const Server = class {
  constructor(healthCheckFunc) {
    this.server = http.createServer(
      healthCheckFunc ? healthCheckFunc : defaultHealthCheck
    );
  }

  listen(port, host) {
    const portToUse = port || 3000;
    const hostToUse = host || "localhost";

    this.server.listen(portToUse, hostToUse, () => {
      console.log(`server runing on http://${hostToUse}:${portToUse}`);
    });
  }

  #callHandler(method, path, ...handlers) {
    this.server.on("request", (req, res) => {
      if (req.method === method && req.url === path)
        addBodyRequestAndCallHandler(req, res, handlers);
    });
  }

  get(path, ...handlers) {
    this.#callHandler("GET", path, handlers);
  }

  post(path, ...handlers) {
    this.#callHandler("POST", path, handlers);
  }

  put(path, ...handlers) {
    this.#callHandler("PUT", path, handlers);
  }

  delete(path, ...handlers) {
    this.#callHandler("DELETE", path, handlers);
  }
};

const ServerInstanciator = () => {
  return new Server();
};

export { Server, ServerInstanciator };
