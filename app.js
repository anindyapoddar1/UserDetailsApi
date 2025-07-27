const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('express-async-errors');
const { param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const AppError = require('./AppError');

function createServer(db) {
  const app = express();
  const users = db.collection('users');

  app.use(express.json());
  app.use(mongoSanitize());
  app.use(xss());

  app.get('/users/:id',
    param('id').trim().custom(val => ObjectId.isValid(val)).withMessage('Invalid ID'),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new AppError('User not found', 404));
      }
      const _id = new ObjectId(req.params.id);
      try {
        const user = await users.findOne({ _id, age: { $gt: 21 } });
        if (!user) return next(new AppError('User not found', 404));
        const { _id: __, ...rest } = user;
        res.json({ id: user._id.toString(), ...rest });
      } catch (err) {
        next(err);
      }
    }
  );

  // global error handler...
  app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    const msg = err.message || 'Internal Server Error';
    if (err.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Duplicate key error' });
    }
    res.status(status).json({ status: 'error', message: msg });
  });

  return app;
}

module.exports = createServer;

