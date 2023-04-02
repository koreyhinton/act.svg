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
window.vxUnitCoord = function(nd, x, y) {
    // null value if x,y isn't on a vertex (vtx that can trigger a resize)
    if (nd == null) return null;
    let tn = nd.tagName;
    const th = window.gVxThreshold; // threshold
    setMouseRects(nd);
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
    return null; // unit coords: 0,0  0,1  1,0  1,1
};
