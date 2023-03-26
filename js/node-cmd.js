window.gCmCacheObj = {id: null, x: 0, y: 0};
window.cmFill = function(nd) { // CT/49
    let text = "";
    let x = window.getX1(nd);
    let y = window.getY1(nd);
    let w = window.getscal(nd.attrs, "width");
    let h = window.getscal(nd.attrs, "height");
    if (gCmCacheObj.id == null) {
        gCmCacheObj.x = window.getX1(nd);
        gCmCacheObj.y = window.getY1(nd);
        gCmCacheObj.id = nd.attrs.filter(a=>a.name == 'id')[0].value;
    }
    let incx = x - gCmCacheObj.x;
    let incy = y - gCmCacheObj.y;
    text += "setx " + x + '\n' + "incx " + incx + '\n';
    text += "sety " + y + '\n' + "incy " + incy + '\n';
    if (w > -999) {
        text += "setw " + w + '\n' + "incw " + 0 + '\n';
    }
    if (h > -999) {
        text += "seth " + h + '\n' + "inch " + 0 + '\n';
    }
    document.getElementById("commandTextarea").value = text;
};

window.onRun = function() { // CT/49

    let nd = window.id2nd(curIds[curIds.length-1].id);
    let commandText = document.getElementById("commandTextarea").value;
    let commands = commandText.split('\n');

    for (var i=0; i<commands.length; i++) {
        var c = commands[i].split(' ');
        if (c.length == 0) continue;
        let c1 = c[0];
        let c2 = c[1];
        if (c1 == 'setx') { // TDDTEST56 FTR
            window.setPos(nd, parseInt(c2),
                parseInt(nd.attrs.filter(a=>a.name=='y')[0].value));
        }
    }
    window.gCmCacheObj.id = null;
    window.onDone();
};
