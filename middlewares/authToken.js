import jwt from "jsonwebtoken"

function authToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            msg: "No token provided, authorization denied",
            success: false,
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "Invalid token, authorization denied",
            success: false,
        });
    }
}

export default authToken