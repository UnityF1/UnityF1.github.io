var scrollValue = 0;

var pageEvents = [
  { //carZOOOM
    preBuffer: 0,
    start: 0,
    stop: -500,
    postBuffer: 40,
    repeatable: true,
    freezePage: true,
    lastmoved: false,
    hasPlayed: false,
    callBack: function(percent){
      var screenWidth = document.body.clientWidth;
      document.getElementById("carZOOOM").style.transform = "translateX(" + (-930+(percent * (screenWidth/2 + 457) )) + "px)";
    }
  }
];

function managePageEvents(){
  var setValue = scrollValue;
  for (var i = 0; i < pageEvents.length; i++) {
    // maybe run event
    if (pageEvents[i].hasPlayed) {
      continue;
    }
    //if passed event then add event displacement
    if (scrollValue <= pageEvents[i].stop - pageEvents[i].postBuffer) {
      setValue += pageEvents[i].preBuffer + pageEvents[i].postBuffer + (pageEvents[i].start - pageEvents[i].stop);
    }
    //freeze if required
    if (pageEvents[i].freezePage && scrollValue <= pageEvents[i].start + pageEvents[i].preBuffer && scrollValue > pageEvents[i].stop - pageEvents[i].postBuffer) {
      setValue = pageEvents[i].start - pageEvents[i].preBuffer;
    }
    //call callback if required
    if (scrollValue <= pageEvents[i].start && scrollValue > pageEvents[i].stop) {
      lastmoved = true;
      pageEvents[i].callBack( (scrollValue - pageEvents[i].start) / (pageEvents[i].stop - pageEvents[i].start) );
    }else {
      if (lastmoved == true) {
        if (!pageEvents[i].repeatable) {
          pageEvents[i].hasPlayed = true;
        }
        if (scrollValue < pageEvents[i].start) {
          pageEvents[i].callBack(1);
        }else {
          pageEvents[i].callBack(0);
        }
        lastmoved = false;
      }
    }
  }
  return setValue
}

var lastMouseWheelInput = 0;
var wheelSmoothing = false;
function getSmoothScroll(v){
  if (Math.abs(Math.abs(v) - Math.abs(lastMouseWheelInput)) > 10 && v == 0) {
    wheelSmoothing = true;
    setTimeout(doSmoothScroll, 100);
  }
}

function doSmoothScroll(){
  console.log(lastMouseWheelInput);
  lastMouseWheelInput -= 2;
  lastMouseWheelInput = lastMouseWheelInput < 0 ? 0 : lastMouseWheelInput;
  scroll(lastMouseWheelInput);
  if (lastMouseWheelInput > 0) {
    setTimeout(doSmoothScroll, 100);
  }
}

function dynamicCSS(){ //.parentElement.clientHeight
  var element = document.getElementById("content-header-meetTheTeam");
  element.style.top = (element.clientHeight / 2) - (element.parentElement.clientHeight / 2) + 20 + "px";
}

// ========= BUTTONS ========

function meetTheTeamShowMore(e){
  if (e.innerText == "Show more") {
    e.innerText = "Show less";
    for (var i = 0; i < document.getElementsByClassName("content-content-flex-child-description").length; i++) {
      document.getElementsByClassName("content-content-flex-child-description")[i].style.display = "block";
    }
  }else {
    e.innerText = "Show more";
    for (var i = 0; i < document.getElementsByClassName("content-content-flex-child-description").length; i++) {
      document.getElementsByClassName("content-content-flex-child-description")[i].style.display = "none";
    }
  }
  dynamicCSS();
}

// ========= EVENTS ========
window.addEventListener("load", function (e) {
  dynamicCSS();
});

window.addEventListener("resize", function(){
  dynamicCSS();
});

document.addEventListener("wheel", function (e) {
  var v = parseInt(e.deltaY);
  getSmoothScroll(e.deltaY);
  scroll(v);
}, true);

function scroll(v){
  scrollValue -= v;
  scrollValue = scrollValue > 0 ? 0 : scrollValue;

  var setValue = managePageEvents();

  document.body.style.transform = "translateY(" + setValue + "px)";
}

window.addEventListener("beforeunload", function(){
  document.body.style.transform = "translateY(0px)";
});
