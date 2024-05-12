import convert from 'https://cdn.skypack.dev/color-convert';
//const convert = require('color-convert');

export default class ColorContainer {
    constructor(color) {
        this.color = color;
    }

    createContainer() {
        //Gets the RGB and HSL color values
        const rgbColor = convert.hex.rgb(this.color).join(', ');
        const hslColor = convert.hex.hsl(this.color).join(', ');

        //Creates container for a generated or added in color
        const colorContainer = document.createElement("div");
        colorContainer.className = "color-container";
        colorContainer.style.backgroundColor = this.color;

        //Event listener for selecting colors for gradation
        colorContainer.addEventListener('click', () => {
            const selectedColors = document.querySelectorAll('.color-container.selected');

            //if more than two colors are selected, remove the second one and replace it with the selected one
            if (selectedColors.length === 2 && !colorContainer.classList.contains('selected')) {
                selectedColors[1].classList.remove('selected');
            }
        
            colorContainer.classList.add('selected');
        });

        //Adds in div section for the RGB, HSL, and hex code values displays
        const colorInfo = document.createElement("div");
        colorInfo.className = "color-info";

        const rgbP = document.createElement("p");
        rgbP.textContent = `RGB: ${rgbColor}`;
        const hslP = document.createElement("p");
        hslP.textContent = `HSL: ${hslColor}`;
        const hexP = document.createElement("p");
        hexP.textContent = `Hexcode: ${this.color}`;

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

    //Calculates a complementary color scheme
    getComplementaryColor() {
        let rgb = convert.hex.rgb(this.color);
        let compColor = convert.rgb.hex(rgb.map(val => 255 - val));
        return `#${compColor}`;
    }

    //Calculates a specific color scheme based on what's selected from the dropdown.
    getPalColors(mode) {
        let hsl = convert.hex.hsl(this.color);
        let palColors = [];
        let newHue = 0;

        switch (mode) {
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