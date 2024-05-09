let hexLetters = '0123456789ABCDEF';
let hexTag = '#';
let color = '';
let randomizedColorAmount = 1;

class ColorContainer {
    constructor(color) {
        this.color = color;
    }

    createContainer() {
        let colorContainer = document.createElement('div');
        colorContainer.className = 'color-container';
        colorContainer.style.backgroundColor = this.color;

        let colorInfo = document.createElement('div');
        colorInfo.className = 'color-info';
        colorInfo.innerHTML = `<p>RGB: </p><p>HSL: </p><p>Hexcode: ${this.color}</p>`;

        let colorActions = document.createElement('div');
        colorActions.className = 'color-actions';
        colorActions.innerHTML = `<button class="btn btn-danger">X</button><button class="btn btn-success">Copy</button>`;

        colorContainer.appendChild(colorInfo);
        colorContainer.appendChild(colorActions);

        document.querySelector('.color-lists').appendChild(colorContainer);
    }

    //Convert hex code to rgb
    convertHexToRGB(color) {

    }

    //Convert hex code to hsl
    convertHexToHSL(color) {

    }
}

/* 
    Functions for the randomizer
*/
//Generate Random Colors
function randomizeColors() {
    color = '';


    for (var i = 0; i < 6; i++) {
        color = color.concat(hexLetters[Math.floor(Math.random() * 16)]);
    }
    color = '#' + color;

    return color;
}

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