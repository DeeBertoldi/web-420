const app = require("../src/app");
const request = require("supertest");

describe("Chapter 4: API Tests", () => {

  it("should return an array of books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
    });
  });

});

it("should return a single book", async () => {
  const res = await request(app).get("/api/books/1");

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty("id", 1);
  expect(res.body).toHaveProperty("title");
  expect(res.body).toHaveProperty("author");
});

