import http from "http";
import { logger, logLevel } from '@camagru/logger';

const defaultHealthCheck = (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("health check");
  }
};

const addBodyRequestAndCallHandler = (req, res, handlers) => {
  let body = [];

  req
    .on("error", () => {
      console.error(err.stack);
    })
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
    const logMessage = `Application is running on http://${hostToUse}:${port}`;

    this.server.listen(portToUse, hostToUse, () => {
      logger.log({ level: logLevel.INFO, message: logMessage });
    });
  }

  #checkUrl(path, req) {
    const pathRessources = path.split("/");
    const reqUrlRessources = req.url.split("/");
    let params = {};

    if (reqUrlRessources.length != pathRessources.length) {
      return false;
    }
    for (let i = 0; i < reqUrlRessources.length; i++) {
      if (pathRessources[i][0] == ":") {
        const param = pathRessources[i].slice(1);
        params[param] = reqUrlRessources[i];
        i++;
      }

      if (reqUrlRessources[i] !== pathRessources[i]) return false;
    }

    req.params = params;
    return true;
  }

  #callHandler(method, path, handlers) {
    this.server.on("request", (req, res) => {
      if (req.method === method && this.#checkUrl(path, req))
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
