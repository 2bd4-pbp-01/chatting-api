const response = (statusCode, data, message, res) => {
    res.status(statusCode).json({
            statusCode: statusCode,
            message: message,
            data: data,
        },
    );
}

export default response;