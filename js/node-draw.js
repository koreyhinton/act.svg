window.drawing = { id: 'null0', type: 'null', cacheX:-1, cacheY:-1 };
window.gDwVtx = null;

window.dwNewId = function (mode) {
    var id = null;
    if ([1,2,3,4,5,8].indexOf(mode)>-1) {
        id = window.dwDraw(window.tyFromMode(mode));
    }
    return id;
}

window.dwIsDrawingClosed = function() {
    return window.drawing.type == 'null';
}

window.dwIsHoveringCorner = function(ndVtx, mode) { // CT/50
    return mode==0 && ndVtx != null;
}; // end hover resize func

window.dwHover = function(vtx) { // CT/50
    if (vtx == null) { document.getElementById("pageDisplayFrame").style.cursor = "default"; return; }
    document.getElementById("pageDisplayFrame").style.cursor = `url("img/${vtx.x}${vtx.y}.svg") ${vtx.x==0?10:-vtx.x*20} ${vtx.y==0?10:-vtx.y*20}, default`;
};

window.dwTriggerResize = function(nd, ndVtx, x, y, mode) { // CT/50
    return (window.gRectSelectState.state == window.gRectSelectStates.Down/* || window.gRectSelectState.state == window.gRectSelectStates.Drag*/) &&
        window.dwIsHoveringCorner(ndVtx, mode);
        // window.dwIsDrawingClosed &&
};

window.dwCloseDrawing = function() {
    window.drawing.type = 'null';
    window.drawing.cacheX = -1;
    window.drawing.cacheY = -1;
    window.drawing.id = 'null0';
}

// NODE DRAW

window.dwDraw = function(type, id) {
    window.drawing.id = (id==null) ? type+(window.getMaxNodeId(type)+1) : id;
    window.drawing.type = type;
    window.drawing.cacheX = -1;
    window.drawing.cacheY = -1;
    return window.drawing.id;window.lgLogNode('actsvg - will draw '+type);
}

// NODE DRAW - EVENT - UPDATE

window.dwDrawUpdate = function(x, y, ndVtx = {x:1,y:1}) {
   var nd = svgNodes.filter(nd => nd.attrs.filter(a => a.name == 'id' && a.value == window.drawing.id).length > 0)[0];
    let adjPt = gmgNodeSnap.snapXYToEnv(window.drawing.type, x, y);
    x = adjPt.x;
    y = adjPt.y;
    // NODE DRAW - EVENT - UPDATE - LINE
    if (window.drawing.type == 'line') {if (nd.attrs.filter(a=>a.name=='x2').length<1) {/*console.warn(nd);*/window.lgLogNode('actsvg - draw upd early return',nd);return;}
        x = gmgNodeSnap.snapNdAttr(x, nd, 'x1');
        y = gmgNodeSnap.snapNdAttr(y, nd, 'y1');
        nd.attrs.filter(a=>a.name=='x2')[0].value = x+''; // TDDTEST35 FIX
        nd.attrs.filter(a=>a.name=='y2')[0].value = y+''; // should be string
    // NODE DRAW - EVENT - UPDATE - POLYLINE
    } else if (window.drawing.type == 'polyline') {

        if (window.drawing.cacheX == -1) {
            window.drawing.cacheX = x;
            window.drawing.cacheY = y;
        }

        if (window.tyIsDecisionNd(nd)) {// CT/47
            // todo: resize decision node
            return;
        }

        var pt1 = {};
        var pt2 = {};

        x = gmgNodeSnap.snapX(x, window.drawing.cacheX);
        y = gmgNodeSnap.snapY(y, window.drawing.cacheY);
        // if (Math.abs(x - window.drawing.cacheX) < 11) { x = window.drawing.cacheX; }
        // if (Math.abs(window.drawing.cacheY - y) < 11) { y = window.drawing.cacheY; }
        if (window.drawing.cacheX == x) {
            pt1.x = x-10;
            pt2.x = x+10;
            pt1.y = y + (y>window.drawing.cacheY?-1:1)*10;
            pt2.y = y + (y>window.drawing.cacheY?-1:1)*10;
        } else if (window.drawing.cacheY == y) {
            pt1.y = y - 10;
            pt2.y = y + 10;
            pt1.x = x + (x>window.drawing.cacheX?-1:1)*10;
            pt2.x = x + (x>window.drawing.cacheX?-1:1)*10;
        } else {
            var pt1in = {x: window.drawing.cacheX, y: window.drawing.cacheY};
            var pt2in = {x: x, y: y};
            pt1 = window.arrowPoint(pt1in, pt2in, 45, 10, -1);
            pt2 = window.arrowPoint(pt1in, pt2in, 45, 10, 1);
        }

        
        /*var vals = nd.attrs.filter(a => a.name == 'points')[0].value.split(' ');
        var str = '';
        str += (window.drawing.cacheX+' ');
        str += (window.drawing.cacheY+' ');
        for (var i=2; i<vals.length; i++) {
            if (i == vals.length-1) {
                str += (vals[i]+'');
            } else {
                str += (vals[i]+' ');
            }
        }*/
        nd.attrs.filter(a => a.name == 'points')[0].value = `${window.drawing.cacheX} ${window.drawing.cacheY} ${x} ${y} ${pt1.x} ${pt1.y} ${x} ${y} ${pt2.x} ${pt2.y}`;
    // NODE DRAW - EVENT - UPDATE - RECT
    } else if (window.drawing.type == 'rect') { // CT/50

        if (window.gDwVtx == null) window.gDwVtx = window.vxUnitCoord(nd, x, y);
        var ndVtx2 = window.gDwVtx;//window.vxUnitCoord(nd, x, y);

        if (ndVtx2==null) return;
        let scal = (name) => // [node attribute] scalar (as int)
            parseInt(nd.attrs.filter(a=>a.name==name)[0].value);
        let set = (name, value) => // [node attribute] set
            nd.attrs.filter(a=>a.name==name)[0].value = value+'';
        let pivX = (pX) => // pivoted X(crossed the X pivot point)
            ndVtx2.x == 1 ? x < pX : x > pX;

        var pivotX = ndVtx2.x==0?scal("x")+scal("width"):scal("x");
        var pivotY = ndVtx2.y==0?scal("y")+scal("height"):scal("y");
        if (window.drawing.cacheX == -1) {
            window.drawing.cacheX = pivotX;
            window.drawing.cacheY = pivotY;
        }
        pivotX = window.drawing.cacheX;
        pivotY = window.drawing.cacheY;

        set('x', Math.min(x, pivotX));
        set('y', Math.min(y, pivotY));

        var w = Math.max(x, pivotX) - scal('x');
        var h = Math.max(y, pivotY) - scal('y');
        set('width', w);
        set('height', h);
    }
    window.lgLogNodeCache('drawupd', 'actsvg - draw upd', nd);
    window.updateFrames();
}
