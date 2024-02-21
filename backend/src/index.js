require("prevalidation");
const express = require("express");
const http = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const uuid = require("uuid");

const app = express();
const server = http.createServer(app);

const PORT = 6969;

if (process.env.NODE_ENV === "development") { // reverse-proxy during development
	app.use( "/ui", createProxyMiddleware({
		target: "http://127.0.0.1:3000",
		changeOrigin: true,
	}));
} else { // use "efficient" production build in ... production
	app.use(express.static(path.join(__dirname, "your-react-app-build-folder")));
}

// simple endpoints
app.get("/", (req, res) => res.redirect("/ui"));
app.get("/uuid", (req, res) => res.send(uuid.v4()));
app.get("/servertime", (req, res) => res.send(new Date().toISOString()));

// WebSocket endpoint
require("./server")(server);

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
