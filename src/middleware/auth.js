import jwt from "jsonwebtoken";

const autenticarJWT = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res
            .status(403)
            .json({ message: "Acceso denegado. No se proporcionó un token." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token no válido." });
        }
        req.user = user;
        next();
    });
};

export default autenticarJWT;
