// decorate [n]ode [s]election

window.plMin = function(polylineNd) {
    let nd = polylineNd;
    let points = nd.attrs.filter(a => a.name == 'points').value.split(" ").map((p) => parseFloat(p));
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
    let points = nd.attrs.filter(a => a.name == 'points').value.split(" ").map((p) => parseFloat(p));
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

window.xAttr = function(nd) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['x','x1','cx'].indexOf(nd.attrs[i].name) > -1)
            return nd.attrs[i];
    } // end for attr
    return attr;
}; // end x attr func
window.yAttr = function(nd) {
    let attr = null;
    for (var i=0; i<nd.attrs.length; i++) {
        if (['y','y1','cy'].indexOf(nd.attrs[i].name) > -1)
            return nd.attrs[i];
    } // end for attr
    return attr;
}; // end y attr func

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
        //todo: implement calls to decorate functions
        return nodesIn;
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
    nd.attrs.push({name: 'style', value: `border: ${borderWidth}px solid ${borderColor};`});
    return nd;
};

window.nsDecorateOutlineColor = function(nd, color) {
    window.setcolor(nd, color);
    return nd;
};

window.nsDecoratePosition = function(nd, x, y) {
    xAttr(nd).value ??= x+'';
    yAttr(nd).value ??= y+'';
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
    nd.attrs.filter(a => ['r','width'].indexOf(a.name) > -1)
        [0].value ??= w+'';
    nd.attrs.filter(a => ['height'].indexOf(a.name) > -1)
        [0].value ??= y+'';
    nd.attrs.filter(a => ['x2'].indexOf(a.name) > -1)
        [0].value ??= window.getscal(nd.attrs, "x1")+w+'';
    nd.attrs.filter(a => ['y2'].indexOf(a.name) > -1)
        [0].value ??= window.getscal(nd.attrs, "y1")+h+'';

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

