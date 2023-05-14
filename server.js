const http = require('http');
const fs = require('fs');
const path = require('path');
const pattern = require('url-pattern');
const UrlPattern = require('url-pattern');

const hostname = '127.0.0.1';
const port = 5000;



function readHtml(res, filename, passed = null) {
	fs.readFile(`./${filename}`, null, function (error, data) {
		if (error) {
			res.writeHead(404);
            res.write('Whoops! File not found!');
		}
		else {
			res.writeHead(200);
			if (passed) {
				var str = data.toString()
				//console.log(str)
				str = str.replace('<p id="article-id" hidden>ID</p>', `<p id="article-id" hidden>${passed.id}</p>`)
				//console.log(str)
				data = Buffer.from(str)
			}
			res.write(data);
			res.end();
		}
	})
}

const requestListener = function (req, res) {
	res.setHeader("Content-Type", "text/html");
	//console.log(req.url)
	switch (req.url) {
        case "/":
			readHtml(res, "index.html")
            break
		case "/index":
			res.writeHead(302, {'Location': "/"});
			res.end();
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
		case "/about":
			readHtml(res, "about.html")
            break
		case "/world":
			readHtml(res, "index.html", {id : "world"})
			break
		case "/sports":
			readHtml(res, "index.html", {id : "sports"})
			break
		case "/economics":
			readHtml(res, "index.html", {id : "economics"})
			break
		case "/culture":
			readHtml(res, "index.html", {id : "culture"})
			break
        default:
			const url = new UrlPattern('/article/(:id)');
			var uri = req.url;
			if (req.url.startsWith("/article/")) uri = req.url.replace("/article/", "");

			if (uri.match("\.css")) {
				var cssPath = path.join(__dirname, '', uri);
        		var fileStream = fs.createReadStream(cssPath, "UTF-8");
        		res.writeHead(200, {"Content-Type": "text/css"});
        		fileStream.pipe(res);
				break
			}
			else if (uri.match("\.js")) {
				var jsPath = path.join(__dirname, '', uri);
        		var fileStream = fs.createReadStream(jsPath, "UTF-8");
        		res.writeHead(200, {"Content-Type": "application/javascript"});
        		fileStream.pipe(res);
				break
			}
			else if (uri.match("\.png")) {
				var imgPath = path.join(__dirname, '', uri);
        		var fileStream = fs.createReadStream(imgPath);
        		res.writeHead(200, {"Content-Type": "image/png"});
        		fileStream.pipe(res);
				break
			}
			else if (url.match(req.url)) {
				var id = url.match(req.url)
				console.log(id)
				readHtml(res, "article.html", id)
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


