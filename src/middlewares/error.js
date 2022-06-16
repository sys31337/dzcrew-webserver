exports.notFound = (req, res, next) => {
    res.status(404).send( {"message" : `NOT FOUND - ${req.originalUrl}`} )
    const error = new Error(`NOT FOUND - ${req.originalUrl}`);
    next(error)
};

exports.errorHandler = (error, req, res, next) => {
    const status = res.statusCode === 200 ? 400 : res.statusCode;
    let message;
    res.status(status)
    if (error.error) {
        message = error.error.isJoi ? error.error.toString() : `${error.result.error}`;
    } else {
        message = error.message;
    }
    res.json({
        message,
        stack: process.env.NODE_ENV === 'production' ? '' : error.stack,
    });
};
