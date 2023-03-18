window.drawing = { id: 'null0', type: 'null', cacheX:-1, cacheY:-1 };

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

window.dwCloseDrawing = function() {
    window.drawing.type = 'null';
    window.drawing.cacheX = -1;
    window.drawing.cacheY = -1;
    window.drawing.id = 'null0';
}

// NODE DRAW

window.dwDraw = function(type) {
    window.drawing.id = type+(window.getMaxNodeId(type)+1);
    window.drawing.type = type;
    window.drawing.cacheX = -1;
    window.drawing.cacheY = -1;
    return window.drawing.id;window.lgLogNode('actsvg - will draw '+type);
}

// NODE DRAW - EVENT - UPDATE

window.dwDrawUpdate = function(x, y) {
   var nd = svgNodes.filter(nd => nd.attrs.filter(a => a.name == 'id' && a.value == window.drawing.id).length > 0)[0];
    let adjPt = gmgNodeSnap.snapXYToEnv(window.drawing.type, x, y);
    x = adjPt.x;
    y = adjPt.y;
    if (window.drawing.type == 'line') {if (nd.attrs.filter(a=>a.name=='x2').length<1) {/*console.warn(nd);*/window.lgLogNode('actsvg - draw upd early return',nd);return;}
        x = gmgNodeSnap.snapNdAttr(x, nd, 'x1');
        y = gmgNodeSnap.snapNdAttr(y, nd, 'y1');
        nd.attrs.filter(a=>a.name=='x2')[0].value = x+''; // TDDTEST35 FIX
        nd.attrs.filter(a=>a.name=='y2')[0].value = y+''; // should be string
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
        
    } else if (window.drawing.type == 'rect') {
        //console.log(x,nd.attrs.filter(a=>a.name=='x')[0].value,nd.attrs);

        if (window.drawing.cacheX == -1) {
            window.drawing.cacheX = x;
            window.drawing.cacheY = y;
        }

        var backwardsX = false;
        var backwardsY = false;
        if (x < window.drawing.cacheX) {
            nd.attrs.filter(a=>a.name=='width')[0].value = (window.drawing.cacheX - x)+''; // TDDTEST36 FIX (should be string)
//Math.abs(x - (nd.attrs.filter(a=>a.name=='x')[0].value+nd.attrs.filter(a=>a.name=='width')[0].value));
            nd.attrs.filter(a=>a.name=='x')[0].value = x+'';// TDDTEST35 FIX
                                                           // (should be string)
            backwardsX = true;
        }
        if (y < window.drawing.cacheY) {
            nd.attrs.filter(a=>a.name=='height')[0].value = (window.drawing.cacheY - y)+''; // TDDTEST36 FIX (should be string)
            nd.attrs.filter(a=>a.name=='y')[0].value = y+'';// TDDTEST35 FIX
                                                         // (should be string)
            backwardsY = true;
        }
        var newX = nd.attrs.filter(a=>a.name=='x')[0].value;//Math.min(x, nd.attrs.filter(a=>a.name=='x')[0].value);
        var newW = //Math.abs(
            (x - nd.attrs.filter(a=>a.name=='x')[0].value)+'';// TDDTEST35 FIX
                                                           // (should be string)
        //);
        var newY = nd.attrs.filter(a=>a.name=='y')[0].value;//Math.min(y, nd.attrs.filter(a=>a.name=='y')[0].value);
        var newH = //Math.abs(
            (y - parseInt(nd.attrs.filter(a=>a.name=='y')[0].value))+''// TDDTEST36 FIX (should be string)
        //);
        if (!backwardsX) {nd.attrs.filter(a=>a.name=='x')[0].value = newX;
            nd.attrs.filter(a=>a.name=='width')[0].value = newW;}
        if (!backwardsY) {
            nd.attrs.filter(a=>a.name=='y')[0].value = newY;
            nd.attrs.filter(a=>a.name=='height')[0].value = newH;
        }

/*        var w = x - parseInt(nd.attrs.filter(a=>a.name=='x')[0].value);
        var h = y - parseInt(nd.attrs.filter(a=>a.name=='y')[0].value);
        if (w < 0) {
            nd.attrs.filter(a=>a.name=='width')[0].value = (parseInt(nd.attrs.filter(a=>a.name=='x')[0].value) - x)+'';// TDDTEST36 FIX (should be string)
            nd.attrs.filter(a=>a.name=='x')[0].value = x+'';// TDDTEST35 FIX
                                                           // (should be string)
            
        } else {
            nd.attrs.filter(a=>a.name=='width')[0].value = w+'';// TDDTEST36 FIX
                                                           // (should be string)
        }
        if (h < 0) {
            nd.attrs.filter(a=>a.name=='height')[0].value = (parseInt(nd.attrs.filter(a=>a.name=='y')[0].value) - y);// TDDTEST36 FIX (should be string)
            nd.attrs.filter(a=>a.name=='y')[0].value = y+'';// TDDTEST35 FIX
                                                           // (should be string)
        } else {
            nd.attrs.filter(a=>a.name=='height')[0].value =h+'';// TDDTEST36 FIX
                                                           // (should be string)
        }
*/
    }
    window.lgLogNodeCache('drawupd', 'actsvg - draw upd', nd);
    window.updateFrames();
}
