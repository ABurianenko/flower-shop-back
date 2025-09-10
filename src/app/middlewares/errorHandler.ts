import { HttpError as RcHttpError} from "routing-controllers";

export const errorHandler = (err, req, res, next) => {
    if (err instanceof RcHttpError) {
        res.status(err.httpCode).json({
            status: err.httpCode,
            message: err.name,
            data: err,
        });
        return;
    }

    res.status(500).json({
        message: 'Something went wrong',
        error: err.message,
    })
}
