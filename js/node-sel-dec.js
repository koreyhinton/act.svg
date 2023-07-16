// decorate [n]ode [s]election

window.plMin = function(polylineNd) {
    let nd = polylineNd;
    let points = nd.attrs.filter(a => a.name == 'points')?.[0].value.split(" ").map((p) => parseFloat(p));
    let minX = null;
    let minY = null;
    for (var i=0; i<points.length; i+=2)
        if (minX==null || points[i]<minX) minX=points[i];
    for (var i=1; i<points.length; i+=2)
        if (minY==null || points[i]<minY) minY=points[i];
    return { x: minX, y: minY };
}; // end polyline min function

window.plMax = function(polylineNd) {
    let nd = polylineNd;
    let points = nd.attrs.filter(a => a.name == 'points')?.[0].value.split(" ").map((p) => parseFloat(p));
    let maxX = null;
    let maxY = null;
    for (var i=0; i<points.length; i+=2)
        if (maxX==null || points[i]>maxX) maxX=points[i];
    for (var i=1; i<points.length; i+=2)
        if (maxY==null || points[i]>maxY) maxY=points[i];
    return { x: maxX, y: maxY };
}; // end polyline max function

window.clone = function(srcNd) {
    let nd = {attrs:[]};
    window.forceMap(srcNd, nd);
    return nd;
}; // end clone function

window.xAttr = function(nd, v) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['x','x1','cx'].indexOf(nd.attrs[i].name) > -1) {
            if (v == null) return nd.attrs[i].value;
            nd.attrs[i].value = (nd.attrs[i].name == 'cx') ? (parseInt(v) + window.getscal(nd.attrs, "r"))+'' : v+'';
        } // end x cond
    } // end for attr
    return attr;
}; // end x attr func
window.yAttr = function(nd, v) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['y','y1','cy'].indexOf(nd.attrs[i].name) > -1) {
            if (v == null) return nd.attrs[i].value;
            nd.attrs[i].value = nd.attrs[i].name == 'cy' ? (parseInt(v)*2)+'' : v+'';
        } // end y cond
    } // end for attr
    return attr;
}; // end y attr func
window.wAttr = function(nd, v) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['r','width'].indexOf(nd.attrs[i].name) > -1)
            nd.attrs[i].value = nd.attrs[i].name == 'r' ? (parseInt(v)/2)+'' : v+'';
    } // end for attr
    return attr;
} // end w attr func
window.hAttr = function(nd, v) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['height'].indexOf(nd.attrs[i].name) > -1)
            nd.attrs[i].value = v+'';
    } // end for attr
    return attr;
} // end h attr func
window.x2Attr = function(nd, v) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['x2'].indexOf(nd.attrs[i].name) > -1) {
            if (v == null) return nd.attrs[i].value;
            nd.attrs[i].value = v+'';
        } // end x2 cond
    } // end for attr
} // end x2 attr func
window.y2Attr = function(nd, v) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['y2'].indexOf(nd.attrs[i].name) > -1) {
            if (v == null) return nd.attrs[i].value;
            nd.attrs[i].value = v+'';
        } // end y2 cond
    } // end for attr
} // end y2 attr func

window.NodeDecorator = class {
    decorateDiagram(nodesIn, selIds) {
        let nodesOut = [];
        for (var i=0; i<nodesIn.length; i++) {
            let id = nodesIn[i].attrs.filter(a => a.name == 'id')?.[0]?.value;
            if (this.tinj1 ?? selIds.filter((item) => item.id == id).length == 0) {
                nodesOut.push(nodesIn[i]);
                continue;
            }
            let nd = window.clone(nodesIn[i]);
            if (id == selIds[selIds.length-1].id) {
                window.nsDecorateOutlineColor(nd, window.editColor);
            } else {
                window.nsDecorateOutlineColor(nd, window.selColor);
            }
            nodesOut.push(nd);
        }
        return nodesOut;
    } // end decorate diagram function
    decorateIcon(nodesIn, selIds) {
        let nodesOut = [];
        let dim = 20;
        let x = 10;
        let y = 10;
        let size = window.nsDecorateSize;
        let pos = window.nsDecoratePosition;
        let bord = window.nsDecorateBorder;
        let clone = window.clone;
        if (selIds.length == 0) return [];
        let lastNd = nodesIn.filter(nd=> nd.attrs.filter(a=>a.name=='id' && a.value == selIds[selIds.length-1].id).length > 0)?.[0]; //nodesIn[nodesIn.length-1];
        let editNode = bord(pos(size(clone(lastNd),dim,dim),x,y),'black',1);
        x += dim*2;
        nodesOut.push(editNode);
        let idArr = selIds.map((item) => item.id);
        selIds.forEach((id, i) => {
            if (i == selIds.length-1) {return;}
            let node = nodesIn.filter(nd => nd.attrs.filter(a => a.name == 'id' && a.value == id.id).length > 0)?.[0];
            /*if (node.attrs.filter(a => a.name == 'id').length == 0 ||
                node.attrs.filter(a => a.name == 'id' && idArr.indexOf(a.value) > -1).length == 0) return;*/
            nodesOut.push(pos(size(clone(node),dim,dim),x,y));
            x += dim*2;
        });
        return nodesOut;
    } // end decorate icon function
}; // end node decorator class def

