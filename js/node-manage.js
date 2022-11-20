window.gRectSelectState = {
    numClicks: 0,
    firstX: null,
    firstY: null
};

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - ISSUE

window.issueVisibleRectSelection = function(x, y) { // TDD TEST 22 FTR
    var marker = document.getElementById("selMarker");
    marker.style.visibility = 'visible';
    marker.style.width = '16px';
    marker.style.height = '16px';
    marker.style.left = (750+x)+'px';
    marker.style.top = (88+y)+'px';
} /* end issueVisibleRectSelection fn */

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - UPDATE

window.updateVisibleRectSelection = function(x, y) { // TDDTEST23 FTR
    var marker = document.getElementById("selMarker");
    var w = Math.abs((window.gRectSelectState.firstX+750) - (x));
    var h = Math.abs((window.gRectSelectState.firstY+88) - (y));
    marker.style.width = (w)+'px';
    marker.style.height = (h)+'px';
} /* end updateVisibleRectSelection fn */

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - CLOSE

window.closeVisibleRectSelection = function(x, y) { // TDD TEST 22 FTR
    document.getElementById("selMarker").style.visibility = 'hidden';
} /* end closeVisibleRectSelection fn*/


// EVENTS - PROGRAMMATIC - ISSUE RECT SELECT CLICK

window.issueRectSelectClick2 = function(x,y) { // TDDTEST21 FTR

    var firstX = window.gRectSelectState.firstX;
    var firstY = window.gRectSelectState.firstY;

    var x1 = Math.min(firstX, x);
    var y1 = Math.min(firstY, y);

    var x2 = Math.max(firstX, x);
    var y2 = Math.max(firstY, y);

    var l = (curIds.length > 0) ? 0 : svgNodes.length;

    var lastNd = null;

    var selLst = [];

    for (var i=0; i<l; i++) {
        var nd = svgNodes[i];
        setMouseRects(nd);
        var isLastNd = false;
        var inBounds = nd.xmin>x1 && nd.xmax <x2 && nd.ymin>y1 && nd.ymax <y2;
        if (
            inBounds && 
            lastNd==null &&
            (
                nd.attrs.filter(o=>o.name=='x').length > 0 ||
                nd.attrs.filter(o=>o.name=='cx').length > 0
            )
        ) {
            lastNd = nd;
            isLastNd = true;
        }
        if (inBounds) {
            if (!isLastNd) {
                selLst.push(nd);
            }
        }
    } /*end svgNodes loop*/

    if (lastNd != null) {
        selLst.push(lastNd);
        console.log(lastNd);
    }

    for (var i=0; i<selLst.length; i++) {
        window.issueClick(selLst[i].xmin, selLst[i].ymin);
        window.updateFrames();
    } /*end selLst loop*/

    window.gRectSelectState.numClicks = 0;
    window.gRectSelectState.firstX = null;
    window.gRectSelectState.firstY = null;

    window.closeVisibleRectSelection(x,y);

} /*end window.issueRectSelectClick2 fn*/

window.issueRectSelectClick = function(x,y) { // TDDTEST21 FTR
    if (window.gRectSelectState.numClicks == 1) {
        window.issueRectSelectClick2(x, y);
        return;
    }
    window.issueVisibleRectSelection(x, y); // TDD TEST 22 FTR
    window.gRectSelectState.numClicks = 1;
    window.gRectSelectState.firstX = x;
    window.gRectSelectState.firstY = y;
} /*end window.issueRectSelectClick fn*/


