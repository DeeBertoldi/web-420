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

  it("should return a single book", async () => {
    const res = await request(app).get("/api/books/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("author");
  });

});

// Week 5
describe("Chapter 5: API Tests", () => {

  it("should return a 201-status code when adding a new book", async () => {
    const res = await request(app).post("/api/books").send({
      id: 100,
      title: "Test Book",
      author: "Test Author"
    });

    expect(res.statusCode).toEqual(201);
  });

  it("should return a 400-status code when adding a new book with missing title", async () => {
    const res = await request(app).post("/api/books").send({
      id: 101,
      author: "Test Author"
    });

    expect(res.statusCode).toEqual(400);
  });

  it("should return a 204-status code when deleting a book", async () => {

    // First create the book to ensure it exists
    await request(app).post("/api/books").send({
      id: 200,
      title: "Delete Me",
      author: "Test Author"
    });

    // Then delete it
    const res = await request(app).delete("/api/books/200");

    expect(res.statusCode).toEqual(204);
  });

});

