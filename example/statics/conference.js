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

function Peer( localVid, addstream, icecandidate ) {
	
	var state = 0;
	var pc = new RTCPeerConnection( configuration );

	pc.onaddstream    = addstream;
	pc.onicecandidate = icecandidate;

	this.local = localVid;

	this.offer = function ( callElements, callback ) {

		if ( state === 0 ) {

			navigator.getUserMedia( callElements, function ( stream ) {
				
				this.stream = stream;
				pc.addStream( stream );

				this.local.src = URL.createObjectURL( stream );
				this.local.play();

				pc.createOffer( function ( desc ) {

					this.pcDesc = new RTCSessionDescription( desc );
					pc.setLocalDescription( this.pcDesc );
					state = 1;

					callback( false, desc );

				});

			});

		} else {
			callback("PEER CAN'T CREATE OFFER", null);
		}

	}

	this.answer = function ( callElements, remoteDesc, callback ) {

		if ( state === 0 ) {

			navigator.getUserMedia( callElements, function ( stream ) {

				this.stream = stream;
				pc.addStream( stream );

				pc.setRemoteDescription( new RTCSessionDescription( remoteDesc ) );

				this.local.src = URL.createObjectURL( stream );
				this.local.play();

				pc.createAnswer( function ( desc ) {

					this.pcDesc = new RTCSessionDescription( desc );
					pc.setLocalDescription( this.pcDesc );
					state = 1;

					callback( false, desc );

				});

			});

		} else if ( state === 1 ) {
			callback( "PEER CAN'T ANSWER", null );
		} else {
			callElements( "PEER OBJECT IS UNUSABLE", null );
		}

	}

	this.initCall = function ( remoteDesc, callback ) {

		if ( state === 1 ) {
			pc.setRemoteDescription( new RTCSessionDescription( remoteDesc ) );
			callback(false);
		} else {
			callback("THIS METHOD CAN'T BE CALLED AT THIS MOMENT");
		}

	}

	this.addIceCandidate = function ( ICEInfo ) {
        pc.addIceCandidate( new RTCIceCandidate( ICEInfo ), function () {}, function ( err ) {
        	throw err;
        });
	}
	
	this.close = function ( callback ) {

		if ( state === 0 ) {
			callback( "NOT CONNECTION OPENED" );
		} else if ( state === 1 ) {
			pc.close();
			this.stream.stop();
			state = 2;
		} else {
			callback( "CONNECTION ALREADY CLOSED" );
		}

	}

}