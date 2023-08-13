window.xf['data-stream-nodes'] = function() {
    return svgNodes;
};

window.xf['data-stream-full-xml'] = function() {
    return window.xf['dom-stream-full-ta']().value;
};

window.xf['data-stream-editNd-xml'] = function() {
    return window.xf['dom-stream-part-ta']().value;
};

window.xf['data-stream-edit-id'] = function() {
    return curIds[curIds.length-1].id;
};

window.xf['data-stream-ids'] = function() { return curIds.map((o) => o.id); }

window.xf['data-stream-cacheNd'] = function() {
    return cacheNd;
};

window.xf['data-stream-sub-selected-nodes'] = function() {
    let nodes = [];
    for (var i=0; i<curIds.length-1; i++) { // stop before last id
        nodes.push(window.xf.id2nd(curIds[i].id));
    }
    return nodes;
};
