window.gVxThreshold = 24;
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
window.vxUnitCoord = function(nd, x, y) { // CT/50
    // null value if x,y isn't on a vertex (vtx that can trigger a resize)
    if (nd == null) return null;
    let tn = nd.tagName;
    const th = window.gVxThreshold; // threshold
    setMouseRects(nd);
    let minTh = 6; // minimum threshold
    let dist = (x1,y1,x2,y2) => {
        return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
    };// end dist func
    // console.warn('vtxTest', x, y, nd.xmin, nd.ymin, nd.xmax, nd.ymax, dist(nd.xmin,nd.ymin,x,y), dist(nd.xmax,nd.ymax,x,y));
    if (dist(nd.xmin,nd.ymin,x,y) < minTh && dist(nd.xmax,nd.ymax,x,y) < minTh){
        return null; // e.g., if rect is just barely more than a dot,
                     // you cannot determine the vertex that is closest to the
                     // mouse (x,y) until the mousemove changes x,y more
    } // end min cond
    if (tn == 'rect' || (tn == 'polyline' && window.tyIsDecisionNd(nd))) {
        if (Math.abs(x-nd.xmin) < th && Math.abs(y-nd.ymin) < th) {
            return { x: 0, y: 0 };
        } // end 0,0 cond
        if (Math.abs(x-nd.xmin) < th && Math.abs(y-nd.ymax) < th) {
            return { x: 0, y: 1 };
        } // end 0,1 cond
        if (Math.abs(x-nd.xmax) < th && Math.abs(y-nd.ymin) < th) {
            return { x: 1, y: 0 };
        } // end 1,0 cond
        if (Math.abs(x-nd.xmax) < th && Math.abs(y-nd.ymax) < th) {
            return { x: 1, y: 1 };
        } // end 1,1 cond
    } // end rect-drag nd type cond
    else if (tn == 'line') {
        let lnVtx = null;
        if (Math.abs(x-nd.xmin) < th && Math.abs(y-nd.ymin) < th) {
            lnVtx = { x: 0, y: 0 };
        } // end 0,0 cond
        if (Math.abs(x-nd.xmax) < th && Math.abs(y-nd.ymax) < th) {
            lnVtx = { x: 1, y: 1 };
        } // end 1,1 cond
        if (lnVtx != null) {
            let x1 = parseInt(nd.attrs.filter(a=>a.name=='x1')[0].value);
            let y1 = parseInt(nd.attrs.filter(a=>a.name=='y1')[0].value);
            let x2 = parseInt(nd.attrs.filter(a=>a.name=='x2')[0].value);
            let y2 = parseInt(nd.attrs.filter(a=>a.name=='y2')[0].value);
            let diffMin1/*x1,y1*/ = Math.abs(nd.xmin-x1)+Math.abs(nd.ymin-y1);
            let diffMin2/*x2,y2*/ = Math.abs(nd.xmin-x2)+Math.abs(nd.ymin-y2);
            if (diffMin2 < diffMin1) { // flip
                lnVtx.x = (lnVtx.x+1)%2;
                lnVtx.y = (lnVtx.y+1)%2;
            } // end diff comp
        } // end line vertex cond
        return lnVtx;
    } // end line nd type cond
    return null; // unit coords: 0,0  0,1  1,0  1,1
};
