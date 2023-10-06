const BadRequestError = require('./badRequestError');
const ConflictError = require('./conflictError');
const ForbiddenError = require('./forbiddenError');
const NotFoundError = require('./notFoundError');
const UnauthorizedError = require('./unauthorizedError');

const CreatedCode = 201;
const IntervalServerError = 500;

module.exports = {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  CreatedCode,
  IntervalServerError,
};
