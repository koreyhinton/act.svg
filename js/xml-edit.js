window.xeEditor = class {
    constructor() {
        this.backgroundId = null;
        this.timeFrame = 1800;
    }
    valid() { // CT/52 // CT/53
        let xml = document.getElementById("svgFullTextarea").value;
        let err = "";

        // VALID - DOM CHECK
        let quickCheck = (((new DOMParser()).parseFromString(xml, 'text/xml')
            ).getElementsByTagName('parsererror')
            ).length == 0;
        if (!quickCheck) {
            console.warn("Failed quickCheck");
            return quickCheck;
        } // end quickCheck

        // VALID - FX CHECK
        if (window.gLibFastXmlValidator == null) {
            console.error("Cannot perform xml validation, requires fast-xml-parser.");
            return true;
        } // end fx nullcheck
        let fxValid = gLibFastXmlValidator;
        if (!fxValid.validate(xml)) {
            console.warn("Failed fxValid");
            return false;
        } // end fxValid

        // VALID - SAX CHECK
        let saxCheck = true;
        if (window.gLibSaxophoneParser == null) {
            console.error("Cannot perform svg validation, requires saxophone.");
            return true;
        } // end gLibSaxophoneParser nullcheck
        let parser = new gLibSaxophoneParser();
        parser.on('tagopen', tag => {

            switch (tag.name) {
                case 'circle': {
                    let s = tag.attrs.replace(/ /g, '');
                    let circleCheck = s.indexOf('cx=') > -1
                        && s.indexOf('cy=') > -1
                        && s.indexOf('r=') > -1
                        && s.indexOf('fill=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && tag.isSelfClosing;
                    if (!circleCheck) err+="<circle> requires: attrs [cx,cy,r,fill,stroke,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= circleCheck;
                    break; // break circle
                } // end case circle
                case 'line': {
                    let s = tag.attrs.replace(/ /g, '');
                    let lineCheck = s.indexOf('x1=') > -1
                        && s.indexOf('y1=') > -1
                        && s.indexOf('x1=') > -1
                        && s.indexOf('y2=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && tag.isSelfClosing;
                    if (!lineCheck) err+="<line> requires: attrs [x1,y1,x2,y2,stroke,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= lineCheck;
                    break; // break line
                } // end case line
                case 'polyline': {
                    let s = tag.attrs.replace(/ /g, '');
                    let plineCheck = s.indexOf('points=') > -1
                        && s.indexOf('fill=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && tag.isSelfClosing;
                    if (!plineCheck) err+="<polyline> requires: attrs [points,stroke,fill,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= plineCheck;
                    break; // break polyline
                } // end case polyline
                case 'rect': {
                    let xyCheck = tag.attrs.split(" ").filter(a => a.startsWith('x') || a.startsWith('y')).length >= 2;
                    let s = tag.attrs.replace(/ /g, '');
                    let rectCheck = s.indexOf('rx=') > -1
                        && s.indexOf('ry=') > -1
                        && s.indexOf('x=') > -1
                        && s.indexOf('y=') > -1
                        && s.indexOf('stroke=') > -1
                        && s.indexOf('stroke-width=') > -1
                        && s.indexOf('width=') > -1
                        && s.indexOf('height=') > -1
                        && s.indexOf('fill=') > -1
                        && tag.isSelfClosing
                        && xyCheck;
                    if (!rectCheck) err+="<rect> requires: attrs [rx,ry,x,y,width,height,stroke,fill,stroke-width] and self-closes (no inner xml text)";
                    saxCheck &&= rectCheck;
                    break; // break rect
                } // end case rect
                case 'text': {
                    let s = tag.attrs.replace(/ /g, '');
                    let textCheck = s.indexOf('x=') > -1
                        && s.indexOf('y=') > -1
                        && s.indexOf('fill=') > -1
                        && !tag.isSelfClosing;
                    if (!textCheck) err+="<text> requires: attrs [x,y,fill] and inner xml text";
                    saxCheck = saxCheck && textCheck;
                    break; // break text
                } // end case text
                default:
                    break; // default break
            } // end switch tag name
        }); // end saxophone tagopen cb
        parser.parse(xml);console.warn('doneParse');

        if (!saxCheck) {
            console.warn("Failed saxCheck");
            window.notifyMsg("Failed validation. " + err, "red"); // CT/53
        } // end saxCheck
        return saxCheck;
    }
    // only updates 1x when called Nx (within timeFrame)
    backgroundUpdate() { // CT/52 // CT/53
        console.log("backgroundUpdate");
        clearTimeout(this.backgroundId);
        this.backgroundId = null;
        let self = this;
        this.backgroundId = setTimeout(function() {
            console.log("validate");
            if (self.valid()) {
                document.querySelector("#pageCodeFrame").style.backgroundColor = "rgb(255,255,240)"; // CT/53
                if (self.backgroundId != null) {
                    svgNodes=[]; window.loadSvg(
                        document.getElementById("svgFullTextarea").value
                    ); // loadSvg call also updates frames
                    // todo: save op.
                }
            } else { // not valid
                document.querySelector("#pageCodeFrame").style.backgroundColor = "rgb(255,240,240)"; // CT/53
            }
        }, this.timeFrame);
    }
};
