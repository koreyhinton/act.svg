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
