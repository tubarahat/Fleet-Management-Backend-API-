const requestCounts = {};

const createVehicleRateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (!requestCounts[ip]) {
        requestCounts[ip] = [];
    }

    // Filter requests in the last 60 seconds
    requestCounts[ip] = requestCounts[ip].filter(timestamp => now - timestamp < 60000);

    if (requestCounts[ip].length >= 3) {
        return res.status(429).json({ error: "Too many requests. Limit is 3 per minute." });
    }

    requestCounts[ip].push(now);
    next();
};

module.exports = createVehicleRateLimiter;
