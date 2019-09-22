
console.log("smarthome");

let lightSwitches = document.getElementsByClassName('switch');
let redValues = document.getElementsByClassName("R");
let greenValues = document.getElementsByClassName("G");
let blueValues = document.getElementsByClassName("B");
let brightnessValues = document.getElementsByClassName("Brightness");

let colorDisplay = document.getElementById("colorDisplay");

let titleField = document.getElementById("titleField");
let descriptionField = document.getElementById("descriptionField");

// Lightswitch eventlisteners
for (let i=0; i<lightSwitches.length; i++) {

    lightSwitches[i].addEventListener('input', function() {
        lightSwitches[i].checked = !lightSwitches[i].checked;
    })
}

// Add eventlisteners to sliders:
let redSlider = document.getElementById('redSlider');
let greenSlider = document.getElementById('greenSlider');
let blueSlider = document.getElementById('blueSlider');
let brightnessSlider = document.getElementById('brightnessSlider');

redSlider.addEventListener('input', function() {
    for (let i=0; i<lightSwitches.length; i++) {
        if (lightSwitches[i].checked) {
            redValues[i].innerText = redSlider.value;
        }
    }
    
    // Adjust colorDisplay
    colorDisplay.style.backgroundColor = "rgba("+ redSlider.value 
        +", "+ greenSlider.value +", "+ blueSlider.value +","+ brightnessSlider.value/100 + ")";
    
});

greenSlider.addEventListener('input', function() {
    
    for (let i=0; i<lightSwitches.length; i++) {
        if (lightSwitches[i].checked) {
            greenValues[i].innerText = greenSlider.value;
        }
    }    

    colorDisplay.style.backgroundColor = "rgba("+ redSlider.value 
        +", "+ greenSlider.value +", "+ blueSlider.value +","+ brightnessSlider.value/100 + ")";
});

blueSlider.addEventListener('input', function() {
    for (let i=0; i<lightSwitches.length; i++) {
        if (lightSwitches[i].checked) {
            blueValues[i].innerText = blueSlider.value;
        }
    }    

    colorDisplay.style.backgroundColor = "rgba("+ redSlider.value 
        +", "+ greenSlider.value +", "+ blueSlider.value +","+ brightnessSlider.value/100 + ")";
});

brightnessSlider.addEventListener('input', function() {
    for (let i=0; i<lightSwitches.length; i++) {
        if (lightSwitches[i].checked) {
            brightnessValues[i].innerText = brightnessSlider.value + "%";
        }
    }    

    colorDisplay.style.backgroundColor = "rgba("+ redSlider.value 
        +", "+ greenSlider.value +", "+ blueSlider.value +","+ brightnessSlider.value/100 + ")";
});


function saveMode() {

    // Get title and description
    let title = titleField.value;
    let description = descriptionField.value;

    console.log("Saving");
    // update lightObjects
    for (let i=0; i<lightObjects.length; i++) {
        lightObjects[i].R = parseInt(redValues[i].innerText);
        lightObjects[i].G = parseInt(greenValues[i].innerText);
        lightObjects[i].B = parseInt(blueValues[i].innerText);
        lightObjects[i].Brightness = parseInt(brightnessValues[i].innerText); 
    }

    // Post lightobjects to backend    
    savePost({lightObjects, modeID, title, description});

}

const savePost = async (modeData) => {
    const response = await fetch('/database/saveMode', {
    method: 'POST',
    body: JSON.stringify(modeData), // string or object
    headers: {
        'Content-Type': 'application/json'
    }
});
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);
};