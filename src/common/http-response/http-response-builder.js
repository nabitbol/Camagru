class HttpResponseBuilder {
  constructor(res) {
    this.res = res;
  }

  status(newStatus) {
    this.res.statusCode = newStatus;
    return this;
  }

  header(...data) {
    this.res.setHeader(...data);
    return this;
  }

  body(data) {
    this.res.write(JSON.stringify(data));
    return this;
  }

  send() {
    this.res.end();
  }
}

export default HttpResponseBuilder;
