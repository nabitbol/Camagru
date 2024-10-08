import MyExpress from "@camagru/myexpress";
import QueryBuilder from "@camagru/query-builder";
import UserDataAccess from "./users/data-access.js";
import UserControllers from "./users/controllers.js";
import UserServices from "./users/services.js";
import { pgConfig } from "./config.js";

const simpleTest = (req, res) => {
  console.log("test");
};

const simpleText = (req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.end("toto");
};

const main = () => {
  const port = 3000;
  const host = "127.0.0.1";

  const app = MyExpress();

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
