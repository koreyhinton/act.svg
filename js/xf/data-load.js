window.xf['data-load-nodes'] = function(nodesIn, nodes) {
    while (nodes.length > 0) nodes.shift();
    for (var i=0; i<nodesIn.length; i++) {
        nodes.push(nodesIn[i]);
    }
};

window.xf['data-load-node'] = function(nodeIn, node) {
    /*
        cacheNd = {attrs:[]}  // TDDTEST17 FIX
        forceMap(nd,cacheNd);  // TDDTEST17 FIX
    */
    Object.keys(node).forEach(key => delete node[key]);
    node.attrs = [];
    forceMap(nodeIn, node);
};

window.xf['data-load-map-nodes'] = function(nodeIn, nodes) {
    let nd = nodeIn;
    nodes.forEach((passiveSelNd) => {
        smartMap(nd, passiveSelNd);
        setMouseRects(passiveSelNd);
    });
};
