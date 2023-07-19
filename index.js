const express = require('express');
const app = express();
const pot =12000;
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var formidable = require('formidable');

http.listen(pot, () => {
    console.log('listening on http://localhost:12000');
});
app.use('/files', express.static('files'));

app.get('../images/snbg.gif', (req, res) => {
    res.sendFile(__dirname + '../images/snbg.gif');
});
app.use('/files', express.static('files'));

app.get('../images/cbg.webp', (req, res) => {
    res.sendFile(__dirname + '../images/cbg.webp');
});
app.get('/css/style.css', (req, res) => {
    res.sendFile(__dirname + '/css/style.css');
});
app.get('/js/jquery-3.4.1.min.js', (req, res) => {
    res.sendFile(__dirname + '/js/jquery-3.4.1.min.js');
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});
io.on('connection', (socket) => {
    console.log('User connected++');
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
    socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    });
});
app.post('/uploadfile', function (req, res) {
    var strFilePath = '';
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/files/' + file.name;
    });
    form.on('file', function (name, file) {
        strFilePath = '/files/' + file.name;
        res.send(JSON.stringify({ "filePath": strFilePath, "fileName": file.name }));
    });
});
