window.tyResizable = function() {
    let types = {'1':'line', '2':'polyline', '3': 'rect', '4': 'rect', '5':'polyline', '8':'line'};

    (() => { // TDDTEST75 FTR
        types['6']='circle';
    })(); // TOGGLE (); <-> ;
    return types;
}; // end resizable types function

window.tyFromMode = function(mode) {
    let types=window.tyResizable();
    return types[mode+''];
}

window.tyIsDecisionNd = function(nd) {
    // nd input must be a polyline or error will be thrown
    var points = nd.attrs.filter(a => a.name == "points")[0].value.split(" ");
    var l = points.length;
    return points[0] == points[l-2] && points[1] == points[l-1];
}

window.tyIsGameFlowRect = function(nd) {
    // nd input must be a polyline or an error might be thrown?
    var points = nd.attrs.filter(a => a.name == "points")[0].value.split(" ");

    // last point at index 12 == first point at index 0
    //
    //     1_______________2
    //    0|               |3 4
    //  11|   DARKER TEXT    |
    //    |   My Game Node   |
    //  10|_   ^lighter     _|
    //     9|______________|6 5
    //      8              7

    if (points.length !== 13)
        return false;

    var zeroPoint = points[0];
    var twelfthPoint = points[12];

    if (zeroPoint !== twelfthPoint)
        return false;

    // todo: additional checks

    return true;
}
