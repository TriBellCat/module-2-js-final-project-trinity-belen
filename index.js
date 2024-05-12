import ColorContainer from './colorContainer.js';

let color = "";
let randomizedColorAmount = 1;
let currentMode = "Add";
let colorTheory = false;

//Function to add and potentially generate a color scheme when an user inputs a hex code
function addColor() {
    let inputField = document.querySelector(".form-control");
    let color = inputField.value;
    let colorContainer = new ColorContainer(color);
    let palContainer = new ColorContainer();

    //console.log(currentMode);
    if (color.startsWith("#") && color.length === 7) {
        switch (currentMode) {
            case "Complementary":
                let compColor = colorContainer.getComplementaryColor();
                palContainer = new ColorContainer(compColor);
                palContainer.createContainer();
                break;
            case "Analogous":
            case "Triadic":
            case "Tetradic":
                let palColors = colorContainer.getPalColors(currentMode);
                palColors.forEach((color) => {
                    let palContainer = new ColorContainer(color);
                    palContainer.createContainer();
                });
                break;
        }
        //Color from user input
        colorContainer = new ColorContainer(color);
        colorContainer.createContainer();
        inputField.value = "";
    } 
    else {
        alert("Please enter a valid hexcode");
    }
}

//Completely randomized colors generator
function randomizeColors() {
    const hexLetters = "0123456789ABCDEF";
    color = "";

    for (var i = 0; i < 6; i++) {
        color = color.concat(hexLetters[Math.floor(Math.random() * 16)]);
    }
    color = "#" + color;

    return color;
}

//Calls randomizeColors the amount of colors the user wants to generate
function generateRandom() {
    for (let i = 0; i < randomizedColorAmount; i++) {
        randomizeColors();
        //console.log(color);
        let colorContainer = new ColorContainer(color);
        colorContainer.createContainer();
    }
}

//Create gradation out of selected colors
function createGradation() {
    clearGradation();

    // Get the selected colors
    const selectedColors = document.querySelectorAll('.color-container.selected');
    
    // Check if two colors are selected
    if (selectedColors.length > 2) {
        alert('Please select more than 1');
        return;
    }

    // Gets the color values
    const color1 = selectedColors[0].style.backgroundColor;
    const color2 = selectedColors[1].style.backgroundColor;

    // Creates the popup
    const popup = document.createElement('div');
    popup.className = "gradation-popup";

    //Clicking on popup wil delete it
    popup.addEventListener('click', function () {
        document.body.removeChild(popup);
    });

    // Creates the gradation
    const gradation = document.createElement('div');
    gradation.className = "gradation";
    gradation.style.background = `linear-gradient(to right, ${color1}, ${color2})`;

    // Add the gradation to the popup
    popup.appendChild(gradation);

    // Add the popup to the body
    document.body.appendChild(popup);
}

//Function to change parts of the UI whenever the user selects from the Color Generation Method dropdown menu
function setColorMode(mode) {
    let addButton = document.getElementById("add-button");
    let generateButton = document.getElementById("generate-button");
    let formControl = document.querySelector(".form-control");
    let dropdownAmount = document.querySelector(".dropdown-amount");

    switch (mode) {
        case "Add":
            addButton.style.display = "block";
            generateButton.style.display = "none";
            formControl.disabled = false;
            dropdownAmount.disabled = true;
            formControl.placeholder = "Input Hexcode (Type in # at start)";
            colorTheory = false;
            break;
        case "Random":
            addButton.style.display = "none";
            generateButton.style.display = "block";
            formControl.disabled = true;
            dropdownAmount.disabled = false;
            formControl.placeholder = `Amount of colors generated: ${randomizedColorAmount}`;
            colorTheory = false;
            break;
        case "Complementary":
        case "Analogous":
        case "Triadic":
        case "Tetradic":
            addButton.style.display = "none";
            generateButton.style.display = "block";
            formControl.disabled = false;
            dropdownAmount.disabled = true;
            formControl.placeholder = "Input Hexcode (Type in # at start)";
            colorTheory = true;
            break;
        default:
            Alert("Default case");
    }

    currentMode = mode;
}

function clearAllColors() {
    clearGradation();
    document.querySelector(".color-lists").innerHTML = "";
}

function clearGradation() {
    const existingPopup = document.querySelector('.gradation-popup');

    if (existingPopup) {
        existingPopup.parentElement.removeChild(existingPopup);
    }
}

document.getElementById("current-color-mode").addEventListener("click", function (event) {
    //Resets entire color palette if user selects a mode
    clearAllColors();

    if (event.target.matches(".color-mode")) {
        let currentMode = event.target.getAttribute("data-bs-value");
        //console.log(currentMode);
        setColorMode(currentMode);
    }
});

document.getElementById("add-button").addEventListener("click", function () {
    addColor();
});

document.getElementById("generate-button").addEventListener("click", function () {
    //Generates randomized colors; does not reset entire palette every generation
    if (!colorTheory) {
        clearGradation();
        generateRandom();
    }

    //Generates colors based off of user input and based off a color theory; resets entire palette every generation
    else {
        clearAllColors();
        addColor();
    }
});

document.getElementById("create-gradation-button").addEventListener("click", function () {
    createGradation();
});

document.getElementById("clear-all-button").addEventListener("click", function () {
    clearAllColors();
});

document.getElementById("color-amount").addEventListener("click", function (event) {
    let formControl = document.querySelector(".form-control");

    if (event.target.matches(".dropdown-item")) {
        randomizedColorAmount = event.target.getAttribute("data-bs-value");
    }

    formControl.placeholder = `Amount of colors generated: ${randomizedColorAmount}`;
});

document.getElementById("theme-button").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    var themeButton = document.getElementById("theme-button");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
        themeButton.className = "btn btn-dark";
    } else {
        themeButton.innerHTML = '<i class="bi bi-sun-fill"></i>';
        themeButton.className = "btn btn-warning";
    }
});

// Set the default mode, currently 'Add', on page load
setColorMode(currentMode);