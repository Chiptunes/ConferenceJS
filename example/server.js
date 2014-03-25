var server = require('http').createServer( reqHandler ),
	fs	   = require('fs'),
	io     = require('socket.io').listen( server, { log: false } );

var type = [];

server.listen(8080);

type['html'] = "text/html";
type['js']   = "text/javascript";
type['css']  = "text/css";
type['png']  = "image/png";
type['ttf']  = "application/octet-stream";

function reqHandler ( req, res ) {

	var extension = req.url.split('/')[ req.url.split('/').length - 1 ].split('.').pop();

	if ( req.url === '/' ) {

		fs.readFile("./statics/index.html", function ( err, file ) {

			if ( err ) console.log( err );

			res.writeHeader('200', {'Content-Type': 'text/html'});
			res.end( file );

		});

	} else {

		fs.readFile( "./statics" + req.url, function ( err, file ) {

			if ( err ) console.log( err );

			res.writeHeader('200', {'Content-Type': type[ extension ] });
			res.end(file);

		});

	} 

}

io.sockets.on('connection', function ( socket ) {
	
	socket.on('initCall', function ( data ) {
		socket.broadcast.emit( data.user, { desc: data.desc, user: data.local } )
	});

	socket.on('callAnswered', function ( data ) {
		socket.broadcast.emit( data.user + 'hs', { desc: data.desc });
	});

	socket.on("ICEcandidate", function ( data ) {
		
		setTimeout( function () {

			socket.broadcast.emit( data.user + 'ic', {
				label: data.sdpMLineIndex,
	            id: data.sdpMid,
	            candidate: data.candidate
			});

		}, 1500 );

	});

});