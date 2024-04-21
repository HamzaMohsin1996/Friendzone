// Get references to HTML elements
const startCallButton = document.getElementById('startCallButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// Variables for WebRTC
let localStream;
let peerConnection;
let isCallInitiated = false; // Track if the call is initiated

// Function to start the call and initialize local stream
async function startCall() {
    try {
        // Get access to the user's camera and microphone
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        // Display the local video stream
        localVideo.srcObject = localStream;

        // Create the peer connection after localStream is initialized
        createPeerConnection();

        // Update UI
        startCallButton.disabled = true; // Disable the button once the call is initiated
        isCallInitiated = true;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

// Event listener for the start call button
startCallButton.addEventListener('click', startCall);


// Event listener for the start call button
startCallButton.addEventListener('click', startCall);

// Function to create the peer connection
function createPeerConnection() {
    // Create a new RTCPeerConnection object
    peerConnection = new RTCPeerConnection();

    // Add the local stream to the peer connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Event handler for receiving remote tracks
    peerConnection.ontrack = event => {
        // Display the remote video stream in the remote video element
        remoteVideo.srcObject = event.streams[0];
    };

    // Event handler for ICE candidate generation
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send ICE candidate to the other peer through the signaling server
            sendSignal(JSON.stringify({ ice: event.candidate }));
        }
    };

    // Event handler for negotiation needed
    peerConnection.onnegotiationneeded = async () => {
        try {
            // Create and set local description
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            // Send offer to the other peer through the signaling server
            sendSignal(JSON.stringify({ sdp: peerConnection.localDescription }));
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };
}

// Event listener for the start call button
startCallButton.addEventListener('click', startCall);

// Check if the page is loaded as a second tab
if (window.opener && window.opener !== window) {
    // Hide the start call button
    startCallButton.style.display = 'none';

    // Show the accept call button
    const acceptCallButton = document.createElement('button');
    acceptCallButton.textContent = 'Accept Call';
    document.body.appendChild(acceptCallButton);

    // Function to handle accepting the call
    acceptCallButton.addEventListener('click', () => {
        // Create the peer connection
        createPeerConnection();

        // Hide the accept call button
        acceptCallButton.style.display = 'none';
    });
} else {
    // Open the second tab
    const secondTab = window.open('index.html');
    if (secondTab) {
        // Add event listener to wait for the second tab to load
        secondTab.addEventListener('load', () => {
            // Execute JavaScript code in the second tab to automatically accept the call
            secondTab.postMessage('acceptCall', '*');
        });
    } else {
        console.error('Failed to open the second tab.');
    }
}

// Event listener to handle messages from the second tab
window.addEventListener('message', event => {
    if (event.data === 'acceptCall') {
        // Automatically accept the call in the first tab
        acceptCall();
    }
});
