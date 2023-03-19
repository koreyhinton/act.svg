window.cmFill = function(nd) { // CT/49
    let text = "";
    let x = window.getX1(nd);
    let y = window.getY1(nd);
    let w = window.getscal(nd.attrs, "width");
    let h = window.getscal(nd.attrs, "height");
    text += "setx " + x + '\n' + "incx " + 0 + '\n';
    text += "sety " + y + '\n' + "incy " + 0 + '\n';
    if (w > -999) {
        text += "setw " + w + '\n' + "incw " + 0 + '\n';
    }
    if (h > -999) {
        text += "seth " + h + '\n' + "inch " + 0 + '\n';
    }
    document.getElementById("commandTextarea").value = text;
};

window.onRun = function() { // CT/49
    let commandText = document.getElementById("commandTextarea").value;
    console.log(commandText);
    window.onDone();
};
