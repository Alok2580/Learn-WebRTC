// script.js
let mediaRecorder;
let recordedChunks = [];

document.getElementById('startBtn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    const video = document.getElementById('video');
    const recordBtn = document.getElementById('recordBtn');

    try {
        // Request access to the camera and microphone
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // Set the video source to the obtained stream
        video.srcObject = stream;

        // Initialize MediaRecorder for recording
        mediaRecorder = new MediaRecorder(stream);

        // Handle data when recording stops
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // Enable the record button
        recordBtn.disabled = false;

        // Update the status
        status.textContent = 'Camera and microphone are active.';
        status.style.color = 'green';
    } catch (error) {
        console.error('Error accessing camera and microphone:', error);
        status.textContent = 'Error: Unable to access camera or microphone.';
        status.style.color = 'red';
    }
});

// Start recording
document.getElementById('recordBtn').addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
        recordedChunks = [];
        mediaRecorder.start();

        document.getElementById('recordBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;

        document.getElementById('status').textContent = 'Recording in progress...';
    }
});

// Stop recording and download the file
document.getElementById('stopBtn').addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();

        document.getElementById('recordBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;

        document.getElementById('status').textContent = 'Recording stopped. You can download it now.';
    }

    mediaRecorder.onstop = () => {
        // Create a Blob from the recorded chunks
        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Set up the download link
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = 'recording.webm';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download Recording';
    };
});
