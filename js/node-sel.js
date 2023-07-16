window.gRectSelectStates = { None: 0/* / Up */, Down: 1, Drag: 2 };
window.gRectSelectState = {
    /*numClicks*/state: window.gRectSelectStates.None,
    firstX: null,
    firstY: null
};

window.selColor = "#C0D6FC";
window.editColor = "#CAFFB5";

// ATTRIBUTE ACCESS FUNCTIONS
window.setcolor = function(nd, color) {
    // console.warn(nd);
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        var textFill = (
            attr.name == "fill" &&
            nd.tagName.toLowerCase() == "text"
        );
        if (textFill || attr.name == "stroke") {
            //attr.value = color;
            nd.attrs[i].value = color;
            break;
        }
    }
}
window.getcolor = function(nd) {
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        var textFill = (
            attr.name == "fill" &&
            nd.tagName.toLowerCase() == "text"
        );
        if (textFill || attr.name == "stroke") {
            return attr.value;
        }
    }
    return "#FF0000";
}

// NODE ID MANAGEMENT

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

window.trackNd = function(nd, curIds) {
    var id = nd.attrs.filter(a => a.name == 'id')?.[0]?.value;
    if (id == null) {
        id = nd.tagName + (window.getMaxNodeId(nd.tagName)+1);
        nd.attrs.push({name: 'id', value: id});
    }
    curIds.push({id: id});
    window.cmFill(nd); // CT/49
}

window.untrackNd = function(nd, curIds) {
    var j=-1;
    for (var i=0; i<curIds.length; i++) {
        var testId = curIds[i].id;
        if (testId === nd.attrs.filter(a=>a.name=='id')[0].value) { j=i; break; }
    }
    if (curIds.length == 1) {
        curIds.shift();
        return;
    }
    if (j>-1) { curIds.splice(j, 1); }
    else { console.warn("unable to untrack"); }
}

// EVENTS - PROGRAMMATIC - ISSUE SELECTION

window.issueSelection = function(nd, curIds, nodeFinder) {
    // Refactored to only handle curIds and NOT node color and the selected node
    // color handling code was moved to the updateFrames function - CT/66
    var id = nd.attrs.filter(a => a.name == 'id')?.[0]?.value;
    let tracked = id != null &&
        curIds.filter((item) => item.id == id).length>0;
    var selType = "select";
    if (tracked // TDDTEST6 FTR
    ) {
        // setcolor(nd, nd.cacheColor);
        selType = "deselect";
        window.untrackNd(nd, curIds);
    }
    else {
        window.trackNd(nd, curIds);
    }
    window.lgLogNode('actsvg - issue selection - '+selType, nd);
    return selType;
}

// ALT-N (NEXT) NODE SELECTION NAVIGATOR

window.NodeSelectionNavigator = class {
    constructor(deselector, frameUpdater, nodeFinder, selectionIssuer, selNdIds) {
        this.deselector = deselector;
        this.frameUpdater = frameUpdater;
        this.nodeFinder = nodeFinder;
        this.selectionIssuer = selectionIssuer;
        this.selNdIds = selNdIds;
    } // end node sel nav constructor
    next() {
        let copy = [...this.selNdIds];
        this.deselector();// saves and closes
        copy.push(copy.splice(this.tinj0 ?? 0, 1)[0]); // shift @0 to @len-1
        copy.forEach((idEl) => {
            this.selectionIssuer(
                this.nodeFinder(idEl.id),
                this.selNdIds,
                this.nodeFinder
            ); // re-select
        }); // end id select
        this.frameUpdater(); // update to show re-selection
    } // end node sel nav next method // CT/65
}; // end node selection navigator class def

// LEGACY (PRE-V0.3) SELECT CODE 

window.mgCanSelect = function() {
    return AppMode.in(['0', 'd']) && window.gRectSelectState.state == window.gRectSelectStates.None;
}

