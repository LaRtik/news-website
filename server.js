const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 5000;


function readHtml(response, filename) {
	fs.readFile(`./${filename}`, null, function (error, data) {
		if (error) {
			response.writeHead(404);
            respone.write('Whoops! File not found!');
		}
		else {
			response.writeHead(200);
			response.write(data);
			response.end();
		}
	})
}

const requestListener = function (req, res) {
	res.setHeader("Content-Type", "text/html");
	switch (req.url) {
        case "/":
			readHtml(res, "index.html")
            break
        case "/create":
            readHtml(res, "create.html")
            break
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }
};

const server = http.createServer(requestListener);

server.listen(port, hostname, () => {
	
  console.log(`Server running at http://${hostname}:${port}/`);
}); 


