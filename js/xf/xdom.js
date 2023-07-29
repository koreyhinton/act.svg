window.xf.xdom2nd = function(xdomNd, nd) {
    nd = nd || {};
    var push = false;
    if (nd.attrs == null) { nd.attrs = []; push = true;} // var nd = {attrs:[]}
    for (var i=0; i<xdomNd.attributes.length; i++) {
        if (!push) {
            push = true;
            for (var j=0; j<nd.attrs.length; j++) {
                if (nd.attrs[j].name == xdomNd.attributes[i].nodeName) {
                    push = false;
                    nd.attrs[j].value = xdomNd.attributes[i].nodeValue;
                    break;
                }
            }
        }
        if (push) {
            nd.attrs.push({
                name: xdomNd.attributes[i].nodeName,
                value: xdomNd.attributes[i].nodeValue
            });
        }
    }
    nd.tagName = xdomNd.tagName;
    if (nd.tagName == "text") {
        nd.text = xdomNd.innerHTML;
    }
    //nd.cacheColor = cacheColor;
    return nd;
}

window.xf.xdom2nds = function(xdomNds) {
    let nds = [];
    xdomNds.forEach((xdomNd) => {
        let nd = window.xf.xdom2nd(xdomNd);
        nds.push(nd);
    });
    return nds;
};

window.xf.xdomXroot = function(xdomNds) {
    // remove root
    let rootIdx = -1;
    for (var i=0; i<xdomNds.length; i++) {
        if (xdomNds[i].parentElement == null) { rootIdx = i; break; }
    }
    xdomNds = [...xdomNds];
    xdomNds.splice(rootIdx, 1);
    return xdomNds;
};
