self.onmessage = function(e) {
    const { videoTime, width, height } = e.data;
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const frameData = ctx.getImageData(0, 0, width, height);
    self.postMessage({ frameData });
};