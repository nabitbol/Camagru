import http from "http";

const defaultHealthCheck = (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("health check");
  }
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

  use(path, handler) {
    this.server.on((req, res, next) => {
      if (req.url === path) {
        handler(req, res, next);
        next();
      }
    });
  }

  get(path, handler) {
    this.server.on("request", (req, res, next) => {
      if (req.method === "GET" && req.url === path) handler(req, res, next);
    });
  }

  post(path, handler) {
    this.server.on("request", (req, res, next) => {
      if (req.method === "POST" && req.url === path) handler(req, res, next);
    });
  }

  put(path, handler) {
    this.server.on("request", (req, res, next) => {
      if (req.method === "PUT" && req.url === path) handler(req, res, next);
    });
  }

  delete(path, handler) {
    this.server.on("request", (req, res, next) => {
      if (req.method === "DELETE" && req.url === path) handler(req, res, next);
    });
  }
};

const ServerInstanciator = () => {
  return new Server();
};

export { Server, ServerInstanciator };
