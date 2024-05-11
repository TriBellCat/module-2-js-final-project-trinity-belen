let hexLetters = '0123456789ABCDEF';
let hexTag = '#';
let color = '';
let randomizedColorAmount = 1;
let currentMode = 'Add';
let colorTheory = false;
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

        let removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger remove-button';
        removeButton.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
        removeButton.addEventListener('click', () => {
            colorContainer.remove();
        });

        let copyButton = document.createElement('button');
        copyButton.className = 'btn btn-success copy-button';
        copyButton.innerHTML = '<i class="bi bi-copy"></i>';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this.color);
        });

        colorContainer.appendChild(colorInfo);
        colorContainer.appendChild(colorActions);

        colorActions.appendChild(removeButton);
        colorActions.appendChild(copyButton);

        document.querySelector('.color-lists').appendChild(colorContainer);
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
    Functions for inputing color
*/

//Function to add in a color
function addColor() {
    let inputField = document.querySelector('.form-control');
    let color = inputField.value;
    
    if (color.startsWith('#') && color.length === 7) {
        let colorContainer = new ColorContainer(color);
        colorContainer.createContainer();
        inputField.value = '';
    } 
    
    else {
        alert('Please enter a valid hexcode');
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
    Functions for the color theory
*/

// Generate color palette based on color theory
function generateColorPalette() {
   
}

/* 
    Other Functionality
*/
function clearAllColors() {
    document.querySelector('.color-lists').innerHTML = ''; 
}

//Function to change parts of the UI whenever the user selects from the Color Generation Method dropdown menu
function setColorMode(mode) {
    let addButton = document.getElementById('add-button');
    let generateButton = document.getElementById('generate-button');
    let formControl = document.querySelector('.form-control');
    let dropdownAmount = document.querySelector('.dropdown-amount');

    switch(mode) {
        case 'Add':
            addButton.style.display = 'block';
            generateButton.style.display = 'none';
            formControl.disabled = false;
            dropdownAmount.disabled = true;
            formControl.placeholder = 'Input Hexcode (Type in # at start)';
            colorTheory = false;
            break;

        case 'Random':
            addButton.style.display = 'none';
            generateButton.style.display = 'block';
            formControl.disabled = true;
            dropdownAmount.disabled = false;
            formControl.placeholder = `Amount of colors generated: ${randomizedColorAmount}`;
            colorTheory = false;
            break;

        case 'Complementary':
        case 'Analogous':
        case 'Triadic':
        case 'Tetradic':
            addButton.style.display = 'none';
            generateButton.style.display = 'block';
            formControl.disabled = false;
            dropdownAmount.disabled = true;
            formControl.placeholder = 'Input Hexcode (Type in # at start)';
            colorTheory = true;
            break;
        default:
            console.log('Default case');
    }
}

/* 
    Methods whenever an UI element is clicked on 
*/
document.getElementById('current-color-mode').addEventListener('click', function (event) {
    //Resets entire color palette if user selects a mode
    clearAllColors();

    if (event.target.matches('.color-mode')) {
        let currentMode = event.target.getAttribute('data-bs-value');
        setColorMode(currentMode);
    }
});

document.getElementById('add-button').addEventListener('click', function () {
    addColor();
});

document.getElementById('generate-button').addEventListener('click', function () {
    //Generates randomized colors; does not reset entire palette every generation
    if (!colorTheory) {
        generateRandom();
    }
    
    //Generates colors based off of user input and based off a color theory; resets entire palette every generation
    else {
        clearAllColors();
        //generateColorPalette();

        alert('Color Theory selected!');
    }
});

document.getElementById('clear-all-button').addEventListener('click', function () {
    clearAllColors();
});

document.getElementById('color-amount').addEventListener('click', function (event) {
    let formControl = document.querySelector('.form-control');

    if (event.target.matches('.dropdown-item')) {
        randomizedColorAmount = event.target.getAttribute('data-bs-value');
    }

    formControl.placeholder = `Amount of colors generated: ${randomizedColorAmount}`;
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


// Set the default mode, currently 'Add', on page load
setColorMode(currentMode);


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