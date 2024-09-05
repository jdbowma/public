importScripts('https://cdn.jsdelivr.net/npm/gif.js/dist/gif.worker.js');

self.onmessage = function(event) {
    const { type, data } = event.data;

    if (type === 'init') {
        self.gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: 'https://cdn.jsdelivr.net/npm/gif.js/dist/gif.worker.js'
        });

        self.gif.on('finished', function(blob) {
            self.postMessage({ type: 'finished', blob: blob });
        });
    } else if (type === 'addFrame') {
        self.gif.addFrame(data.imageData, { delay: data.delay });
    } else if (type === 'render') {
        self.gif.render();
    }
};