window.gTest = false;

window.gmgNodeSnap = new window.snNodeSnapper();

window.mouse = {x:-1,y:-1};


window.mgCanDrag = function() {
    return window.gRectSelectState.state == window.gRectSelectStates.Down || window.gRectSelectState.state == window.gRectSelectStates.Drag;
}

window.mgIsDragging = function() {
    return window.gRectSelectState.state == window.gRectSelectStates.Drag;
}

window.mgSetMouse = function(x, y) {
    window.mouse.x = x; window.mouse.y = y;
}

window.getMaxNodeId = function(type) {
    var maxId = 0;
    for (var i=0; i<svgNodes.length; i++) {
        var node = svgNodes[i];
        if (node.tagName == type) {
            var idlist = node.attrs.filter(a => a.name == 'id');
            if (idlist.length > 0) {
                maxId = Math.max(
                    parseInt(idlist[0].value.replace(type,'')),
                    maxId
                );
            }
        }
    }
    return maxId;
}

window.id2nd = function(id) { // TDDTEST28 FIX
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

window.getPosId = function(attrs) {
    var posId = '';
    if (attrs instanceof NamedNodeMap) {
        // dom element attributes
        if (attrs["x"] != null){
            posId = attrs["x"].value+','+attrs["y"].value;
        } else if (attrs["cx"]!=null){
            posId = attrs["cx"].value+','+attrs["cy"].value;
        } else if (attrs["x1"]!=null){
            posId = attrs["x1"].value+','+attrs["y1"].value;
        } else {
            posId = attrs["points"].value;
        }
    } else {
        // svg node attrs array
        if (attrs.filter(a=>a.name == 'x').length > 0) {
            posId = attrs.filter(a=>a.name == 'x')[0].value +','+
                attrs.filter(a=>a.name == 'y')[0].value;
        } else if (attrs.filter(a=>a.name == 'cx').length > 0) {
            posId = attrs.filter(a=>a.name == 'cx')[0].value +','+
                attrs.filter(a=>a.name == 'cy')[0].value;
        } else if (attrs.filter(a=>a.name == 'x1').length > 0) {
            posId = attrs.filter(a=>a.name == 'x1')[0].value +','+
                attrs.filter(a=>a.name == 'y1')[0].value;
        }else {
            posId = attrs.filter(a=>a.name == 'points')[0].value;
        }
    }
    return posId;
}

window.getX1 = function(nd) {

    if (nd.attrs.filter(a => a.name == 'points').length > 0) {
        return parseInt(nd.attrs.filter(a => a.name == 'points')[0].value.split(' ')[0]);
    }

    var key = 'x';
    if (nd.attrs.filter(a=>a.name == 'cx').length > 0) { key='cx'; }
    else if (nd.attrs.filter(a=>a.name == 'x1').length > 0) { key='x1'; }
    return getscal(nd.attrs,key);
}

window.getY1 = function(nd) {

    if (nd.attrs.filter(a => a.name == 'points').length > 0) {
        return parseInt(nd.attrs.filter(a => a.name == 'points')[0].value.split(' ')[1]);
    }

    var key = 'y';
    if (nd.attrs.filter(a=>a.name == 'cy').length > 0) { key='cy'; }
    else if (nd.attrs.filter(a=>a.name == 'y1').length > 0) { key='y1'; }
    return getscal(nd.attrs,key);
}

window.setPos = function(nd, x, y) {
    var dummyTargetNd = {attrs:[{name:'x',value:x+''},{name:'y',value:y+''}]};
    var dummySrcNd = {attrs:[
        {name:'x',value:window.getX1(nd)+''},
        {name:'y',value:window.getY1(nd)+''}
    ]};

    var attrs = nd.attrs;
    if (attrs.filter(a=>a.name == 'x').length > 0) {
        addscal(nd, "x", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "y", diffscal(dummySrcNd,dummyTargetNd,"y"));
    } else if (attrs.filter(a=>a.name == 'cx').length > 0) {
        addscal(nd, "cx", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "cy", diffscal(dummySrcNd,dummyTargetNd,"y"));
    } else if (attrs.filter(a=>a.name == 'x1').length > 0) {
        addscal(nd, "x1", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "x2", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscal(nd, "y1", diffscal(dummySrcNd,dummyTargetNd,"y"));
        addscal(nd, "y2", diffscal(dummySrcNd,dummyTargetNd,"y"));
    } else {
        addscalarr(nd, "points", "even", diffscal(dummySrcNd,dummyTargetNd,"x"));
        addscalarr(nd, "points", "odd", diffscal(dummySrcNd,dummyTargetNd,"y"));
    }
}

window.matchNode = function(domElement) {
    var posId = window.getPosId(domElement.attributes);

    for (var i=0; i<svgNodes.length; i++) {
        var nd = svgNodes[i];
        if (
            nd.tagName == domElement.tagName &&
            window.getPosId(nd.attrs) == posId &&
            domElement.attributes['class']?.value==
                nd.attrs.filter(a=>a.name=='class')?.[0]?.value
        ) {
            return nd;
        }
    }
    return null;
}