window.mgIsOneClickSelect = function(x, y) {
    var nd = xy2nd(x, y);
    var ndId = nd?.attrs.filter(a => a.name == 'id')[0]?.value;
    if (ndId != null) {
        if (curIds.filter(o => o.id == ndId).length>0) {
            return false; // TDDTEST33 FIX
        }
    }
    return window.gRectSelectState.state == window.gRectSelectStates.Down &&
        nd != null;
}

window.mgIsNoSelectClick = function(x, y) {
    return !window.mgIsOneClickSelect() && window.gRectSelectState.state == window.gRectSelectStates.Down;
}

window.mgCloseSelection = function() {
    window.gRectSelectState.state = window.gRectSelectStates.None;
    window.gRectSelectState.firstX=null;
    window.gRectSelectState.firstY=null;
    window.closeVisibleRectSelection();
}

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - ISSUE
window.issueVisibleRectSelection = function(x, y) { // TDD TEST 22 FTR
    var marker = document.getElementById("selMarker");
    marker.style.visibility = 'visible';
    marker.style.width = '16px';
    marker.style.height = '16px';
    marker.style.left = (/*750*/window.gSvgFrame.getStart().x+x)+'px';
    marker.style.top = (/*88*/window.gSvgFrame.getStart().y+y)+'px';
} /* end issueVisibleRectSelection fn */

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - UPDATE

window.updateVisibleRectSelection = function(x, y) { // TDDTEST23 FTR
    window.gRectSelectState.state = window.gRectSelectStates.Drag;
    var marker = document.getElementById("selMarker");
    var left = Math.min(
                window.gSvgFrame.getStart().x + window.gRectSelectState.firstX,
                window.gSvgFrame.getStart().x + x
               ) + 'px'; // TDDTEST39 FIX
    var top = Math.min(
                window.gSvgFrame.getStart().y + window.gRectSelectState.firstY,
                window.gSvgFrame.getStart().y + y
              ) + 'px'; // TDDTEST39 FIX
    var w = Math.abs((window.gRectSelectState.firstX/*+750*/) - (x));
    var h = Math.abs((window.gRectSelectState.firstY/*+88*/) - (y));
    marker.style.top = top; // TDDTEST39 FIX
    marker.style.left = left; // TDDTEST39 FIX
    marker.style.width = (w)+'px';
    marker.style.height = (h)+'px';
} /* end updateVisibleRectSelection fn */

// EVENTS - PROGRAMMATIC - VISIBLE RECT SELECTION - CLOSE

window.closeVisibleRectSelection = function(x, y) { // TDD TEST 22 FTR
    document.getElementById("selMarker").style.visibility = 'hidden';
    if (window.AppMode.is('d') && curIds.length > 0) {
        new NodeDeleter(svgNodes).delete(curIds);
    } // end delete cond
    let msg = '';
    if (curIds.length > 1) {
        msg += "<strong>Alt-n</strong> to (save and) navigate to the next node (in selection).<br/>";
    } // end > 1 cond
    if (curIds.length >= 1) {
        msg += "<strong>Alt-s</strong> to save (and update display).";
    } // end = 1 cond
    if (msg.length > 0) {
        msg = "Node Selection Editor<br/>"+msg;
        notifyMsg(msg);
    } // end msg len cond
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
        // console.log(lastNd);
    }

    window.gRectSelectState.state = window.gRectSelectStates.None;
    window.gRectSelectState.firstX = null;
    window.gRectSelectState.firstY = null;

    for (var i=0; i<selLst.length; i++) {

        /*svgNodes = [
            selLst[i], // bring to-be-selected node to the front of nodes list
            ...svgNodes.filter(nd => nd != selLst[i])
        ];*/ // TDDTEST50 FIX
        //        /*setTimeout(function(){*/window.issueClick(selLst[i].xmin, selLst[i].ymin);/*},10);*/
        setMouseRects(selLst[i]); // TDDTEST50 FIX // CT/52
        issueSelection(selLst[i], curIds, id2nd); // TDDTEST50 FIX // CT/52
        //console.log('click',selLst[i]);
        window.updateFrames(selLst[i], {isSel:true}); // TDDTEST37 FIX
        window.lgLogNode('actsvg - issued rect click', selLst[i]);
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
