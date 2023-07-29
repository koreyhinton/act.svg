window.xf['data-load-nodes'] = function(nodesIn, nodes) {
    while (nodes.length > 0) nodes.shift();
    for (var i=0; i<nodesIn.length; i++) {
        nodes.push(nodesIn[i]);
    }
};
