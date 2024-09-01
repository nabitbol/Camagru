import MyExpress from "@camagru/myexpress";
import { signUp } from "./users/domain.js";

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

  app.listen(port, host);
  app.get("/test", simpleTest, simpleText);
  app.get("/sign-up", signUp);
};

main();
