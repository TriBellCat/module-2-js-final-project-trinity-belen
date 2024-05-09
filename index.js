let hexLetters = '0123456789ABCDEF';
let hexTag = '#';
let color = '';
let randomizedColorAmount = 1;

class ColorContainer {
    constructor(color) {
        this.color = color;
    }

    createContainer() {
        let rgbColor = this.convertHexToRGB(this.color);
        let hslColor = this.convertHexToHSL(this.color);

        let colorContainer = document.createElement('div');
        colorContainer.className = 'color-container';
        colorContainer.style.backgroundColor = this.color;

        let colorInfo = document.createElement('div');
        colorInfo.className = 'color-info';
        colorInfo.innerHTML = `<p>RGB: ${rgbColor}</p><p>HSL: ${hslColor}</p><p>Hexcode: ${this.color}</p>`;

        let colorActions = document.createElement('div');
        colorActions.className = 'color-actions';
        colorActions.innerHTML = `<button class="btn btn-danger remove-button"><i class="bi bi-x-circle-fill"></i></button><button class="btn btn-success copy-button"><i class="bi bi-copy"></i></button>`;

        colorContainer.appendChild(colorInfo);
        colorContainer.appendChild(colorActions);

        document.querySelector('.color-lists').appendChild(colorContainer);
    }

    //Convert hexcode to RGB (Red, Green, Blue)
    //More specifically, convert hexdecimal to decimal
    convertHexToRGB(hex) {
        let r = 0, g = 0, b = 0;
	
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
        
        return "rgb("+ +r + "," + +g + "," + +b + ")";
    }

    //Convert RGB to HSL (Hue, Saturation, Lightness)
    convertRGBToHSL(r, g, b){
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
        if(cMax == cMin){
            h = s = 0;
        } 

        //Else, the difference of them are calculated
        else {
            let diff = cMax - cMin;

            // S is calculated based on this difference
            s = l > 0.5 ? diff / (2 - cMax - cMin) : diff / (cMax + cMin);

            //H is then calculated based on the max value and the differences between two color channels
            switch(cMax){
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
        return [Math.round(h * 100) / 100, Math.round(s * 100) / 100, Math.round(l * 100) / 100];
    }

    //Convert hexcode to HSL
    convertHexToHSL(hex) {
        let rgb = this.convertHexToRGB(hex);
        let [r, g, b] = rgb.substring(4, rgb.length-1).split(',').map(num => +num);
        return this.convertRGBToHSL(r, g, b);
    }
}

/* 
    Functions for the randomizer
*/

//Completely randomized colors generator
function randomizeColors() {
    color = '';

    for (var i = 0; i < 6; i++) {
        color = color.concat(hexLetters[Math.floor(Math.random() * 16)]);
    }
    color = '#' + color;

    return color;
}

//Calls randomizeColors the amount of colors the user wants to generate
function generateRandom() {
    for (let i = 0; i < randomizedColorAmount; i++) {
        randomizeColors();
        console.log(color);
        let colorContainer = new ColorContainer(color);
        colorContainer.createContainer();
    }
}

/* 
    Other Functionality
*/
function clearAllColors() {
    document.querySelector('.color-lists').innerHTML = ''; 
}


/* 
    Functions when an UI element is clicked on 
*/
document.getElementById('generate-button').addEventListener('click', function () {
    clearAllColors();
    generateRandom();
});

document.getElementById('clear-all-button').addEventListener('click', function () {
    clearAllColors();
});

document.getElementById('color-amount').addEventListener('click', function (event) {
    if (event.target.matches('.dropdown-item')) {
        randomizedColorAmount = event.target.getAttribute('data-bs-value');
    }
});

document.getElementById('theme-button').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    var themeButton = document.getElementById('theme-button');
    
    if (document.body.classList.contains('dark-mode')) {
        themeButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
        themeButton.className = 'btn btn-dark';
    
    } 
    else {
        themeButton.innerHTML = '<i class="bi bi-sun-fill"></i>';
        themeButton.className = 'btn btn-warning';
    }
});

//Functions to test some things
/*function testColor() {
    getRandomColor();
    alert(color);
    color = '';
}*/

/* 
    function testDropdown(){
        // The event.target is the clicked element
        if (event.target.matches('.dropdown-item')) {
        // Get the data-bs-value attribute of the clicked element
        var value = event.target.getAttribute('data-bs-value');
        console.log(value); // This will log the value of the selected option
    }
    }
*/