const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const formidable = require('formidable');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {

    switch (req.url) {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');

            fs.readFile('./login.html', (err, data) => {
                if (err) throw err;
                res.end(data);
            });
            break;
        case '/home':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end("data");
            break;
        case '/login':
            if (req.method == 'POST') {
                const contentType = req.headers['content-type'];
                if (contentType && contentType.includes('multipart/form-data')) {
                    const form = new formidable.IncomingForm();
                    console.log(form);

                    form.parse(req, (err, fields, files) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                            return;
                        }
                        console.log(fields);
                        const email = fields.email[0];
                        const password = fields.password[0];

                        if (email === "example@gmail.com" && password === "123456789") {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end('Login successful');
                        } else {
                            res.writeHead(401, { 'Content-Type': 'text/plain' });
                            res.end('Login failed');
                        }
                    });
                } else {
                    res.statusCode = 200;
                    res.setHeader('content-type', 'text/javascript');
                    var body = '';

                    req.on('data', function (data) {
                        body += data;
                        console.log(body);
                    });
                    
                    req.on('end', function () {
                        const formData = qs.parse(body);

                        const email = formData.email;
                        const password = formData.password;

                        if (email === "example@gmail.com" && password === "123456789") {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end('Login successful');
                        } else {
                            res.writeHead(401, { 'Content-Type': 'text/plain' });
                            res.end('Login failed');
                        }
                    });
                }
            }
            break;
        default:
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end("Not Found");
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
