import convert from 'https://cdn.skypack.dev/color-convert';
//const convert = require('color-convert');

export default class ColorContainer {
    constructor(color) {
        this.color = color;
    }

    //Color creation
    createContainer() {
        const hexP = document.createElement("p");
        hexP.textContent = `Hexcode: ${this.color}`;

        //Gets the RGB and HSL color values
        const rgbColor = convert.hex.rgb(this.color).join(', ');
        let hslColor = convert.hex.hsl(this.color);
        
        //Converts hsl to decimal
        hslColor = [parseFloat((hslColor[0]/360).toFixed(2)), hslColor[1]/100, hslColor[2]/100].join(', ');

        //Creates container for a generated or added in color
        const colorContainer = document.createElement("div");
        colorContainer.className = "color-container";
        colorContainer.style.backgroundColor = this.color;

        //Event listener for selecting colors for gradation
        colorContainer.addEventListener('click', () => {
            const selectedColors = document.querySelectorAll('.color-container.selected');
            
            //if more than two colors are selected, remove one and replace it with the selected one
            if (selectedColors.length === 2 && !colorContainer.classList.contains('selected')) {
                selectedColors[0].classList.remove('selected');
            }
        
            colorContainer.classList.toggle('selected');
        });

        //Adds in div section for the RGB, HSL, and hex code values displays
        const colorInfo = document.createElement("div");
        colorInfo.className = "color-info";

        const rgbP = document.createElement("p");
        rgbP.textContent = `RGB: ${rgbColor}`;
        const hslP = document.createElement("p");
        hslP.textContent = `HSL: ${hslColor}`;
     
        colorInfo.append(rgbP, hslP, hexP);

        //Adds in div section for the remove buttons and copy buttons that will be added to it
        const colorActions = document.createElement("div");
        colorActions.className = "color-actions";

        const removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger remove-button";
        removeButton.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
        removeButton.addEventListener('click', () => {
            colorContainer.remove();
        });

        const copyButton = document.createElement("button");
        copyButton.className = "btn btn-success copy-button";
        copyButton.innerHTML = '<i class="bi bi-copy"></i>';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this.color);
        });

        colorActions.append(removeButton, copyButton);

        colorContainer.appendChild(colorInfo);
        colorContainer.appendChild(colorActions);

        document.querySelector(".color-lists").appendChild(colorContainer);
    }

    //Calculates a specific color scheme based on what's selected from the dropdown.
    getPalColors(mode) {
        let hsl = convert.hex.hsl(this.color);
        let palColors = [];
        let newHue = 0;

        switch (mode) {
            //Generates one color by adding 180 degrees to the hue of the current color
            case 'Complementary':
                newHue = (hsl[0] + 180) % 360;
                palColors.push(`#${convert.hsl.hex([newHue, hsl[1], hsl[2]])}`);
                break;
            //Generates two colors by adding 30 degrees from the hue of the current color.
            case 'Analogous':
                //The color the user puts in is directly in the middle of two colors that need to be generated
                for (let i = -1; i <= 1; i += 2) {
                    newHue = (hsl[0] + (i * 30)) % 360;
                    palColors.push(`#${convert.hsl.hex([newHue, hsl[1], hsl[2]])}`);
                }
                break;
            //Generates two colors by adding 120 and 240 degrees to the hue of the current color.
            case 'Triadic':
                for (let i = 1; i <= 2; i++) {
                    newHue = (hsl[0] + (i * 120)) % 360;
                    palColors.push(`#${convert.hsl.hex([newHue, hsl[1], hsl[2]])}`);
                }
                break;
            //Generates three colors by adding 90, 180, and 270 degrees to the hue of the current color.
            case 'Tetradic':
                for (let i = 1; i <= 3; i++) {
                    newHue = (hsl[0] + (i * 90)) % 360;
                    palColors.push(`#${convert.hsl.hex([newHue, hsl[1], hsl[2]])}`);
                }
                break;
            default:
                alert("ERROR!");
        }

        return palColors;
    }    
}