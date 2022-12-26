// MV - GLOBALS
window.gMvState = {moving: false};
// MV - IS MOVE KEY EVENT
window.mvIsMoveKey = function(key) {
    return (key == "Enter" || key.substring(0,5) == "Arrow") &&
        window.getComputedStyle(document.getElementById("svgPartTextarea")).visibility == 'visible';
}
// MV - IS MOVE
window.mvIsMove = function(x,y) {
    if (!window.gMvState.moving && (curIds.length > 0 && xy2nd(x,y)!=null)) {
        var clickedNd = xy2nd(x,y);
        var clickedId = clickedNd.attrs.filter(a => a.name == 'id').length == 0
            ? 'bad0'
            : clickedNd.attrs.filter(a => a.name == 'id')[0].value;

        for (var i=0; i<curIds.length; i++) {
            if (clickedId == id2nd(curIds[i].id).attrs.filter(a => a.name == 'id')[0].value) {
                window.gMvState.moving = true;
                break;
            }
        }
    }
    return window.gMvState.moving;
}
// MV - CLOSE MOVE
window.mvClose = function() {
    window.gMvState.moving = false;
    window.mvIssueMoveKey('Enter');
}
// MV - MOVE
window.mvMove = function(x,y) {
    //TODO: replace with actual node moves
    var moveMark = document.getElementById("moveMarker");
    moveMark.style.visibility = "visible";
    moveMark.style.left=(window.gSvgFrame.getStart().x-10+x)+"px";//why not 750??
    moveMark.style.top=(window.gSvgFrame.getStart().y-88+37+y)+"px"; 
}

// MV - ISSUE MOVE KEY EVENT
window.mvIssueMoveKey = function(key) { // TDDTEST18 FTR
    key = (key.substring(0,5) == "Arrow") ? key.substring(5).toLowerCase() : key.toLowerCase();
    let name = key;
    var moveMark = document.getElementById("moveMarker");
    moveMark.style.visibility = "visible";

    if (name == "enter") {
        curMvX = null;
        curMvY = null;
        moveMark.style.visibility = "hidden";
        onApplyEdits();
        return;
    }

    if (curMvX == null) {
        var nd = id2nd(curIds[curIds.length-1].id);
        curMvX = getscal(nd.attrs, "x");
        curMvY = getscal(nd.attrs, "y");
    }

    var ta = document.getElementById("svgPartTextarea");
    var x = curMvX;
    var y = curMvY;
    if (ta.value.indexOf(` x="`) > -1) {
        if (name == "left" || name == "right") {
            var delta = 1;
            if (name == "left") {
                delta = -1;
            }
            x += delta;
            ta.value = ta.value.replace(/ x="[0-9]+"/g, ` x="${x}"`);
            //addscal(nd, "x", delta);
        }
        if (name == "up" || name == "down") {
            var delta = 1;
            if (name == "up") {
                delta = -1;
            }
            y += delta;
            ta.value = ta.value.replace(/ y="[0-9]+"/g, ` y="${y}"`);
            //addscal(nd, "y", delta);
        }
    }
    curMvX = x;
    curMvY = y;
    moveMark.style.left=(window.gSvgFrame.getStart().x-10/*740*/+x)+"px";//why not 750??
    moveMark.style.top=(window.gSvgFrame.getStart().y-88+37+y)+"px";
}
