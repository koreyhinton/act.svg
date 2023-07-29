window.atPosName = function(nd, vtx) {
    let posName = null;
    if (nd.tagName == 'line') {
        posName = {x: 'x1', y: 'y1'};
        if (vtx?.x == 1) {
            posName.x = 'x2';
            posName.y = 'y2';
        }// end 1,1 vertex cond
        else {}//end 0,0 vertex cond (default values: x1, y1)
    } // end line type cond
    return posName;
}; // end position attribute name

// ATTRIBUTE ACCESS FUNCTIONS

window.getscal = function(attrs, name) {
    // returns scalar value for attribute name
    for (var i=0; i<attrs.length; i++) {
        if (attrs[i].name == name) {
            return parseFloat(attrs[i].value);
        }
    }
    return -999;
}

window.addscal = function(nd, name, scalar) {
    for (var i=0; i<nd.attrs.length; i++) {
        if (nd.attrs[i].name == name) {
            nd.attrs[i].value = (parseFloat(nd.attrs[i].value)+scalar)+"";
            break;
        }
    }
}

window.getscalarr = function(attrs, name, query) {
    // returns array of scalar value
    for (var i=0; i<attrs.length; i++) {
        if (attrs[i].name == name) {
            var strs = attrs[i].value.split(/[ ,]+/);
            var arr = [];
            var inc = 1; var j = 0;  // "all"
            if (query == "odd") { j+=1; inc=2; }
            if (query == "even") { inc=2; }
            for (; j<strs.length; j+=inc) {
                arr.push(parseFloat(strs[j]));
            }
            return arr;
        }
    }
    return [];
}

window.addscalarr = function(nd, name, query, scalar) {
    for (var i=0; i<nd.attrs.length; i++) {
        if (nd.attrs[i].name == name) {
            var strsRd = nd.attrs[i].value.split(/[ ,]+/);
            var strsWrt = nd.attrs[i].value.split(/[ ,]+/);
            var inc = 1; var j = 0;  // "all"
            if (query == "odd") { j+=1; inc=2; }
            if (query == "even") { inc=2; }
            for (; j<strsRd.length; j+=inc) {
                strsWrt[j] = ''+(parseFloat(strsRd[j]) + scalar);
            }
            nd.attrs[i].value = strsWrt.join(' ');
            break;
        }
    }
}

window.multscalarr = function(nd, name, query, scalar) {
    for (var i=0; i<nd.attrs.length; i++) {
        if (nd.attrs[i].name == name) {
            var strsRd = nd.attrs[i].value.split(/[ ,]+/);
            var strsWrt = nd.attrs[i].value.split(/[ ,]+/);
            var inc = 1; var j = 0;  // "all"
            if (query == "odd") { j+=1; inc=2; }
            if (query == "even") { inc=2; }
            for (; j<strsRd.length; j+=inc) {
                strsWrt[j] = ''+(parseFloat(strsRd[j]) * scalar);
            }
            nd.attrs[i].value = strsWrt.join(' ');
            break;
        }
    }
}
