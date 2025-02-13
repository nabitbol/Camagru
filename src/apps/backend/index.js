import MyExpress from "@camagru/myexpress";
import QueryBuilder from "@camagru/query-builder";
import UserDataAccess from "./users/data-access.js";
import UserControllers from "./users/controllers.js";
import UserServices from "./users/services.js";
import { BACKEND_PORT, BACKEND_BASE_URL, pgConfig } from "./config.js";


const simpleTest = (req, res, next) => {
  console.log("test");
  next();
};

const simpleText = (req, res, next) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.end("toto");
};

const main = () => {
  const port = BACKEND_PORT;
  const host = BACKEND_BASE_URL;

  const app = new MyExpress();

  const queryBuilder = new QueryBuilder(pgConfig);
  const userDataAccess = UserDataAccess(queryBuilder);
  const userServices = UserServices(userDataAccess);
  const userControllers = UserControllers(userServices);

  app.listen(port, host);
  app.get("/test", simpleTest, simpleText);
  app.post("/signup", userControllers.signUp);
  app.get("/signup/verify-email/:id", userControllers.verifyUser);
};

main();
