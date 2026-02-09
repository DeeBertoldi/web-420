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

/**
 * ERROR HANDLING
 */

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
