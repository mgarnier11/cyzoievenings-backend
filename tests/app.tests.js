const should = require("should");

describe("this is a simple test", () => {
  it("5x1 should be 5", () => {
    const result = 5 * 1;

    result.should.be.equal(5);
  });

  it("5x2 should be 5", () => {
    const result = 5 * 2;

    result.should.be.equal(10);
  });

  it("5x3 should be 15", () => {
    const result = 5 * 3;

    result.should.be.equal(15);
  });

  it("5x4 should be 20", () => {
    const result = 5 * 4;

    result.should.be.equal(20);
  });

  it("5x5 should be 25", () => {
    const result = 5 * 5;

    result.should.be.equal(25);
  });

  it("5x6 should be 30", () => {
    const result = 5 * 6;

    result.should.be.equal(30);
  });

  it("5x7 should be 35", () => {
    const result = 5 * 7;

    result.should.be.equal(35);
  });

  it("5x8 should be 40", () => {
    const result = 5 * 8;

    result.should.be.equal(40);
  });

  it("5x9 should be 45", () => {
    const result = 5 * 9;

    result.should.be.equal(45);
  });

  it("5x10 should be 50", () => {
    const result = 5 * 10;

    result.should.be.equal(50);
  });
});
