/**
 * Name: Daniella Bertoldi
 * Date: 02/01/2026
 * File: app.js
 * Description: In-N-Out-Books Express Web Server
 */

const express = require('express');
const createError = require('http-errors');

// Create Express application
const app = express();

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET route for root URL ("/")
app.get('/', (req, res, next) => {
  const html = `
    <html>
      <head>
        <title>In-N-Out-Books</title>
      </head>
      <body>
        <h1>In-N-Out-Books</h1>
        <h2>Your personal book collection manager</h2>

        <p>
          In-N-Out-Books is an application that allows users to manage
          and organize their personal book collections.
        </p>
      </body>
    </html>
  `;
  res.send(html);
});

// 404 middleware (must come after all routes)
app.use((req, res, next) => {
  next(createError(404));
});

// 500 error-handling middleware (must be last)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    type: 'error',
    status: err.status || 500,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

// Export the Express application
module.exports = app;
