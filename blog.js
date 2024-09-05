const SPACE_ID = 'v7xig7w3uxxb';
const ACCESS_TOKEN = 'gJpfuZ-5EBJ5N0yqn1Nxf2F3-wg8reNHkVjq98a9ST8';

fetch(`https://cdn.contentful.com/spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}`)
.then(response => response.json())
  .then(data => {
    // data.items contains the array of entries
    console.log(data.items);
    data.items.forEach(item => {
    
      // Extract the fields from each item
      const title = item.fields.internalName;
      const headline = item.fields.headline;
      document.getElementById("toc").innerHTML += `<ul><li><h4><a href="#${title}">${title}</a></h4></li></ul>`;
      // Create HTML elements for the title and headline
      const contentDiv = document.createElement('div');
      contentDiv.id = title;
      const titleElement = document.createElement('h1');
      const headlineElement = document.createElement('h2');
      headlineElement.style = 'margin-bottom: 30px;';
      titleElement.style = 'text-align: center;';
      headlineElement.style = 'text-align: center;';
      const divBox = document.createElement('div');
      var rand = Math.floor(Math.random() * 360); // Generate a random hue value between 0 and 360
      var hue = (rand + 30) % 360; // Add 30 to the random hue value to create a variation
      var saturation = 10; // Set the saturation value to 10 for a light muted style
      // Check if there are any existing boxes
      const existingBoxes = document.querySelectorAll('.box');
      const existingColors = Array.from(existingBoxes).map(box => box.style.backgroundColor);

      // Generate a new color that is distinct from existing colors
      let lightness = 90; // Set the lightness value to 90 for a light muted style
      let backgroundColor;
      do {
        var rand = Math.floor(Math.random() * 360); // Generate a random hue value between 0 and 360
        var hue = (rand + 30) % 360; // Add 30 to the random hue value to create a variation
        var saturation = 10; // Set the saturation value to 10 for a light muted style
        backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Create the background color using HSL color model
      } while (existingColors.some(color => isColorTooClose(color, backgroundColor)));

      function isColorTooClose(color1, color2) {
        // Convert colors to HSL format
        const hsl1 = colorToHsl(color1);
        const hsl2 = colorToHsl(color2);

        // Calculate the difference in hue values
        const hueDiff = Math.abs(hsl1.h - hsl2.h);

        // Check if the difference is less than a certain threshold
        const hueThreshold = 0; // Adjust this value to control the color distinctness
        if (hueDiff < hueThreshold) {
          return true;
        }

        return false;
      }

      function colorToHsl(color) {
        const rgb = color.match(/\d+/g).map(Number);
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l;

        if (max === min) {
          h = 0;
        } else if (max === r) {
          h = ((g - b) / (max - min)) % 6;
        } else if (max === g) {
          h = (b - r) / (max - min) + 2;
        } else if (max === b) {
          h = (r - g) / (max - min) + 4;
        }

        h = Math.round(h * 60);
        if (h < 0) {
          h += 360;
        }

        l = (max + min) / 2;
        s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));

        return { h, s, l };
      }

      divBox.style = `background-color: ${backgroundColor}; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:left;`;
      backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Create the background color using HSL color model
      divBox.style = `background-color: ${backgroundColor}; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:left;`;
      titleElement.textContent = title;
      headlineElement.textContent = headline;
      divBox.appendChild(titleElement);
      divBox.appendChild(headlineElement);

      // Check if bodyText exists
      if (item.fields.bodyText && item.fields.bodyText.content) {
        // Loop through bodyText content
        item.fields.bodyText.content.forEach(paragraph => {
          const paragraphElement = document.createElement('p');
          var headingType = 0;
          paragraphElement.style = 'margin-bottom: 25px;';
          if (paragraph.content[0].value.startsWith('h2')) {
            headingType = 2;
          } else if (paragraph.content[0].value.startsWith('h3')) {
            headingType = 3;
          } else if (paragraph.content[0].value.startsWith('h4')) {
            headingType = 4;
          } else if (paragraph.content[0].value.startsWith('h5')) {
            headingType = 5;
          } else if (paragraph.content[0].value.startsWith('h6')) {
            headingType = 6;
          }
          // Loop through paragraph content
          paragraph.content.forEach(textItem => {
            let element;

            // Handle bold marks
            const isBold = textItem.marks && textItem.marks.some(mark => mark.type === 'bold');
            
            if (isBold) {
              element = document.createElement('strong');
            } else {
              element = document.createElement('span');
            }

            

            // Handle hyperlinks
            if (textItem.nodeType === 'hyperlink') {
              const linkElement = document.createElement('a');
              linkElement.href = textItem.data.uri;
              linkElement.textContent = textItem.content[0].value; // Link text
              paragraphElement.appendChild(linkElement);
            } else if (headingType !== 0) {
              paragraphElement.style = `font-size: ${2-(0.3*(headingType*0.7))}em; font-weight: bold; margin-bottom: 10px;`;
              paragraphElement.textContent = paragraph.content[0].value.slice(3);
            }
            else if (textItem.nodeType === 'text') {
              element.textContent = textItem.value; // Regular text
              element.style = 'font-size: 1.1em; margin-bottom: 10px;';
              paragraphElement.appendChild(element);
            }
            else if (textItem.nodeType === 'embedded-asset-block') {
              const imgElement = document.createElement('img');
              imgElement.src = textItem.data.target.fields.file.url;
              imgElement.alt = textItem.data.target.fields.title;
              imgElement.style = 'max-width: 100%;';
              paragraphElement.appendChild(imgElement);
            }        
          });

          // Append paragraph to contentDiv
          divBox.appendChild(paragraphElement);
          contentDiv.appendChild(divBox);
        });
      } else {
        console.warn('bodyText field is missing or not structured as expected for this entry.');
      }

      document.getElementById("container").appendChild(contentDiv);
    });
  })
  .catch(error => console.error('Error:', error));