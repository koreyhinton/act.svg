// NODE ID MANAGEMENT
window.xf.id2nd = function(id) { // TDDTEST28 FIX
    //var type = id.replace(/[0-9]+/g, '');
    //id = parseInt(id.replace(/[a-z]+/g, ''));
    var nd = null;
    for (var i=0; i<svgNodes.length; i++) {
        var svgNd = svgNodes[i];
        if (svgNd.attrs.filter(a => a.name == 'id' && a.value == id).length>0) {
            return svgNd;
        }
    }
    return nd;
}

// SET CLICK RECTANGLE FUNCTION
window.xf.ndSetMouseRects = function(nd) {

    // reset vals: // TDDTEST17 FIX
        nd.xmin = null;  // TDDTEST17 FIX
        nd.xmax = null;  // TDDTEST17 FIX
        nd.ymin = null;  // TDDTEST17 FIX
        nd.ymax = null;  // TDDTEST17 FIX

    if (nd.tagName.toLowerCase() == "circle") {
        var cx = getscal(nd.attrs, "cx");
        var cy = getscal(nd.attrs, "cy");
        var r = getscal(nd.attrs, "r");
        var strokeWidth = getscal(nd.attrs, "stroke-width");
        nd.xmin = cx - r - strokeWidth;
        nd.xmax = cx + r + strokeWidth;
        nd.ymin = cy - r - strokeWidth;
        nd.ymax = cy + r + strokeWidth;
    }
    if (nd.tagName.toLowerCase() == "polyline") {
        var xs = getscalarr(nd.attrs, "points", "even");
        var ys = getscalarr(nd.attrs, "points", "odd");
        for (var i=0; i<xs.length; i++) {
            var val = xs[i];
            if (nd.xmin == null) { nd.xmin = val; }
            else if (nd.xmin > val) { nd.xmin = val; }
            if (nd.xmax == null) { nd.xmax = val; }
            else if (nd.xmax < val) { nd.xmax = val; }
        }
        for (var i=0; i<ys.length; i++) {
            var val = ys[i];
            if (nd.ymin == null) { nd.ymin = val; }
            else if (nd.ymin > val) { nd.ymin = val; }
            if (nd.ymax == null) { nd.ymax = val; }
            else if (nd.ymax < val) { nd.ymax = val; }
        }
    }
    if (nd.tagName.toLowerCase() == "rect") {
        var x = getscal(nd.attrs, "x");
        var y = getscal(nd.attrs, "y");
        var width = getscal(nd.attrs, "width");
        var height = getscal(nd.attrs, "height");
        var strokeWidth = getscal(nd.attrs, "stroke-width");
        nd.xmin = x - strokeWidth;
        nd.xmax = x + width + strokeWidth;
        nd.ymin = y - strokeWidth;
        nd.ymax = y + height + strokeWidth;
    }
    if (nd.tagName.toLowerCase() == "text") {
        var f = window.StartEndFrame.FromText(nd);//frame
        nd.xmin = f.getStart().x;
        nd.xmax = f.getEnd().x;
        nd.ymin = f.getStart().y;
        nd.ymax = f.getEnd().y;
    }
    if (nd.tagName.toLowerCase() == "line") { // TDDTEST3 FTR
        var x1 = getscal(nd.attrs, "x1");
        var y1 = getscal(nd.attrs, "y1");
        var x2 = getscal(nd.attrs, "x2");
        var y2 = getscal(nd.attrs, "y2");
        nd.xmin = Math.min(x1, x2) - 1; // TDDTEST32 FIX (add Math.max/min now
        nd.xmax = Math.max(x1, x2) + 1; // that drawing backwards is supported)
        nd.ymin = Math.min(y1, y2) - 1;
        nd.ymax = Math.max(y1, y2) + 1;
    }
    return nd;
}

window.xf.ndsSetMouseRects = function(nds) {
    nds.forEach((nd) => {window.xf.ndSetMouseRects(nd);});
    return nds;
};

window.xf.nds2xml = function(nds, frameSize) {
    var xml = nd2xml(svgBaseNode);
    xml = xml.substring(0, xml.length -2);
    xml += ">"+`
`;
    if (frameSize != null) {
        xml = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${frameSize.w}" height="${frameSize.h}" viewBox="0,0,${frameSize.w},${frameSize.h}">
`;
    } // end frameSize cond
    for (var i=0; i<nds.length; i++) {
        xml += "    "+nd2xml(nds[i])+`
`;
    }
    xml += "</svg>";
    return xml;
}

window.xf.nd2xml = function(nd, colorOverride) {
    var xml = "<" + nd.tagName;
    for (var i=0; i<nd.attrs.length; i++) {
        var attr = nd.attrs[i];
        xml += (" "+ attr.name + "=" + `"` + attr.value + `"`);
    }
    if (nd.tagName.toLowerCase() == "text") {
        xml += (">" + nd.text + "</text>");
    } else {
        xml += "/>";
    }
    // window.lgLogNode('actsvg - nd2xml - colorOverride='+(colorOverride), nd);
    return xml;
}
