import http from "http";
import { logger, logLevels } from '@camagru/logger';

const defaultHealthCheck = (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("health check");
  }
};

// add try catch to this 
const addBodyRequestAndCallHandlers = (req, res, handlers) => {
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
      // Modify to fit express usage (using next) top use guards
      handlers.forEach((handler) => handler(req, res));
    });
};

const Server = class {
  constructor(healthCheckFunc) {
    this.server = http.createServer(
      healthCheckFunc ? healthCheckFunc : defaultHealthCheck
    );
  }

  // replace empty port and host assignment by a guarde
  listen(port, host) {
    const portToUse = port || 3000;
    const hostToUse = host || "localhost";
    const logMessage = `Application is running on http://${hostToUse}:${port}`;

    this.server.listen(portToUse, hostToUse, () => {
      logger.log({ level: logLevels.INFO, message: logMessage });
    });
  }

  #getRequestParams(pathRessources, reqUrlRessources) {
    let params = {};

    for (let i = 0; i < reqUrlRessources.length; i++) {
      if (pathRessources[i][0] == ":") {
        const param = pathRessources[i].slice(1);
        params[param] = reqUrlRessources[i];
        i++;
      }
    }

    return params;
  }

  #matchRoute(pathRessources, reqUrlRessources) {

    if (reqUrlRessources.length != pathRessources.length) {
      return false;
    }
    for (let i = 0; i < reqUrlRessources.length; i++) {
      if (pathRessources[i][0] == ":") 
        continue;
  
      if (reqUrlRessources[i] !== pathRessources[i]) return false;
    }

    return true;
  }

  #callHandlers(method, path, handlers) {
    this.server.on("request", (req, res) => {
      const pathRessources = path.split("/");
      const reqUrlRessources = req.url.split("/");

      if (req.method === method && this.#matchRoute(pathRessources, reqUrlRessources)) {
        req.params = this.#getRequestParams(pathRessources, reqUrlRessources);
        addBodyRequestAndCallHandlers(req, res, handlers);
      }
    });
  }

  get(path, ...handlers) {
    this.#callHandlers("GET", path, handlers);
  }

  post(path, ...handlers) {
    this.#callHandlers("POST", path, handlers);
  }

  put(path, ...handlers) {
    this.#callHandlers("PUT", path, handlers);
  }

  delete(path, ...handlers) {
    this.#callHandlers("DELETE", path, handlers);
  }
};

// Remove 
const ServerInstanciator = () => {
  return new Server();
};

export { Server, ServerInstanciator };
