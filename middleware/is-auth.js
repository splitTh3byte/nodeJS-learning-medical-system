module.exports = (req, res, next) => {
    if (!req.session.loginStats) {
        return res.redirect('/login');
    }
    next();
}