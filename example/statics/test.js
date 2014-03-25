	var socket   = io.connect('http://localhost:8080');
	var configuration      = { "iceServers": [ 
    								{
    									url: 'turn:numb.viagenie.ca',
    									credential: 'mangakas123',
    									username: 'rrojot@hotmail.com'
    								},
                                    {
                                        url: 'turn:192.158.29.39:3478?transport=udp',
                                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                        username: '28224511:1379330808'
                                    },
                                    {
                                        url: 'turn:192.158.29.39:3478?transport=tcp',
                                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                        username: '28224511:1379330808'
                                    },
                                    {
                                        url: 'turn:192.158.30.23:3478?transport=udp',
                                        credential: 'RaebIwHQPUmabKiySrCr8kbHtSg=',
                                        username: '1394128738:02043197'
                                    },
                                    {
                                        url: 'turn:192.158.30.23:3478?transport=tcp',
                                        credential: 'RaebIwHQPUmabKiySrCr8kbHtSg=',
                                        username: '1394128738:02043197'
                                    }
                                 ] };

	var RTCPeerConnection  = webkitRTCPeerConnection || mozRTCPeerConnection;
	navigator.getUserMedia = navigator.getUserMedia  || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var pc     = new RTCPeerConnection( configuration );
	var local  = document.getElementById('local');
	var remote = document.getElementById('remote');
	var candidates = [];
	var ready  = false; 

	pc.onaddstream = addStream;
	pc.onicecandidate = icecandidate;

	document.getElementById('start').addEventListener('click', function () {

		navigator.getUserMedia({ audio: true, video: true }, function ( stream ) {

			pc.addStream( stream );
			ready = true;

			pc.createOffer( function ( desc ) {
				pc.setLocalDescription( new RTCSessionDescription( desc ) );
				socket.emit('start', { desc: desc });
			});

		});

	});

	socket.on("offer", function ( data ) {

		navigator.getUserMedia({ audio: true, video: true }, function ( stream ) {

			pc.addStream( stream );
			pc.setRemoteDescription( new RTCSessionDescription( data.desc ) );

			pc.createAnswer( function ( desc ) {
				pc.setLocalDescription( new RTCSessionDescription( desc ) );
				socket.emit('answer', { desc: desc });
			});

		});

	});

	socket.on('close', function ( data ) {
		pc.setRemoteDescription( new RTCSessionDescription( data.desc ) );
				for ( var i in candidates ) {
					pc.addIceCandidate( candidates[i] );
				}
	});

	socket.on('ice', function ( data ) {

		var candidate = new RTCIceCandidate({
			                    sdpMLineIndex: data.label,
			                    candidate: data.candidate
			                });

		if ( ready ) {
			pc.addIceCandidate( candidate );
		} else {
			candidates.push( candidate );
		}

	});

	function addStream ( event ) {
        remote.src = URL.createObjectURL( event.stream );
        remote.play();
	};

	function icecandidate ( e ) {
        if ( e.candidate ) {
        	socket.emit("ICEcandidate", { label: e.candidate.sdpMLineIndex, 
        								  id: e.candidate.sdpMid,
        								  candidate: e.candidate.candidate });
        } 
	};