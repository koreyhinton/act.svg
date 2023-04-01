window.xeEditor = class {
    constructor() {
        this.backgroundId = null;
        this.timeFrame = 1800;
    }
    valid() { // CT/52 // CT/53
        let xml = document.getElementById("svgFullTextarea").value;

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
                case 'text': {
                    console.warn('found text');
                    let s = tag.attrs.replace(/ /g, '');
                    saxCheck = saxCheck && s.indexOf('x=') > -1
                                        && s.indexOf('y=') > -1
                                        && s.indexOf('fill=') > -1
                                        && !tag.isSelfClosing;
                    break;
                }
                default:
                    break;
            }
        }); // end saxophone tagopen cb
        parser.parse(xml);console.warn('doneParse');

        if (!saxCheck) {
            console.warn("Failed saxCheck");
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
                if (self.backgroundId != null) {
                    svgNodes=[]; window.loadSvg(
                        document.getElementById("svgFullTextarea").value
                    ); // loadSvg call also updates frames
                    // todo: save op.
                }
            } // todo: else warn w/ notify msg that it failed to update
        }, this.timeFrame);
    }
};
