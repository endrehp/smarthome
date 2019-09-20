
console.log("smarthome");

let lightSwitches = document.getElementsByClassName('switch');
let redValues = document.getElementsByClassName("R");
let greenValues = document.getElementsByClassName("G");
let blueValues = document.getElementsByClassName("B");
let brightnessValues = document.getElementsByClassName("Brightness");

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
});

greenSlider.addEventListener('input', function() {
    
    for (let i=0; i<lightSwitches.length; i++) {
        if (lightSwitches[i].checked) {
            greenValues[i].innerText = greenSlider.value;
        }
    }    
});

blueSlider.addEventListener('input', function() {
    for (let i=0; i<lightSwitches.length; i++) {
        if (lightSwitches[i].checked) {
            blueValues[i].innerText = blueSlider.value;
        }
    }    
});

brightnessSlider.addEventListener('input', function() {
    for (let i=0; i<lightSwitches.length; i++) {
        if (lightSwitches[i].checked) {
            brightnessValues[i].innerText = brightnessSlider.value;
        }
    }    
});