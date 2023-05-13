const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 5000;



function readHtml(res, filename) {
	fs.readFile(`./${filename}`, null, function (error, data) {
		if (error) {
			res.writeHead(404);
            res.write('Whoops! File not found!');
		}
		else {
			res.writeHead(200);
			res.write(data);
			res.end();
		}
	})
}

const requestListener = function (req, res) {
	res.setHeader("Content-Type", "text/html");
	console.log(req.url)
	switch (req.url) {
        case "/":
			readHtml(res, "index.html")
            break
		case "/index":
			readHtml(res, "index.html")
			break
        case "/create":
            readHtml(res, "create.html")
            break
		case "/login":
            readHtml(res, "login.html")
            break
		case "/admin":
			readHtml(res, "admin.html")
            break	
        default:
			if (req.url.match("\.css")) {
				var cssPath = path.join(__dirname, '', req.url);
        		var fileStream = fs.createReadStream(cssPath, "UTF-8");
        		res.writeHead(200, {"Content-Type": "text/css"});
        		fileStream.pipe(res);
				break
			}
			else if (req.url.match("\.js")) {
				var jsPath = path.join(__dirname, '', req.url);
        		var fileStream = fs.createReadStream(jsPath, "UTF-8");
        		res.writeHead(200, {"Content-Type": "application/javascript"});
        		fileStream.pipe(res);
				break
			}
			else if (req.url.match("\.png")) {
				var imgPath = path.join(__dirname, '', req.url);
        		var fileStream = fs.createReadStream(imgPath);
        		res.writeHead(200, {"Content-Type": "image/png"});
        		fileStream.pipe(res);
				break
			}
			/* else if (req.url.match("\.ico")) {
				var imgPath = path.join(__dirname, '', req.url);
        		var fileStream = fs.createReadStream(imgPath, "UTF-8");
        		res.writeHead(200, {"Content-Type": "image/x-icon"});
        		fileStream.pipe(res);
				break
			} */
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }
};

const server = http.createServer(requestListener);

server.listen(port, hostname, () => {
	
  console.log(`Server running at http://${hostname}:${port}/`);
}); 


