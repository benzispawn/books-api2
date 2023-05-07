

function errorHandler(err, req, res, next) {
    console.log('2@@ passou no error handler', err);
    if (req.xhr) {
        return res.status(500).json({ status: 'failed', error: 'Something goes wrong...' });
    }
    
    return res.status(400).json({ status: 'failed', error: 'Something goes wrong...' });
}

module.exports = {
    errorHandler
}