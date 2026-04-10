const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).send({error: "Access denied, please login!"})
    }
    next()
}
module.exports = authMiddleware