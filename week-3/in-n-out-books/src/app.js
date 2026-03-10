/**
 * Name: Daniella Bertoldi
 * Date: 02/01/2026
 * File: app.js
 * Description: In-N-Out-Books Express Web Server
 */

const express = require("express");
const createError = require("http-errors");
const books = require("../database/books");
const bcrypt = require("bcryptjs");
const users = require("../database/users");

/////// ADDED FOR CHAPTER 7 ///////
const Ajv = require("ajv");


// Express application
const app = express();

/////// ADDED FOR CHAPTER 7 ///////
const ajv = new Ajv();

const securityQuestionsSchema = {
  type: "object",
  properties: {
    securityQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          answer: { type: "string" }
        },
        required: ["answer"],
        additionalProperties: false
      }
    }
  },
  required: ["securityQuestions"],
  additionalProperties: false
};


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

// POST - Add Book
app.post("/api/books", async (req, res, next) => {
  try {
    const newBook = req.body;

    if (!newBook.title) {
      return next(createError(400, "Bad Request"));
    }

    const result = await books.insertOne(newBook);

    res.status(201).send({ id: result.ops[0].id });

  } catch (err) {
    next(err);
  }
});

// DELETE - Book
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await books.deleteOne({ id: parseInt(id) });

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});

// PUT - Update Book
app.put("/api/books/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    if (!req.body.title) {
      return next(createError(400, "Bad Request"));
    }

    await books.updateOne(
      { id: id },
      { $set: { title: req.body.title, author: req.body.author } }
    );

    res.status(204).send();

  } catch (err) {
    next(err);
  }
});

/**
 * ============================
 * LOGIN ROUTE (Chapter 6)
 * ============================
 */

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Bad Request" });
    }

    const user = await users.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    return res.status(200).send({ message: "Authentication successful" });

  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});


/////// ADDED FOR CHAPTER 7 ///////

/**
 * ============================
 * VERIFY SECURITY QUESTIONS (Chapter 7)
 * ============================
 */

app.post("/api/users/:email/verify-security-question", async (req, res, next) => {
  try {

    const { email } = req.params;
    const { securityQuestions } = req.body;

    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(req.body);

    if (!valid) {
      console.error("Bad Request: Invalid request body", validate.errors);
      return res.status(400).send({ message: "Bad Request" });
    }

    const user = await users.findOne({ email: email });

    if (
      securityQuestions[0].answer !== user.securityQuestions[0].answer ||
      securityQuestions[1].answer !== user.securityQuestions[1].answer ||
      securityQuestions[2].answer !== user.securityQuestions[2].answer
    ) {
      console.error("Unauthorized: Security questions do not match");
      return res.status(401).send({ message: "Unauthorized" });
    }

    res.status(200).send({
      message: "Security questions successfully answered"
    });

  } catch (err) {
    console.error("Error:", err.message);
    next(err);
  }
});


/**
 * ============================
 * ERROR HANDLING
 * ============================
 */

// 404 middleware
app.use((req, res, next) => {
  next(createError(404));
});

// 500 middleware
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
