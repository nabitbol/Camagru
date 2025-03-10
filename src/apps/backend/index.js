import MyExpress from "@camagru/myexpress";
import QueryBuilder from "@camagru/query-builder";
import UserDataAccess from "./users/data-access.js";
import UserControllers from "./users/controllers.js";
import UserServices from "./users/services.js";
import { MyError, errors } from './errors/index.js'
import { logger, logLevels } from "@camagru/logger";
import { HttpResponseBuilder, HttpResponseHandler } from "@camagru/http-response";
import { BACKEND_PORT, BACKEND_BASE_URL, CORS, pgConfig } from "./config.js";

const simpleTest = (req, res, next) => {
  console.log("test");
  next();
};

const simpleText = (req, res, next) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.end("toto");
};

const error = async (err, req, res, next) => {
  const response = new HttpResponseBuilder(res);

  if (err instanceof MyError) {
    HttpResponseHandler(response, err);
  } else {
    HttpResponseHandler(response, {
      ...errors.DEFAULT_ERROR,
      message: err.message
    });
  }

  logger.log({
    level: logLevels.ERROR,
    message: err.message
  });
}

const notFound = (req, res, next) => {
  const response = new HttpResponseBuilder(res);
  const header = [{ "Content-Type": "application/json" }];


  HttpResponseHandler(response, {
    header,
    status: 404,
    message: 'Not Found'
  }
  );
}

const main = () => {
  const port = BACKEND_PORT;
  const host = BACKEND_BASE_URL;
  const cors = CORS;

  const app = new MyExpress();

  const queryBuilder = new QueryBuilder(pgConfig);
  const userDataAccess = UserDataAccess(queryBuilder);
  const userServices = UserServices(userDataAccess);
  const userControllers = UserControllers(userServices);

  app.listen(port, host);
  app.cors(cors);

  /* ------------------------------- user routes ------------------------------ */
  app.get("/test", simpleTest, simpleText);
  app.post("/signup", userControllers.signUp);
  app.get("/signup/verify-email/:id", userControllers.verifyUser);
  app.post("/signin", userControllers.signIn);
  app.put("/reset-password/send", userControllers.sendResetPassword);
  app.put("/reset-password/verify/:id", userControllers.verifyResetPassword);

  app.use(notFound);

  /**
   * WIP
   * Error handling inspiration:  
   * https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md
   */
  app.use(error);
}

main();
