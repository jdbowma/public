document.addEventListener('DOMContentLoaded', (event) => {
    const generateButton = document.getElementById('generateButton');
    const output = document.getElementById('output');
    const downloadButton = document.getElementById('downloadButton');
    const disallowSection = document.getElementById('disallow-section');
    const allowSection = document.getElementById('allow-section');
    const addDisallowButton = document.getElementById('addDisallow');
    const addAllowButton = document.getElementById('addAllow');
    const bulkDisallowTextarea = document.getElementById('bulkDisallow');
    const bulkAllowTextarea = document.getElementById('bulkAllow');
    const expandButton = document.getElementById('expandCollapseButton');

    generateButton.addEventListener('click', generateRobotsTxt);
    addDisallowButton.addEventListener('click', addDisallowField);
    addAllowButton.addEventListener('click', addAllowField);
    expandButton.addEventListener('click', growDiv);

    function growDiv() {
       
        if (document.getElementById('grow').clientHeight) {
            document.getElementById('grow').style.height = 0;
            expandButton.textContent = 'Show Bulk Paste Options';
        } else {
          var wrapper = document.querySelector('.measuringWrapper');
          document.getElementById('grow').style.height = wrapper.clientHeight + "px";
          expandButton.textContent = 'Hide Bulk Paste Options';
        }
      }

    function generateRobotsTxt() {
        document.getElementById('outputHeader').style.display = 'block';
        const userAgent = document.getElementById('userAgent').value || '*';
        let robotsTxt = `User-agent: ${userAgent}\n`;

        const disallowInputs = document.querySelectorAll('.disallow');
        disallowInputs.forEach(input => {
            if (input.value) {
                robotsTxt += `Disallow: ${input.value}\n`;
            }
        });

        const allowInputs = document.querySelectorAll('.allow');
        allowInputs.forEach(input => {
            if (input.value) {
                robotsTxt += `Allow: ${input.value}\n`;
            }
        });

        // Process bulk pasted Disallow
        const disallowLines = bulkDisallowTextarea.value.trim().split('\n');
        disallowLines.forEach(line => {
            if (line.trim()) {
                robotsTxt += `Disallow: ${line.trim()}\n`;
            }
        });

        // Process bulk pasted Allow
        const allowLines = bulkAllowTextarea.value.trim().split('\n');
        allowLines.forEach(line => {
            if (line.trim()) {
                robotsTxt += `Allow: ${line.trim()}\n`;
            }
        });

        output.textContent = robotsTxt;
        downloadButton.style.display = '';
        downloadButton.style.justifyContent = 'center';
    }

    function addDisallowField() {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'disallow';
        input.placeholder = '/path-to-disallow';
        disallowSection.appendChild(input);
    }

    function addAllowField() {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'allow';
        input.placeholder = '/path-to-allow';
        allowSection.appendChild(input);
    }

    downloadButton.addEventListener('click', downloadRobotsTxt);

    function downloadRobotsTxt() {
        const blob = new Blob([output.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robots.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});