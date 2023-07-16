window.AppMode = { mode: '0', subMode: null };
window.AppMode.in = function(types) {
    return types.indexOf(window.AppMode.mode) > -1;
}; // end app mode in function
window.AppMode.is = function(type) {
    return window.AppMode.mode === type;
}; // end app mode is function
window.AppMode.set = function(type, subType = null) {
    window.AppMode.mode = type;
    if (subType != null) window.AppMode.subMode = subType;
    else window.AppMode.subMode = null;
}; // end app mode set function
window.AppMode.name = function() {
    let modes = {
        '0': "Select",
        '1': "Line",
        '2': "Arrow",
        '3': "Rect",
        '4': "Rounded Rect",
        '5': "Decision Node",
        '6': "Initial Node",
        '7': "Final Node",
        '8': "Fork/Join Node",
        '9': "Text"
    };
    if (AppMode.mode == 'a') return "Action Node";
    if (AppMode.mode == 'c') return "Edge Connector";
    if (AppMode.mode == 'd') return "Delete Selector";
    if (AppMode.mode == 'o') return "Object Node";
    if (AppMode.mode == '|') return "Vertical Swimlane Partition";
    if (AppMode.mode == '-') return "Horizontal Swimlane Partition";

    return modes[AppMode.mode];
}; // end app mode name function
