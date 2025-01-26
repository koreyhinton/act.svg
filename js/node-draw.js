window.drawing = { id: 'null0', type: 'null', cacheX:-1, cacheY:-1 };
window.gDwVtx = null;

window.dwNewId = function (mode) {
    // dwDraw is the standard way to create a new Id (e.g., initial creation or
    // normal selection of existing shape), however when resizing from a cold
    // state, like you just started resizing without selecting the shape first,
    // then a new Id must be forcefully created to get it to work, hence dwNewId
    var id = null;
    if (Object.keys(window.tyResizable()).map(k => parseInt(k))
            .indexOf(mode)>-1) {
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

        let ndVtx2 = window.gDwVtx;
        let posName = window.atPosName(nd, null);
        let oppPosName = window.atPosName(nd, {x:1,y:1});
        (() => { // TDDTEST57 FIX // CT/50
            // calculate which x/y attribute to update
            posName = window.atPosName(nd, ndVtx2);
        })(); // TOGGLE (); <-> ;
        (() => { // TDDTEST77 FTR // CT/51
            // calculate which x/y attribute to use for snapping/aligntment
            oppPosName = window.atPosName(nd, window.vxInverse(ndVtx2));
        })(); // TOGGLE (); <-> ;

        if (ndVtx2==null) return;

        x = gmgNodeSnap.snapNdAttr(x, nd, oppPosName.x);
        y = gmgNodeSnap.snapNdAttr(y, nd, oppPosName.y);

        let xVal = x;
        let yVal = y;
        (() => { // TDDTEST35 FIX
            // assign x,y vals as strings
            xVal += '';    yVal += '';
        })(); // TOGGLE (); <-> ;
        nd.attrs.filter(a=>a.name==posName.x)[0].value = xVal;
        nd.attrs.filter(a=>a.name==posName.y)[0].value = yVal;
    // NODE DRAW - EVENT - UPDATE - GAME FLOW RECT
    } else if (window.drawing.type == 'polyline' && window.tyIsGameFlowRect(nd)) {
        if (window.gDwVtx == null) window.gDwVtx = window.vxUnitCoord(nd, x, y);
        var ndVtx2 = window.gDwVtx;
        if (ndVtx2==null) return;

        // top-left is at pts[0], bottom-right is at pts[6]
        let pts = nd.attrs.filter(a => a.name == 'points')[0].value.split(" ")
            .map(p => parseFloat(p));
        let rectWidth = (pts[0] > pts[6*2] ? pts[0]-pts[6*2]: pts[6*2]-pts[0]);
        let rectHeight = (pts[0+1] > pts[6*2+1] ? pts[0+1]-pts[6*2+1]: pts[6*2+1]-pts[0+1]);

        // TODO: #1 Handle resize at every corner
        // TODO: #2 Handle both directions (shrink and expand)
        // TODO: #3 Handle crossing the pivot point which inverts the corner, ie:
        // * = cursor pointer position
        //   ____
        //  |____|
        //       *
        //        _|
        //
        //  ..aftercrossing pivot point:
        //  _
        // |
        //  * ____
        //   |____|
        //   
        if (ndVtx2.x == 1 && ndVtx2.y == 1 && (window.drawing.cacheX !== null && window.drawing.cacheX !== -1) && x - window.drawing.cacheX > 0 && (window.drawing.cacheY !== null && window.drawing.cacheY !== -1) && y-window.drawing.cacheY > 0)
        {
            var xDiff = (window.drawing.cacheX !== null && window.drawing.cacheX !== -1)
                ? x - window.drawing.cacheX
                : 0;
            var yDiff = (window.drawing.cacheY !== null && window.drawing.cacheY !== -1)
                ? y - window.drawing.cacheY
                : 0;
            var newPoints = "";
            // Pattern: (repeat 4 times but exit early on last iteration so it is fixed start pt):
            //    Four static positions in a row (2nd+ corners are relatively static not absolute):
            //      2 3  __________ 
            //          |
            //         0 1
            //    Then two dynamic positions:
            //        ______________ 5 6
            //       |

            // s => side
            // p => position (index of points)
            var p = 0;
            for (var s=0; s<4; s++) {
                var sl = pts.slice(p, p+4); // point slice
                //console.log('slice', sl);
                if (s>0) {
                    var indent1 = (s==1) ? {x:0,y:8} : (s==2) ? {x:-8,y:0} : {x:0,y:-8};
                    var indent2 = (s==1) ? {x:8,y:8} : (s==2) ? {x:-8,y:8} : {x:-8,y:-8};
                    sl[0] = pts[p-2]+indent1.x;
                    sl[1] = pts[p-1]+indent1.y;
                    sl[2] = pts[p-2]+indent2.x;
                    sl[3] = pts[p-1]+indent2.y;
                }
                newPoints += (p==0?"" : " ")+sl[0] + " " + sl[1]; // static edge point 1
                newPoints += " "+sl[2] + " " + sl[3];             // static edge point 2
                p += 4;
                if (s == 3) { break; }
                var xd = (s < 2) ? xDiff : 0; //don't change left-edge's x position on bottom-right corner resize
                var yd = (s != 0) ? yDiff : 0; // don't change top-edge's y position on bottom-right corner resize
                newPoints += " "+(pts[p]+xd) + " " + (pts[p+1]+yd);// dynamic edge point
                p += 2;
            }
            newPoints += " "+pts[11*2]+" "+pts[11*2+1];//newPoints += " "+pts[9*2]+" "+pts[9*2+1];
            newPoints += " "+pts[0]+" "+pts[1];
            nd.attrs.find(a => a.name == "points").value = newPoints;
        }
        window.drawing.cacheX = x;
        window.drawing.cacheY = y;
/*
        var pivotX = ndVtx2.x==0?pts[0]+rectWidth:pts[0];
        var pivotY = ndVtx2.y==0?pts[0+1]+rectHeight:pts[0+1];
        if (window.drawing.cacheX == -1) {
            window.drawing.cacheX = pivotX;
            window.drawing.cacheY = pivotY;
        }
        pivotX = window.drawing.cacheX;
        pivotY = window.drawing.cacheY;

        var diffX = Math.abs(x, pivotX);
        var diffY = Math.abs(y, pivotY);
*/

    // NODE DRAW - EVENT - UPDATE - POLYLINE
    } else if (window.drawing.type == 'polyline') {

        var ndVtx2 = window.gDwVtx;
        let pts = nd.attrs.filter(a => a.name == 'points')[0].value.split(" ");
        if (window.drawing.cacheX == -1) {

            // if drawing in the normal direction (1,1 ie: new shape
            // or dragging using arrow point), then cache the non-arrow point.
            // And if drawing in the inverse direction (0,0 resizing using the
            // non-arrow point), then cache the arrow point.
            let cache = window.vx2(
                {x: parseFloat(pts[2]), y: parseFloat(pts[3])},
                {x: parseFloat(pts[0]), y: parseFloat(pts[1])},
                ndVtx2
            ); // cache point

            window.drawing.cacheX = cache.x;
            window.drawing.cacheY = cache.y;

            if (window.tyIsDecisionNd(nd)) {// CT/47
                // todo: reshape decision node           ____
                // /\                                   /    \
                // \/    4-sided shape becomes 6-sided  \____/
            } // end decision node cond
        } // end no cache cond

        if (window.tyIsDecisionNd(nd)) {// CT/48 // CT/47
            // todo: resize (6-sided) decision node
            // if dragged to become minimal size, it reshapes to 4-sided shape
            return;
        }

        var pt1 = {};
        var pt2 = {};

        (() => { // TDDTEST78 FTR // CT/51
            x = gmgNodeSnap.snapX(x, window.drawing.cacheX);
            y = gmgNodeSnap.snapY(y, window.drawing.cacheY);
        })(); // TOGGLE (); <-> ;
        let cachePt = {x: window.drawing.cacheX, y: window.drawing.cacheY};

        //          * pt1
        //           \
        // lnPt1 *----* lnPt2
        //           /
        //          * pt2
        let lnPt1 = window.vx2({x: x, y: y}, cachePt, ndVtx2); // line point 1
        let lnPt2 = window.vx2(cachePt, {x: x, y: y}, ndVtx2); // line point 2

        if (window.drawing.cacheX == x) { // right angled arrow: ^ or |
            // a right-angle should just use +-10 (x and y)      |    |
            // offsets for arrow point pt1, pt2                  |    v
            pt1.x = x-10;
            pt2.x = x+10;
            pt1.y = window.vx2(cachePt.y, y, ndVtx2) +
                ( // pt1.y == pt2.y
                    window.vx2(cachePt.y, y, ndVtx2) >
                    window.vx2(y, cachePt.y, ndVtx2) ? -1 : 1
                )*10;
            pt2.y = pt1.y; // [window.drawing.cacheY,y][ndVtx2.x] +
                           // ([window.drawing.cacheY,y][ndVtx2.x]>
                           // [y,window.drawing.cacheY][ndVtx2.x]?-1:1)*10;
        } else if (window.drawing.cacheY == y) { // right angled arrow: ---> or
                                                 //                         <---
            // a right-angle should just use +-10 (x and y)
            // offsets for arrow point pt1, pt2
            pt1.y = y - 10;
            pt2.y = y + 10;
            pt1.x = window.vx2(cachePt.x, x, ndVtx2) +
                ( // pt1.x == pt2.x
                    window.vx2(cachePt.x, x, ndVtx2) >
                    window.vx2(x, cachePt.x, ndVtx2) ? -1 : 1
                )*10;
            pt2.x = pt1.x;/*window.vx2(cachePt.x, x, ndVtx2) +
                (
                    window.vx2(cachePt.x, x, ndVtx2) >
                    window.vx2(x, cachePt.x, ndVtx2) ? -1 : 1
                )*10;*/
        } else { // non-right angled arrow
            var pt1in = {x:lnPt1.x, y:lnPt1.y};//{x: window.drawing.cacheX,
                                               // y: window.drawing.cacheY};
            var pt2in = {x:lnPt2.x, y:lnPt2.y};//lnPt2; //{x: x, y: y};

            //pt1in = [{x: window.drawing.cacheX, y: window.drawing.cacheY},
            //        {x: x, y: y}][ndVtx2.x];
            //pt2in = [{x: x, y: y}, {x: window.drawing.cacheX,
            //        y: window.drawing.cacheY}][ndVtx2.x];

            //if (pt1in.x == pt2in.x) [pt2in,pt1in][ndVtx2.x].x+=10;
            //if (pt1in.y == pt2in.y) [pt2in,pt1in][ndVtx2.x].y+=10;
            pt1 = window.arrowPoint(pt1in, pt2in, 45, 10, -1);
            pt2 = window.arrowPoint(pt1in, pt2in, 45, 10, 1);

            /*if (isNaN(pt1.x)) pt1.x = x;
            if (isNaN(pt1.y)) pt1.y = y;
            if (isNaN(pt2.x)) pt2.x = x;
            if (isNaN(pt2.y)) pt2.y = y;*/
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

        nd.attrs.filter(a => a.name == 'points')[0].value = `${lnPt1.x} ${lnPt1.y} ${lnPt2.x} ${lnPt2.y} ${pt1.x} ${pt1.y} ${lnPt2.x} ${lnPt2.y} ${pt2.x} ${pt2.y}`;
    // NODE DRAW - EVENT - UPDATE - CIRCLE
    } else if (window.drawing.type == 'circle') {
        // make this one simple (don't change position,
        // and don't care about which vertex),
        // just adjust the r attr
        let dist = (x1,y1,x2,y2) => {
            return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
        };// end dist func
        if (nd==null)return;
        let cx = parseInt(nd.attrs.filter(a => a.name == 'cx')[0].value);
        let cy = parseInt(nd.attrs.filter(a => a.name == 'cy')[0].value);
        let r = Math.ceil(dist(x,y,cx,cy));
        nd.attrs.filter(a => a.name == 'r')[0].value = r+'';
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
