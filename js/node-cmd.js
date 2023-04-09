window.gCmCacheObj = {id: null, x: 0, y: 0};
window.cmParser = class {
    constructor(cmdStrProvider, cbReceiver) {
        this.cmdStrProvider = cmdStrProvider;
        this.cbReceiver = cbReceiver;
    } // end constructor
    parseArgs() {
        let commandText = this.cmdStrProvider();
        let commands = commandText
            .replace(/;/g,'\n') // convert ; delimiter to be \n
            .replace(/^\s+/gm,'') // remove leading space on each line
            .split('\n');
        for (var i=0; i<commands.length; i++) {
            var c = commands[i].split(' ');
            if (c.length == 0) continue;
            let c1 = c[0];
            let c2 = c[1];
            let args = {};
            switch (c1) {
                case 'setx':
                    args.x = parseInt(c2);
                    break; // break setx
                default:
                    break; // break default
            } // end c1 switch
            this.cbReceiver(c1, args);
        } // end for cmd
    } // end parse arg func
}; // end comamnd parser class
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
    let parser = new window.cmParser(
        () => /*command text=*/
            document.getElementById("commandTextarea").value,
        (cmd,args) => {
            switch (cmd) {
                case 'setx': // TDDTEST56 FTR
                    window.setPos(nd, args.x,
                        parseInt(nd.attrs.filter(a=>a.name=='y')[0].value));
                    break; // break setx
                default:
                    break; // break default
            } // end cmd switch
        } // end callback arg
    ); // end init parser
    parser.parseArgs();

    window.gCmCacheObj.id = null;
    window.onDone();
};
