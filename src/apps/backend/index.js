import MyExpress from "@camagru/myexpress";
import { signUp } from "./users/domain.js";

const simpleText = async (req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.end("toto");
};

const main = () => {
  const port = 3000;
  const host = "127.0.0.1";

  const app = MyExpress();

  app.listen(port, host);
  app.get("/test", signUp);
};

main();
