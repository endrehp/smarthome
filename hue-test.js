var Hue = require('philips-hue');
//var hue = new Hue();

/*
hue.getBridges()
  .then(function(bridges){
    console.log(bridges);
    var bridge = bridges[0]; // use 1st bridge
    console.log("bridge: "+bridge);
    return hue.auth(bridge);
  })
  .then(function(username){
    console.log("username: "+username);
 
    // controll Hue lights
    hue.light(1).on();
    hue.light(2).off();
    hue.light(3).setState({hue: 50000, sat: 200, bri: 90});
  })
  .catch(function(err){
    console.error(err.stack || err);
  });
*/

var hue = new Hue;
hue.bridge = "192.168.0.23";  // from hue.getBridges
hue.username = "nF0hElD3YBelZfqsbpfWouMZryQraKnNKFFjjvoG"; // from hue.auth
hue.light(1).off();
hue.light(2).off();
hue.light(3).off();
hue.light(4).off();
hue.light(5).off();
hue.light(6).off();