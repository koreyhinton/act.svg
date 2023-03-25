window.xeEditor = class {
    constructor() {
        this.backgroundId = null;
        this.timeFrame = 5000;
    }
    valid() { // CT/52 // CT/53
        return false;
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
                    // todo: save op.
                    // todo: update frames from XML to Nodes / display
                }
            } // todo: else warn w/ notify msg that it failed to update
        }, this.timeFrame);
    }
};
