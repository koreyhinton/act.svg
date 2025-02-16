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
            .map(p => parseInt(p));

        // todo: keep these 2 vars for the pivot adjustments?
        let rectWidth = (pts[0] > pts[6*2] ? pts[0]-pts[6*2]: pts[6*2]-pts[0]);
        let rectHeight = (pts[0+1] > pts[6*2+1] ? pts[0+1]-pts[6*2+1]: pts[6*2+1]-pts[0+1]);

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

        //TODO: use this pivoted var to support pivoting across the pivot corner
        // note: window.drawing.cacheX/Y = the last cursor mousemove x,y pos.
        // var pivoted = x - window.drawing.cacheX < -1 || y-window.drawing.cacheY < -1;

        // NODE DRAW - EVENT - UPDATE - GAME FLOW RECT - DRAWING DECISION BLOCK
        // if the rect is too small to draw (diff==0,0),
        // or the rect drawing action has not fully commenced (no cacheX/Y)
        // then don't change it, until the cursor has either:
        //    1. fully pivoted across the corner
        //    2. or went back the other way
        //    3. (if starting to draw) actually had cursor draw/resize movement

        let cursorPointFromVertex = (cursorX, cursorY, polyLinePoints, vtx,
                drawingCacheX, drawingCacheY) => {
            // 0,0 (x,y) means cursor is right at the vertex point
            //     (literally: the cursor is right there, or symbolically:
            //        pointer is close enough to start a resize operation)
            let indentSize = 8;
            if (drawingCacheX === null || drawingCacheX === -1 ||
                    drawingCacheY === null || drawingCacheY === -1) {
                // can't find the cursor point from the vertex if drawing has
                // just began (and no resize movement has occurred yet)
                return { x: 0, y: 0 };
            }
            let distX = 0; let distY = 0;
            switch (`${vtx.x},${vtx.y}`)
            {
                case "0,0":
                    // top-left corner
                    distX = cursorX - (polyLinePoints[0]-indentSize);
                    distY = cursorY - (polyLinePoints[1]-indentSize);
                    return { x: distX, y: distY };
                case "1,0":
                    // top-right corner
                    distX = cursorX - (polyLinePoints[5]-indentSize);
                    distY = cursorY - (polyLinePoints[6]+indentSize);
                    return { x: distX, y: distY };
                case "1,1":
                    // bottom-right corner
                    distX = cursorX - (polyLinePoints[11]+indentSize);
                    distY = cursorY - (polyLinePoints[12]+indentSize);
                    return { x: distX, y: distY };
                case "0,1":
                    // bottom-left corner
                    distX = cursorX - (polyLinePoints[17]-indentSize);
                    distY = cursorY - (polyLinePoints[18]+indentSize);
                    return { x: distX, y: distY };
                default:
                    return { x: 0, y: 0 };
            }
        };

        let fmtPt = (xyPoint) => {
            return `${xyPoint.x},${xyPoint.y}`;
        };

        let cursorVertexDiff = cursorPointFromVertex(x, y, pts, ndVtx2,
            drawing.cacheX, drawing.cacheY);
        if (fmtPt(cursorVertexDiff) != "0,0") {

/*
    vertex adjustment resolution where vX,vY are vertex X and vertex Y
    of the vertex matching nearest to the resize drag handle
    and its possible vertices are 0,0 (top-left); 1,0; 1,1; and 0,1:
        dynamic x,y corner: vX, vY
        static corner:      (vX + 1) % 2, (vY + 1) % 2
        dynamic x corner:   vX, (vY + 1) % 2
        dynamic y corner:   (vX + 1) % 2, vY


     _ (resize drag handle corner)
    |
       ^        ^
 [XY] <+>-------| [Y]
       v        v
       |        |
       |        |
       |        |
  [X] <->_______| (fixed corner)


 - at-vertex is affected in x and y direction
 - the 2 neighboring-vertices are affected in respective x / y direction

*/

            let vertexIndices = (vXY, xOn, yOn) => {
                let vX = vXY.x;
                let vY = vXY.y;
                if (xOn && yOn) {}
                else if (xOn) {
                    vY = (vY + 1) % 2;
                }
                else if (yOn) {
                    vX = (vX + 1) % 2;
                }
                let newVXY = { x: vX, y: vY };

                switch (fmtPt(newVXY))
                {
                    case "0,0":
                        return [0,1,2,3,22,23,24,25];
                    case "1,0":
                        return [4,5,6,7,8,9];
                    case "1,1":
                        return [10,11,12,13,14,15];
                    case "0,1":
                        return [16,17,18,19,20,21];
                    default:
                        return [];
                }
            };
            let xyAffectedIndices = vertexIndices(ndVtx2, true, true);
            let xAffectedIndices = vertexIndices(ndVtx2, true, false);
            let yAffectedIndices = vertexIndices(ndVtx2, false, true);


            // re-calculate the diffs based on cached drawing point
            var cursorDiffX = x - window.drawing.cacheX;
            var cursorDiffY = y - window.drawing.cacheY;


            var xys = [];
            var xs = [];
            var ys = [];
            for (var a=0; a<xyAffectedIndices.length; a++) {
                var i = xyAffectedIndices[a];
                xys.push(i);

                if (a % 2 == 0)
                    pts[i] = pts[i] + cursorDiffX;
                else
                    pts[i] = pts[i] + cursorDiffY;
            }

            for (var a=0; a<xAffectedIndices.length; a+=2) {
                var i = xAffectedIndices[a];
                xs.push(i);
                pts[i] = pts[i] + cursorDiffX;
            }

            for (var a=1; a<yAffectedIndices.length; a+=2) {
                var i = yAffectedIndices[a];
                ys.push(i);
                pts[i] = pts[i] + cursorDiffY;
            }

            if (!window.once__NodeDrawGameFlowPolyLine) {
                once__NodeDrawGameFlowPolyLine = true;
                console.log('xy', xys.sort((a,b)=> a-b).join(", "));
                console.log('x', xs.sort((a,b)=> a-b).join(", "));
                console.log('y', ys.sort((a,b)=> a-b).join(", "));
            }
            nd.attrs.find(a => a.name == "points").value = pts.join(" ");
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
