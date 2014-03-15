Conference.JS
=============

A simple WebRTC wrapper for video-conferences

How to use:
============

Create a new Peer obj in both nodes:

    var peer = new Peer( function ( event ) { 
      // Callback when remote stream is received at event.stream
    }, function ( e ) {
      // Callback when ICE candidate are created
    });
    
Create an offer in one peer:
    
    peer.offer({ video: true, audio: true }, function ( err, desc ) {
      // The desc parameter has to be sended to the other peer
    });

Answer the offer in the other side:

    peer.answer({ video: true, audio: true }, remoteDesc, function ( err, desc ) {
      // This desc must be sended to the other peer to
    });

Add the desc from the second peer and start talk:

    peer.initCall( remoteDesc, function ( err ) {
      // The call has started!
    });

Add the ICE Candidates:
    peer.addIceCandidate(data);

Enjoy!