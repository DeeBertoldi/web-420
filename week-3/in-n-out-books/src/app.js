/**
 * Name: Daniella Bertoldi
 * Date: 02/01/2026
 * File: app.js
 * Description: In-N-Out-Books Express Web Server
 */

const express = require("express");
const createError = require("http-errors");
const books = require("../database/books");

// Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Root route
 */
app.get("/", (req, res) => {
  res.send("In-N-Out-Books API");
});

/**
 * ============================
 * API ROUTES
 * ============================
 */

// GET all books
app.get("/api/books", async (req, res, next) => {
  try {
    const allBooks = await books.find();
    res.send(allBooks);
  } catch (err) {
    next(err);
  }
});

// GET book by ID
app.get("/api/books/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const book = await books.findOne({ id });
    res.send(book);
  } catch (err) {
    next(err);
  }
});

// 3a - POST
app.post("/api/books", async (req, res, next) => {
  try {
    const newBook = req.body;

    // validation - check for titles:
   if (!newBook.title) {
      return next(createError(400, "Bad Request"));
    }

    // INSERTING INTO MOCK DATABASE
   const result = await books.insertOne(newBook);

    // return 201
  res.status(201).send({ id: result.ops[0].id });

  } catch (err) {
    next(err);
  }
});

// 3b - DELETE
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await books.deleteOne({ id: parseInt(id) });

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});



/**
 * ERROR HANDLING
 */

// PUT - Update Book
app.put("/api/books/:id", async (req, res, next) => {
  try {

    const id = Number(req.params.id);

    // Check if id is not a number
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    // Check if title is missing
    if (!req.body.title) {
      return next(createError(400, "Bad Request"));
    }

    // Update book in mock database
    await books.updateOne(
      { id: id },
      { $set: { title: req.body.title, author: req.body.author } }
    );

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});


// 404 middleware
app.use((req, res, next) => {
  next(createError(404));
});

// 500 error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    type: "error",
    status: err.status || 500,
    message: err.message
  });
});

// Export the Express application
module.exports = app;
