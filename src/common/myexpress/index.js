import http from "http";
import { logger, logLevels } from '@camagru/logger';
import { LinkedList } from "./utils.js";

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

  // replace empty port and host assignment by a guarde
  listen(port, host) {
    const portToUse = port || 3000;
    const hostToUse = host || "localhost";
    const logMessage = `Application is running on http://${hostToUse}:${port}`;

    this.server.listen(portToUse, hostToUse, () => {
      logger.log({ level: logLevels.INFO, message: logMessage });
    });
  }

  // factory to create the next function
  #createNext(req, res, handlerList) {
    let currentHandlerItem = handlerList.head;
    const errorMessage = "Request object is undefined.";


    const next = function () {
      try {
        if (req, res, currentHandlerItem) {
          const handlerItemToCall = currentHandlerItem;

          if (currentHandlerItem.next)
            currentHandlerItem = currentHandlerItem.next;

          handlerItemToCall.data(req, res, next);

          return;
        } else {
          throw new ERROR();
        }

      } catch (err) {
        logger.log({ level: logLevels.ERROR, message: errorMessage }); // Handle the case where req is undefined
      }
    }
    return next;
  }

  #callFirstHandler(handlers, req, res) {
    const handlerLinkedList = new LinkedList(handlers)
    const next = this.#createNext(req, res, handlerLinkedList);

    handlerLinkedList.head.data(req, res, next);
  }

  // add try catch to this 
  #addBodyRequestAndCallHandlers(req, res, handlers, t) {
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
        this.#callFirstHandler(handlers, req, res);
      });
  };

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
        this.#addBodyRequestAndCallHandlers(req, res, handlers);
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

export default ServerInstanciator;
