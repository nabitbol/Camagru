import http from "http";

const defaultHealthCheck = (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("health check");
  }
};

const addBodyRequestAndCallHandler = (handler, req, res) => {
  let body = [];

  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      const tmp = Buffer.concat(body).toString();
      if (tmp) req.body = JSON.parse(tmp);
      handler(req, res);
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

  #callHandler(method, path, handler) {
    this.server.on("request", (req, res) => {
      if (req.method === method && req.url === path)
        addBodyRequestAndCallHandler(handler, req, res);
    });
  }

  get(path, handler) {
    this.#callHandler("GET", path, handler);
  }

  post(path, handler) {
    this.#callHandler("POST", path, handler);
  }

  put(path, handler) {
    this.#callHandler("PUT", path, handler);
  }

  delete(path, handler) {
    this.#callHandler("DELETE", path, handler);
  }
};

const ServerInstanciator = () => {
  return new Server();
};

export { Server, ServerInstanciator };
