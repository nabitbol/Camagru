class HttpResponseBuilder {
  constructor(res) {
    this.res = res;
  }

  status(newStatus) {
    this.res.statusCode = newStatus;
    return this;
  }

  /**
   * 
   * @param {Object} header 
   * 
   * Set the header on the response object.
   */
  #setHeader(header) {
    const [key, value] = Object.entries(header)[0];

    this.res.setHeader(key, value);
  }

  /**
   * 
   * @param {Object | [Object]} header 
   * @returns pointer on the currently selected object
   * (return this)
   */
  header(header) {
    if (header instanceof Array) {

      header.forEach((headerPair) => {
        this.#setHeader(headerPair);
      });

    } else {
      this.#setHeader(header);
    }
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
