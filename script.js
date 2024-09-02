//Global variables for writing
let canvas= document.querySelector("#whiteboard");
let canvasUse= canvas.getContext('2d');
let draw= false;
let tool= 'pen';

//eventListeners for writing
canvas.addEventListener('mousedown', ()=>{
    draw=true;
    canvasUse,beginPath();
});

function resizeCanvas(){
    canvas.width= canvas.clientWidth;
    canvas.height=canvas.clientHeight;
}
resizeCanvas();

canvas.addEventListener('mouseup',()=>{
    draw=false;
    canvasUse.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
    if (!draw) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    canvasUse.lineWidth = tool === 'pen' ? 2 : 10;
    canvasUse.lineCap = 'round';
    canvasUse.strokeStyle = tool === 'pen' ? '#000' : '#fff';

    canvasUse.lineTo(x, y);
    canvasUse.stroke();
});

//CreatingTools
document.querySelector("#penTool").addEventListener('click',()=>{
    tool='pen';
});

document.querySelector("#eraserTool").addEventListener('click',()=>{
    tool='eraser';
});

document.querySelector("#clearBoard").addEventListener('click',()=>{
    canvasUse.clearRect(0,0,canvas.width,canvas.height);
});

//VideConnections
let localVideo=document.getElementById('localVideo');
let remoteVideo=document.getElementById('remoteVideo');


//Creating Peer Connections and media streams
let localStream;
let remoteStream;
let peer;
let call;
//let peerId = prompt("Enter the peer ID");


// Function to start the call
async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true, audio: true
        });
        localVideo.srcObject = localStream;  
        peer = new Peer(); 
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            document.getElementById('peerId').innerText= "Your peer ID is "+id;
        });
        peer.on('call', (incomingCall) => {
            incomingCall.answer(localStream);

            incomingCall.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream;
            });
        });

    } catch (error) {
        console.error('Error starting the call:', error);
    }
}

function callPeer(remotePeerId) {
    call = peer.call(remotePeerId, localStream);
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });
}

document.querySelector('#startCall').addEventListener('click', startCall);
