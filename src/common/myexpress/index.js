import http from "http";
import { logger, logLevels } from '@camagru/logger';
import { LinkedList } from "./utils.js";

const defaultHealthCheck = (req, res) => {
    if (req.url === "/health") {
        res.writeHead(200, { "Content-type": "text/plain" });
        res.end("health check");
    }
};

const HttpMethodes = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    ALL: "ALL"
}


const Server = class {
    routes = {};
    #cors;

    constructor(healthCheckFunc) {

        this.server = http.createServer(
            healthCheckFunc ? healthCheckFunc : defaultHealthCheck
        );

        this.server.on("request", (req, res) => {
            let routesUtils = [];
            const middlewares = [];

            if (this.#cors)
                this.#setCors(res);

            routesUtils = routesUtils.concat(this.#find(req.method, req.url));
            routesUtils = routesUtils.concat(this.#find(HttpMethodes.ALL, req.url));

            routesUtils.forEach(utils => {
                if (utils !== undefined) {
                    req.params = { ...req.params, ...utils.params };
                    middlewares.push(...utils.middlewares);
                }
            })

            /**
             * Skips middleware execution if no middleware is found, or only an error handler is present.
             * This avoids unnecessary error handler invocation when no preceding middleware has called 'next(err)'.
             * Refer to Express.js error handling: https://expressjs.com/en/guide/error-handling.html
             * 
             * Example:
             * 
             * Post on /signup
             * 
             * If the only coded middleware is error-handling it should not be executed:
             *
             * app.use((err, req, res, next) => {
             *  // your error handling code
             * })
             * 
             * Or
             * 
             * If the only coded middleware is on /health we should not try to execute empty middlewares object
             * 
             * app.get('/health', (req, res, next) => {
             *  // your helth check code
             * })
             * 
             */
            if (middlewares.length <= 0 || middlewares[0].length === 4)
                return;

            this.#addHeaderRequest(req);
            this.#addBodyRequestAndCallHandlers(req, res, middlewares)
        })
    }

    listen(port, host) {
        const portHostErrorMessage = 'Port or host undefined';

        try {
            if (!port || !host) {
                throw new EROR(portHostErrorMessage);
            }

            this.local = {
                port,
                host
            };

            const listeningMessage = `Application is running on http://${this.local.host}:${this.local.port}`;

            this.server.on("error", err => {
                logger.log({ level: logLevels.ERROR, message: err.message });
            });

            this.server.listen(this.local.port, this.local.host, () => {
                logger.log({ level: logLevels.INFO, message: listeningMessage });
            });

        } catch (err) {
            logger.log({ level: logLevels.ERROR, message: err.message });
        }
    }

    cors(corsOptions) {
        this.#cors = corsOptions;
    }

    #setCors(res) {
        const [key, value] = Object.entries(this.#cors)[0];

        res.setHeader(key, value);
    }

    /*
    ** Factory to create the function that invokes the next middleware.
    */
    #createNext(req, res, middlewaresList) {
        let middleware = middlewaresList.head;


        const next = function (err = undefined) {

            /*
            ** To handle error properly MyExpress offer the ability to delegate the 
            ** error handling to a dedicated middleware. To do so Within a catch block,
            ** call the `next` function with an error object (`err`) as its argument.
            ** This will bypass all regular middleware and invoke the first
            ** declared error handling middleware. (thanks to this loop)
            ** 
            ** Catch the error and call next:
            **   
            **  try { // Add your code here }
            **  catch (err) {
            **     next(err);
            **  }
            **
            **  -----------
            **  
            ** Call app.use to call the error middleware:
            **
            **  app.use ((err, req, res, next) => {
            **      // Add your code here
            **  })
            */
            while (err && middleware) {

                if (middleware.data.length === 4) {
                    middleware.data(err, req, res, next);
                }

                middleware = middleware.next;
            }

            if (req, res, middleware) {


                if (middleware.next)
                    middleware = middleware.next;


                middleware.data(req, res, next);

            }
        }
        return next;
    }

    #callFirstMiddleware(req, res, middlewares) {
        const middlewaresList = new LinkedList(middlewares)
        const next = this.#createNext(req, res, middlewaresList);
        middlewaresList.head.data(req, res, next);
    }

    #addHeaderRequest(req) {
        const header = {};

        for (let i = 1; i < req.rawHeaders.length; i += 2) {
            const headerName = req.rawHeaders[i - 1];
            const headerValue = req.rawHeaders[i];

            header[headerName] = headerValue;
        }
        req.header = header;
    }

    #addBodyRequestAndCallHandlers(req, res, middlewares) {
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
                this.#callFirstMiddleware(req, res, middlewares);
            });
    };

    #getRequestParams(pathRessources, reqUrlRessources) {
        let params = {};

        if (pathRessources.length < 2)
            return;

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

    #find(method, url) {
        if (!Object.keys(this.routes).includes(method))
            return;
        const routes = Object.keys(this.routes[method]);
        const splittedUrl = url.split("/");
        let findedRoutes = [];

        for (let route of routes) {
            const splittedRoute = route.split("/");
            if (route === "@" || this.#matchRoute(splittedRoute, splittedUrl)) {
                findedRoutes.push({
                    middlewares: this.routes[method][route],
                    params: this.#getRequestParams(splittedRoute, splittedUrl)
                })
            }
        }
        return findedRoutes;
    }

    /**
     * 
     * @param {HttpMethodes | string} method 
     * @param {string} routes 
     * @param  {...(err?, req, res, next) => {}} middlewares
     * 
     * Used bind middleware to differents
     * routes and types of http requests
     */
    #bind(method, routes, middlewares) {
        if (this.routes[method] && this.routes[method][routes]
            && this.routes[method][routes].length > 0) {

            this.routes[method][routes]
                = this.routes[method][routes].concat(middlewares);

        } else if (this.routes[method]) {
            Object.assign(this.routes[method], {
                [routes]: middlewares
            });
        } else {
            this.routes[method] = {
                [routes]: middlewares
            };
        }
    }

    /**
     * 
     * @param {string} route 
     * @param  {...(err?, req, res, next) => {}} middlewares
     *
     * Bind middleware to GET http method
     */
    get(route, ...middlewares) {
        this.#bind(HttpMethodes.GET, route, middlewares);
    }

    /**
     * 
     * @param {string} route 
     * @param  {...(err?, req, res, next) => {}} middlewares
     *
     * Bind middleware to POST http method
     */
    post(route, ...middlewares) {
        this.#bind(HttpMethodes.POST, route, middlewares);
    }

    /**
    * 
    * @param {string} route 
    * @param  {...(err?, req, res, next) => {}} middlewares
    *
    * Bind middleware to PUT http method
    */
    put(route, ...middlewares) {
        this.#bind(HttpMethodes.PUT, route, middlewares);
    }

    /**
    * 
    * @param {string} route 
    * @param  {...(err?, req, res, next) => {}} middlewares
    *
    * Bind middleware to DELETE http method
    */
    delete(route, ...middlewares) {
        this.#bind(HttpMethodes.DELETE, route, middlewares);
    }

    /**
    * 
    * @param {string} route 
    * @param  {...(err?, req, res, next) => {}} middlewares
    *
    * Bind middleware to be use on every http request
    */
    use(route, ...middlewares) {
        if (typeof (route) === 'function') {
            middlewares.unshift(route);
            route = '@';
        }
        this.#bind(HttpMethodes.ALL, route, middlewares);
    }

};

export default Server;
