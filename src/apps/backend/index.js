import MyExpress from "@camagru/myexpress";

const simpleText = (req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.end("toto");
};

const main = () => {
  const port = 30000;
  const host = "127.0.0.1";

  const app = MyExpress();

  app.listen(port, host);
  app.get("/test", simpleText);
  // app.use("/", usersRoutes);
};

main();
