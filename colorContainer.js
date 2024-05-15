export default class ColorContainer {
    constructor(color) {
        this.color = color;
    }

    //Color creation
    createContainer() {
        //Gets the RGB and HSL color values
        let rgbColor = this.convertHexToRGB(this.color);
        let hslColor = this.convertHexToHSL(this.color);

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

    //Convert hex code to RGB (Red, Green, Blue)
    convertHexToRGB(hex) {
        let r = 0, g = 0, b = 0;

        //Convert the hexadecimals to decimals
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);

        return "rgb(" + r + "," + g + "," + b + ")";
    }

    convertRGBToHSL(r, g, b) {
        //Normalize the RGB Values
        r /= 255;
        g /= 255;
        b /= 255;
    
        //Calculate the maximum and minimum values of the normalized RGB values
        let cMax = Math.max(r, g, b);
        let cMin = Math.min(r, g, b);
    
        //Calculate the average of the maximum and minimum values for L
        let h, s, l = (cMax + cMin) / 2;
    
        //If the min and max values are the same, H and S are set to 0 and the color is a shade of gray
        if (cMax == cMin) {
            h = s = 0;
        }
    
        //Else, the difference of them are calculated
        else {
            let diff = cMax - cMin;
    
            // S is calculated based on this difference
            s = l > 0.5 ? diff / (2 - cMax - cMin) : diff / (cMax + cMin);
    
            //H is then calculated based on the max value and the differences between two color channels
            switch (cMax) {
                case r:
                    h = (g - b) / diff + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / diff + 2;
                    break;
                case b:
                    h = (r - g) / diff + 4;
                    break;
            }
            h /= 6;
        }
    
        //Return the HSL values in an array after rounding them to 2 decimals
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }

    //Convert hexcode to HSL
    convertHexToHSL(hex) {
        let rgb = this.convertHexToRGB(hex);
        let [r, g, b] = rgb.substring(4, rgb.length - 1).split(',').map(num => +num);
        return this.convertRGBToHSL(r, g, b);
    }

    //Converts HSL back to hexcode
    convertHSLToHex(h, s, l) {
        l /= 100;

        //Temporary variable to calculate the chroma 
        const tempChroma = s * Math.min(l, 1 - l) / 100;

        //Calculates the RGB values from the HSL values 
        //colorComp determines which color compononent, RGB, is called in the function
        const calcRGB = colorComp => {            
            //Adjusts the hue value 
            const adjHue = (colorComp + h / 30) % 12;
            
            //Calculates the RGB color value
            const color = l - tempChroma * Math.max(Math.min(adjHue - 3, 9 - adjHue, 1), -1);

            //Converts the color to hexadecimal
            return Math.round(255 * color).toString(16).padStart(2, '0'); 
        };
        
        //calls calcRGB for each value of R, G, B invidiually
        return `#${calcRGB(0)}${calcRGB(8)}${calcRGB(4)}`;
    }

    //Calculates a specific color scheme based on what's selected from the dropdown.
    getPalColors(mode) {
        let hsl = this.convertHexToHSL(this.color);
        let palColors = [];
        let newHue = 0;

        switch (mode) {
            //Generates one color by adding 180 degrees to the hue of the current color
            case 'Complementary':
                newHue = (hsl[0] + 180) % 360;
                palColors.push(this.convertHSLToHex(newHue, hsl[1], hsl[2]));
                break;
            //Generates two colors by adding 30 degrees from the hue of the current color.
            case 'Analogous':
                //The color the user puts in is directly in the middle of two colors that need to be generated
                for (let i = -1; i <= 1; i += 2) {
                    newHue = (hsl[0] + (i * 30)) % 360;
                    palColors.push(this.convertHSLToHex(newHue, hsl[1], hsl[2]));
                }
                break;
            //Generates two colors by adding 120 and 240 degrees to the hue of the current color.
            case 'Triadic':
                for (let i = 1; i <= 2; i++) {
                    newHue = (hsl[0] + (i * 120)) % 360;
                    palColors.push(this.convertHSLToHex(newHue, hsl[1], hsl[2]));
                }
                break;
            //Generates three colors by adding 90, 180, and 270 degrees to the hue of the current color.
            case 'Tetradic':
                for (let i = 1; i <= 3; i++) {
                    newHue = (hsl[0] + (i * 90)) % 360;
                    palColors.push(this.convertHSLToHex(newHue, hsl[1], hsl[2]));
                }
                break;
            default:
                alert("ERROR!");
        }

        return palColors;
    }
}