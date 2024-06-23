import http from "http";

const defaultHealthCheck = (req, res) => {
  if (req.url == "/health") {
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

  listen(port, host) {
    const portToUse = port || 3000;
    const hostToUse = host || "localhost";

    this.server.listen(portToUse, hostToUse, () => {
      console.log(`server runing on http://${hostToUse}:${portToUse}`);
    });
  }
};

const ServerInstanciator = () => {
  return new Server();
};

export default ServerInstanciator;
