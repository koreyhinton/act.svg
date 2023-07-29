window.xf['data-stream-nodes'] = function() {
    return svgNodes;
};

window.xf['data-stream-full-xml'] = function() {
    return window.xf['dom-stream-full-ta']().value;
};
