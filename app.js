document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('videoInput');
    const convertButton = document.getElementById('convertButton');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const progressBar = document.getElementById('progressBar');
    const frameRateInput = document.getElementById('frameRateInput');
    const gifOutput = document.getElementById('gifOutput');
    const fileNameTooltip = document.getElementById('fileNameTooltip');
    const downloadLink = document.getElementById('downloadLink');
    const downloadButton = document.getElementById('downloadButton');

    let frames = [];
    let totalFrames;
    let fileIsUploaded = false;
    let isCreatingGIF = false;
    let startTime, endTime;

    // Cache frequently accessed DOM elements to minimize lookups
    const uploadLabel = document.getElementById("uploadLabel");
    const termsCheckbox = document.getElementById("termsCheckbox");
    const output = document.getElementById("output");

    videoInput.addEventListener('change', handleVideoUpload);
    convertButton.addEventListener('click', convertToGIF);

    function handleVideoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            fileIsUploaded = true;
            const url = URL.createObjectURL(file);
            video.src = url;
            video.load();
            video.muted = true; // Ensure the video is muted
            video.onloadedmetadata = () => {
                video.muted = true; // Keep the video muted
                uploadLabel.style.color = "#28a745";
                fileNameTooltip.textContent = `"${file.name}" successfully loaded`;
            };
            document.getElementById("uploadLabel").style = "display: true; color: #28a745";
        }
    }

    function captureFrame(targetTime) {
        if (video.currentTime >= targetTime) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            return true;
        }
        return false;
    }

    function convertToGIF() {
        if (termsCheckbox.checked && fileIsUploaded) {
            const qualityInput = document.getElementById('qualitySelect');
            if (qualityInput.value === 'Low') {
                canvas.width = Math.floor(video.videoWidth * 0.25); 
                canvas.height = Math.floor(video.videoHeight * 0.25);
            }
            else if (qualityInput.value === 'xtraLow') {
                canvas.width = Math.floor(video.videoWidth * 0.15); 
                canvas.height = Math.floor(video.videoHeight * 0.15);
            }
            else if (qualityInput.value === 'Medium') {
                canvas.width = Math.floor(video.videoWidth * 0.5);  // Scale down by 50%
                canvas.height = Math.floor(video.videoHeight * 0.5);
            }
            else if (qualityInput.value === 'High') {
                canvas.width = Math.floor(video.videoWidth * 0.8);  // Scale down by 50%
                canvas.height = Math.floor(video.videoHeight * 0.8);
            }
            else {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            progressBar.style.display = "";
            output.style.display = "";
            frames = [];
            video.currentTime = 0;
            video.muted = true; // Ensure the video remains muted

            const frameRate = parseInt(frameRateInput.value, 10);
            totalFrames = Math.ceil(video.duration * frameRate);

            let nextCaptureTime = 0;
            const frameDuration = 1 / frameRate;

            // Start timing the conversion process
            startTime = Date.now();

            video.onplay = () => {
                video.muted = true; // Ensure the video remains muted during playback
                video.addEventListener('seeked', captureNextFrame);
                captureNextFrame();
            };

            function captureNextFrame() {
                if (captureFrame(nextCaptureTime)) {
                    nextCaptureTime += frameDuration;
                    updateProgressBar((frames.length / totalFrames) * 0.5);
                    if (nextCaptureTime <= video.duration) {
                        video.currentTime = nextCaptureTime;
                    } else {
                        finalizeCapture();
                    }
                } else {
                    // In case of a stall, move to the next frame after a short delay
                    setTimeout(() => {
                        video.currentTime = nextCaptureTime;
                    }, 100);
                }
            }

            function finalizeCapture() {
                video.removeEventListener('seeked', captureNextFrame);
                updateProgressBar(0.5);
                createGIF(frameRate);
            }

            video.play();
        } else {
            alert("Please upload a file and accept the terms.");
        }
    }

    function createGIF(frameRate) {
        if (isCreatingGIF) return;
        isCreatingGIF = true;

        const gif = new GIF({
            workers: 8,
            quality: 20,
            workerScript: 'gif.worker.js'
        });

        frames.forEach(frame => gif.addFrame(frame, { delay: 1000 / frameRate }));

        gif.on('progress', progress => updateProgressBar(0.5 + progress * 0.5));

        gif.on('finished', blob => {
            const gifBlobURL = URL.createObjectURL(blob);
            gifOutput.src = gifBlobURL;
            gifOutput.style.display = 'block';
            updateProgressBar(1);
            isCreatingGIF = false;

            downloadLink.href = gifBlobURL;
            downloadButton.style.display = "";

            // End timing the conversion process
            endTime = Date.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
            console.log(`GIF conversion took ${timeTaken} seconds.`);
        });

        gif.render();
    }

    function updateProgressBar(progress) {
        const progressPercentage = (progress * 100).toFixed(2) + '%';
        progressBar.style.width = progressPercentage;
        progressBar.textContent = progressPercentage;
    }
});
