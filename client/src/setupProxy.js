const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function(app) {
    app.use(
        ["/match_details", "/current_user"],
        createProxyMiddleware({
            target: "http://localhost:5000",
        })
    );
};