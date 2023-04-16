// A Node Vertex is the draggable vertex where you'd click to resize an element.
// For a rect, it would be related to the literal svg vertex; but for a decision
// node, it would be as if there was an invisible rect surrounding the diamond
// shape and this rect's vertex points are where you would drag from.

// The node vertex is in unit coordinates. Top-Right would be x=1 y=0, bottom-
// right would be x=1 y=1.

// Lines (and polyline w/ arrow) only have 2 options: (0,0) (1,1). it's either
// the edge that started the drawing or the max edge at the end of the drawing
// and for the purpose of calculating which edge is doing the resize we pretend
// the line/polyline last-drawn edge is at position 1,1.
window.vxUnitCoord = function(nd, x, y) {
    // todo: calculate
    // null value if x,y isn't on a vertex (vtx that can trigger a resize)
    return null; // unit coords: 0,0  0,1  1,0  1,1
};

window.vxGet = function(nd, vtx) {
    let x=0; let y=0;
    if (vtx.x == 0) x = window.getX1(nd);
    if (vtx.y == 0) y = window.getY1(nd);
    if (vtx.x == vtx.y && vtx.y == 0) return { x: x, y: y };

    if (vtx.x == 1) {
        switch (nd.tagName) {
            case 'rect':
                x = parseInt(nd.attrs.filter(a => a.name == 'width')[0].value);
                break; // break rect x
            case 'line':
                x = parseInt(nd.attrs.filter(a => a.name == 'x2')[0].value);
                break; // break line x
            case 'polyline':
                let pts = nd.attrs.filter(a => a.name == 'points')[0].value.split(" ").map((val) => parseInt(val));
                x = pts[pts.length-2];
                break; // break polyline x
            case 'circle':
                x = parseInt(nd.attrs.filter(a => a.name == 'r')[0].value);
                break; // break circle x
            case 'text':
                x = null;
                break; // break text x
        } // end tagname switch
    } // end 1,? cond

    if (vtx.y == 1) {
        switch (nd.tagName) {
            case 'rect':
                y = parseInt(nd.attrs.filter(a => a.name == 'height')[0].value);
                break; // break rect y
            case 'line':
                y = parseInt(nd.attrs.filter(a => a.name == 'y2')[0].value);
                break; // break line y
            case 'polyline':
                let pts = nd.attrs.filter(a => a.name == 'points')[0].value.split(" ").map((val) => parseInt(val));
                y = pts[pts.length-1];
                break; // break polyline y
            case 'circle':
                y = parseInt(nd.attrs.filter(a => a.name == 'r')[0].value);
                break; // break circle y
            case 'text':
                y = null;
                break; // break text y
        } // end switch tag name
    } // end ?,1 cond

    return { x: x, y: y };
}; // end vertex get func

window.vxSet = function(nd, x, y, vtx) {
    if (vtx.x == vtx.y && vtx.y == 0) {
        window.setPos(nd, x, y); return;
    } // end 0,0 check
    if (vtx.x == 1) {
        if (nd.attrs.filter(a => a.name == "width").length>0) {
            nd.attrs.filter(a => a.name == "width")[0].value = x+'';
        } // end width attribute exists check
        else if (nd.attrs.filter(a => a.name == "x2").length>0) {
            nd.attrs.filter(a => a.name == "x2")[0].value = x+'';
        } // end x2 attribute exists check
        else if (nd.attrs.filter(a => a.name == "r").length>0) {
            nd.attrs.filter(a => a.name == "r")[0].value = x+'';
        } // end r attribute exists check
    } // end width check
    if (vtx.y == 1) {
        if (nd.attrs.filter(a => a.name == "height").length>0) {
            nd.attrs.filter(a => a.name == "height")[0].value = y+'';
        } // end height attribute exists check
        else if (nd.attrs.filter(a => a.name == "y2").length>0) {
            nd.attrs.filter(a => a.name == "y2")[0].value = y+'';
        } // end y2 attribute exists check
        else if (nd.attrs.filter(a => a.name == "r").length>0) {
            nd.attrs.filter(a => a.name == "r")[0].value = y+'';
        } // end r attribute exists check
    } // end height check

    if (nd.tagName == 'polyline') {
        let vx0 = window.vxGet(nd, {x:0,y:0}); 
        let x1 = vx0.x;
        let y1 = vx0.y;
        var dummyTargetNd = {attrs:[{name:'x',value:x+''},{name:'y',value:y+''}]};
        var dummySrcNd = {attrs:[
            {name:'x',value:/*window.getX1(nd)*/window.vxGet(nd, vtx).x+''},
            {name:'y',value:/*window.getY1(nd)*/window.vxGet(nd, vtx).y+''}
        ]};
        addscalarr(nd, "points", "even", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscalarr(nd, "points", "odd", diffscal(dummySrcNd,dummyTargetNd,"y"));
        if (vtx.x == 1 || vtx.y == 1) {
            // it was intended to stretch not displace
            let pts = nd.attrs.filter(a => a.name == 'points')[0].value.split(" ").map((val) => parseInt(val));
            pts[0] = x1;
            pts[1] = y1;
            nd.attrs.filter(a => a.name == 'points')[0].value = pts.join(" ");
        } // end (1,1) cond
    } // end polyl check
}; // end vertex set func
