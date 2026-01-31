const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const logEntry = `${req.method} ${req.originalUrl} - ${new Date().toISOString()}\n`;
    fs.appendFile(path.join(__dirname, '../logs.txt'), logEntry, (err) => {
        if (err) console.error("Logging failed", err);
    });
    next();
};

module.exports = logger;