// DECORATOR PATTERN
// CT/66
// -- usage example (within updateFrames process)
// for (var i=0; i<selectedNodes.length; i++) {
//     let selNode = selectedNodes[i];
//     let subselectedIconNode = nsDecoratePosition(
//         nsDecorateSize(
//             clone(selNode), 20, 20
//         ), 0, 0 
//     );
//     if (i == selectedNodes.length-1) {
//         updateIcon( nsDecorateBorder(subselectedIconNode, 'black', 1) );
//         updateSelNode(nsDecorateOutlineColor(clone(selNode), editColor));
//     }
//     else {
//         updateIcon(subselectedIconNode);
//         updateSelNode(nsDecorateOutlineColor(clone(selNode), selColor));
//     }

window.nsDecorateBorder = function(nd, borderColor, borderWidth) {
    nd.attrs.push({name: 'style', value: `outline: ${borderWidth}px solid ${borderColor};`});
    return nd;
};

window.nsDecorateOutlineColor = function(nd, color) {
    window.setcolor(nd, color);
    return nd;
};

window.nsDecoratePosition = function(nd, x, y) {
    let oldX = parseInt(xAttr(nd));
    let oldY = parseInt(yAttr(nd));
    let oldX2 = parseInt(x2Attr(nd));
    let oldY2 = parseInt(y2Attr(nd));
    xAttr(nd, x+'');
    yAttr(nd, y+'');
    x2Attr(nd, (x+(oldX2-oldX))+'');
    y2Attr(nd, (y+(oldY2-oldY))+'');
    if (nd.tagName == 'text') {
        yAttr(nd, (y+15)+'');
    } // end text cond
    if (nd.tagName == 'polyline') {
        let dx = 0;
        let dy = 0;
        let min = window.plMin(nd);
        dx = x - min.x;
        dy = y - min.y;
        window.addscalarr(nd, "points", "even", dx);
        window.addscalarr(nd, "points", "odd", dy);
    } // end polyline cond
    return nd;
};

window.nsDecorateSize = function(nd, w, h) {
    window.wAttr(nd, w+'');
    window.hAttr(nd, h+'');
    window.x2Attr(nd, (window.getscal(nd.attrs, "x1")+w)+'');
    window.y2Attr(nd, (window.getscal(nd.attrs, "y1")+h)+'');
    if (nd.tagName == 'rect' && (w<50||h<50)) {
        nd.attrs.forEach((a) => {
            if ((a.name == 'rx' || a.name == 'ry') && parseInt(a.value)>8) {
                a.value = '6';
            }
        });
    } // end rect cond
    if (nd.tagName == 'text') {
        nd.text = nd.text.substring(0, parseInt(w/9.7)+1);
        while (nd.text.replaceAll("&nbsp;", " ").length < parseInt(w/9.7)+1) {
            nd.text += "&nbsp;";
        } // end while text len
    } // end text cond
    if (nd.tagName == 'polyline') {
        let fx = 1; // x factor
        let fy = 1; // y factor

        let max = window.plMax(nd);
        let min = window.plMin(nd);
        if ((max.x - min.x) == 0) max.x+=1;
        if ((max.y - min.y) == 0) max.y+=1;
        // w = fx(max.x - min.x);
        fx = w / (max.x - min.x);
        fy = h / (max.y - min.y);

        window.multscalarr(nd, "points", "even", fx);
        window.multscalarr(nd, "points", "odd", fy);
    } // end polyline cond
    return nd;
};

