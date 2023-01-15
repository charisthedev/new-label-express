const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Server", () => {
  it("should respond with a 200 status code and 'Hello, World!' message on GET /", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal("Hello, World!");
        done();
      });
  });

  it("should respond with a 429 status code and 'Too many requests, please try again later' message on rate limit exceeded", (done) => {
    // Make more than 100 requests in a 15 minute window
    for (let i = 0; i < 110; i++) {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {});
    }
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.should.have.status(429);
        res.text.should.equal("Too many requests, please try again later");
        done();
      });
  });
});
