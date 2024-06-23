import MyExpress from "@camagru/myexpress";

const main = () => {
  const port = 30000;
  const host = "127.0.0.1";

  const app = MyExpress();

  app.listen(port, host);
};

main();
