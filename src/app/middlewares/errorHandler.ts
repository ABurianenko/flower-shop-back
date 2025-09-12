import { isHttpError } from 'http-errors';
import { Error as MongooseError } from 'mongoose';

export const errorHandler = (err, req, res, _next) => {
  console.error('[ERR]', err.name, err.message);
  if (err?.errors) {
    console.error('[ERR.fields]', Object.keys(err.errors));
  }

  if (isHttpError(err)) {
    const status = err.status ?? err.statusCode ?? 500;
    return res.status(status).json({ status, message: err.message });
  }

  if (err instanceof MongooseError.ValidationError) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, (v as any).message])
    );
    return res.status(400).json({ status: 400, message: 'Validation failed', details });
  }

  if (err?.name === 'MongoServerError' && err?.code === 11000) {
    return res.status(409).json({ status: 409, message: 'Duplicate key', keyValue: err.keyValue });
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ status: 400, message: 'Invalid ID' });
  }

  req.log?.error?.(err);
  return res.status(500).json({ status: 500, message: 'Internal Server Error' });
};
