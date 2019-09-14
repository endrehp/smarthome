
// Simple GET request
const apiCall = async (url) => {
    console.log(url);
    const response = await fetch(url);
    //const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
    console.log(response);
  }

  // POST request
  const userAction = async () => {
    const response = await fetch('http://example.com/movies.json', {
      method: 'POST',
      body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
  }

function setSliderColor() {

    var red = redSlider.value;
    var green = greenSlider.value;
    var blue = blueSlider.value; 
    var hueVal = hueSlider.value;
    
    var url = "/colorChange" + "?red="+red + "&green="+green + "&blue="+blue+ "&hue=" + hueVal;
    apiCall(url);
}



function sliderChange() {
    console.log(hueSlider.value);
    setColor();
}

var redSlider = document.getElementById("redSlider");
var redOutput = document.getElementById("redValue");
redOutput.innerHTML = redSlider.value;
redSlider.oninput = function() {
redOutput.innerHTML = this.value;
}

var blueSlider = document.getElementById("blueSlider");
var blueOutput = document.getElementById("blueValue");
blueOutput.innerHTML = blueSlider.value;
blueSlider.oninput = function() {
blueOutput.innerHTML = this.value;
}

var greenSlider = document.getElementById("greenSlider");
var greenOutput = document.getElementById("greenValue");
greenOutput.innerHTML = greenSlider.value;
greenSlider.oninput = function() {
greenOutput.innerHTML = this.value;
}

var hueSlider = document.getElementById('hueSlider');
hueSlider.addEventListener('input', sliderChange);
