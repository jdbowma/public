const fileNameTooltip = document.getElementById('fileNameTooltip');
document.getElementById("gifInput").addEventListener('change', handleVideoUpload);
function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById("uploadLabel").style = "display: true; color: #28a745";
        fileNameTooltip.textContent = `"${file.name}" successfully loaded`;
    }
}

document.getElementById('gifConvertButton').addEventListener('click', function() {
const fileInput = document.getElementById('gifInput');
const file = fileInput.files[0];
const termsCheckbox = document.getElementById('termsCheckbox');

if (!file) {
    alert('Please choose a file to convert.');
    return;
}
else if (termsCheckbox.checked == false) {
    alert('Please read and agree to the terms and conditions.');
    return;
}

// Ensure the file is properly uploaded
const reader = new FileReader();

reader.onload = function(event) {
    const fileContent = event.target.result;

    // Here you can handle the file content and start the conversion process.
    // This will depend on how you want to convert the file.
    console.log('File uploaded:', file.name);
    console.log('File content:', fileContent);

    // Example: Start conversion
    startConversion(fileContent);
};

reader.onerror = function(event) {
    alert('Error reading file: ' + event.target.error.code);
};

// Read the file
reader.readAsArrayBuffer(file); // Or readAsDataURL, readAsText, etc. based on the content type
});
function startConversion(fileContent){
    const file = document.getElementById('gifInput').files[0];
    document.getElementById("load").style = "display: true";
        if (file && file.type === 'image/gif') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                document.body.appendChild(img); // Required for SuperGif to work

                const gif = new SuperGif({ gif: img });
                gif.load(function() {
                    const zip = new JSZip();
                    const frameCount = gif.get_length();

                    // Log the number of frames detected
                    console.log(`Number of frames detected: ${frameCount}`);

                    // Clear previous output
                    document.getElementById('pngOutput').innerHTML = '';

                    let loadedFrames = 0;

                    // Process frames in order
                    function processNextFrame(index) {
                        if (index >= frameCount) {
                            // All frames processed
                            document.getElementById('downloadZip').disabled = false;
                            document.getElementById('downloadZip').style = "";
                            return;
                        }

                        gif.move_to(index);
                        const canvas = gif.get_canvas();
                        if (canvas) {
                            canvas.toBlob(function(blob) {
                                const fileName = `frame-${index + 1}.png`;
                                zip.file(fileName, blob);

                                // Display the frame
                                const imgElement = document.createElement('img');
                                imgElement.src = URL.createObjectURL(blob);
                                imgElement.style = "width: 100px;";
                                document.getElementById('pngOutput').appendChild(imgElement);

                                loadedFrames++;
                                console.log(`Frame ${index + 1} processed.`);

                                // Process the next frame
                                processNextFrame(index + 1);
                            }, 'image/png');
                        } else {
                            console.log(`Canvas for frame ${index + 1} is null.`);
                            processNextFrame(index + 1); // Continue with the next frame even if the current one is null
                        }
                    }

                    // Start processing from the first frame
                    processNextFrame(0);
                    document.getElementById("load").style = "display: none";
                    document.getElementById('downloadZip').addEventListener('click', function() {
                        zip.generateAsync({ type: 'blob' }).then(function(content) {
                            saveAs(content, 'frames.zip');
                        });
                    });
                });
            };
            reader.readAsDataURL(file);
        }
    }