
console.log("smarthome");

let lightSwitches = document.getElementsByClassName('switch');
let redValues = document.getElementsByClassName("R");
let greenValues = document.getElementsByClassName("G");
let blueValues = document.getElementsByClassName("B");
let brightnessValues = document.getElementsByClassName("Brightness");

let colorDisplay = document.getElementById("colorDisplay");

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
            brightnessValues[i].innerText = brightnessSlider.value/100;
        }
    }    

    colorDisplay.style.backgroundColor = "rgba("+ redSlider.value 
        +", "+ greenSlider.value +", "+ blueSlider.value +","+ brightnessSlider.value/100 + ")";
});


function saveMode() {

    console.log("Saving");
    // update lightObjects
    for (let i=0; i<lightObjects.length; i++) {
        lightObjects[i].R = redValues[i];
        lightObjects[i].G = redValues[i];
        lightObjects[i].B = redValues[i];
        lightObjects[i].Brightness = redValues[i]; 
    }


    // Post lightobjects to backend
    
    savePost(lightObjects);

}

const savePost = async (lightObjects) => {
    const response = await fetch('/saveMode', {
    method: 'POST',
    body: JSON.stringify({a:1}), // string or object
    headers: {
        'Content-Type': 'application/json'
    }
})};