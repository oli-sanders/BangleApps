/* jshint esversion: 6 */
const timeFontSize = 4;
const tstFontSize = 2;
const dateFontSize = 3;
const dmFontSize = 2;
const gmtFontSize = 2;
const font = "6x8";

const xyCenter = g.getWidth() / 2;
const yposTime = 50;
const yposDate = 85;
const yposTst = 115;
const yposDayMonth = 195;
const yposGMT = 220;

// Check settings for what type our clock should be
var is12Hour = (require("Storage").readJSON("setting.json",1)||{})["12hour"];

function getUTCTime(d) {
  return d.toUTCString().split(' ')[4].split(':').map(function(d){return Number(d)});
}

function drawSimpleClock() {
  // get date
  var d = new Date();
  var da = d.toString().split(" ");
  var dutc = getUTCTime(d);

  g.reset(); // default draw styles
  // drawSting centered
  g.setFontAlign(0, 0);

  // draw time
  var time = da[4].split(":");
  var hours = time[0],
    minutes = time[1],
    seconds = time[2];

  var meridian = "";
  if (is12Hour) {
    hours = parseInt(hours,10);
    meridian = "AM";
    if (hours == 0) {
      hours = 12;
      meridian = "AM";
    } else if (hours >= 12) {
      meridian = "PM";
      if (hours>12) hours -= 12;
    }
    hours = (" "+hours).substr(-2);
  }

  // Time
  g.setFont(font, timeFontSize);
  g.drawString(`${hours}:${minutes}:${seconds}`, xyCenter, yposTime, true);
  g.setFont(font, gmtFontSize);
  g.drawString(meridian, xyCenter + 102, yposTime + 10, true);

  // Date String
  g.setFont(font, dateFontSize);
  g.drawString(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`, xyCenter, yposDate, true);

  // Timestamp
  var tst = Math.round(d.getTime());
  g.setFont(font, tstFontSize);
  g.drawString(`tst:${tst}`, xyCenter, yposTst, true);

  // draw Month name, Day of the week and beats
  var beats = Math.floor((((dutc[0] + 1) % 24) + dutc[1] / 60 + dutc[2] / 3600) * 1000 / 24);
  g.setFont(font, dmFontSize);
  g.drawString(`m:${da[1]} d:${da[0]} @${beats}`, xyCenter, yposDayMonth, true);
  
  // draw gmt
  var gmt = da[5];
  g.setFont(font, gmtFontSize);
  g.drawString(gmt, xyCenter, yposGMT, true);
}

// handle switch display on by pressing BTN1
Bangle.on('lcdPower', function(on) {
  if (on) drawSimpleClock();
});

// clean app screen
g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();

// refesh every 100 milliseconds
setInterval(drawSimpleClock, 100);

// draw now
drawSimpleClock();

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {repeat:false,edge:"falling"});