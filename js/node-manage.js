window.gRectSelectStates = { None: 0/* / Up */, Down: 1, Drag: 2 };
window.gRectSelectState = {
    /*numClicks*/state: window.gRectSelectStates.None,
    firstX: null,
    firstY: null
};

window.gTest = false;

window.getMaxNodeId = function(type) {
    var maxId = 0;
    for (var i=0; i<svgNodes.length; i++) {
        var node = svgNodes[i];
        if (node.tagName == type) {
            var idlist = node.attrs.filter(a => a.name == 'id');
            if (idlist.length > 0) {
                maxId = Math.max(
                    parseInt(idlist[0].value.replace(type,'')),
                    maxId
                );
            }
        }
    }
    return maxId;
}

window.id2nd = function(id) { // TDDTEST28 FIX
    //var type = id.replace(/[0-9]+/g, '');
    //id = parseInt(id.replace(/[a-z]+/g, ''));
    var nd = null;
    for (var i=0; i<svgNodes.length; i++) {
        var svgNd = svgNodes[i];
        if (svgNd.attrs.filter(a => a.name == 'id' && a.value == id).length>0) {
            return svgNd;
        }
    }
    return nd;
}

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
    window.gRectSelectState.state = window.gRectSelectStates.Drag;
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


// EVENTS - PROGRAMMATIC - ISSUE CANCEL RECT SELECT CLICK
window.cancelRectSelectClick = function() {
    window.onDone();
}


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
        var isLastNd = false;//console.log(nd.xmin>x1,nd.xmax <x2,nd.ymin>y1,nd.ymax <y2,nd);
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

    window.gRectSelectState.state = window.gRectSelectStates.None;
    window.gRectSelectState.firstX = null;
    window.gRectSelectState.firstY = null;

    for (var i=0; i<selLst.length; i++) {
        /*setTimeout(function(){*/window.issueClick(selLst[i].xmin, selLst[i].ymin);/*},10);*/
        //console.log('click',selLst[i]);
        window.updateFrames();
    } /*end selLst loop*/

    if (selLst.length == 0) { // TDDTEST24 FIX
        //selected nothing
        //console.warn('selected nothing');
        //setTimeout(function(){window.onDone()},100);window.onDone();
        window.gDispatch(window.onDone, 100);
    }

    window.closeVisibleRectSelection(x,y);

} /*end window.issueRectSelectClick2 fn*/

window.issueRectSelectClick = function(x,y) { // TDDTEST21 FTR
    if (window.gRectSelectState.state == window.gRectSelectStates.Drag) {
        // setTimeout fixes a display issue where last selected node
        // wouldn't be showing as selected. for testing just call
        // issueRectSelectClick2 directly
        //setTimeout(function(){window.issueRectSelectClick2(x, y)},100);
        window.gDispatch(function(){window.issueRectSelectClick2(x, y);}, 100);
        return;
    }
    window.issueVisibleRectSelection(x, y); // TDDTEST22 FTR
    window.gRectSelectState.state = window.gRectSelectStates.Down;
    window.gRectSelectState.firstX = x;
    window.gRectSelectState.firstY = y;
} /*end window.issueRectSelectClick fn*/


