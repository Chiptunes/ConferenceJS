var configuration      = { "iceServers": [ /* Write your STUN/TURN server list */ ]};

var RTCPeerConnection  = webkitRTCPeerConnection || mozRTCPeerConnection;
navigator.getUserMedia = navigator.getUserMedia  || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

function Peer( addstream, icecandidate ) {
	
	var state = 0;
	var pc = new RTCPeerConnection( configuration );

	pc.onaddstream    = addstream;
	pc.onicecandidate = icecandidate;

	this.offer = function ( callElements, callback ) {

		if ( state === 0 ) {

			navigator.getUserMedia( callElements, function ( stream ) {
				
				this.stream = stream;
				pc.addStream( stream );

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

	this.answer = function ( callElements, remoteDesc, remote ) {

		if ( state === 0 ) {

			navigator.getUserMedia( callElements, function ( stream ) {

				pc.setRemoteDescription( new RTCSessionDescription( remoteDesc ) );

				this.stream = stream;
				pc.addStream( stream );

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
			pc.setRemoteDescription( new RCTSessionDescription( remoteDesc ) );
			callback(false);
		} else {
			callback("THIS METHOD CAN'T BE CALLED AT THIS MOMENT");
		}

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