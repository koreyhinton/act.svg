window.StartEndFrame = class {
    constructor(startX, startY, endX, endY) {
        this.start = { x: startX, y: startY };
        this.end = { x: endX, y: endY };
    }
    setFrame(startX, startY, endX, endY) {
        this.start.x = startX;
        this.start.y = startY;
        this.end.x = endX;
        this.end.y = endY;
    }
    getStart() {
        return this.start;
    }
    getEnd() {
        return this.end;
    }
}

window.AggregateNode = class {
    constructor({frame, id, top, left}) {
        this.frame = frame;
        this.id = id;
        this.top = top;
        this.left = left;
    }
    getFrame() {
        return this.frame;
    }
    calcFrame() {
        var calcX = 0;
        var calcY = 0;
        var current = this.left;
        var s = this.getFrame().getStart();
        var e = this.getFrame().getEnd();
        var w = e.x - s.x;
        var h = e.y - s.y;
        while (current != null) {
            var start = current.getFrame().getStart();
            var end = current.getFrame().getEnd();
            var xSum = end.x - start.x;
            calcX += xSum;
            current = current.left;
        }
        current = this.top;
        while (current != null) {
            var start = current.getFrame().getStart();
            var end = current.getFrame().getEnd();
            var ySum = end.y - start.y;
            calcY += ySum;
            current = current.top;
        }
        this.frame.setFrame(calcX, calcY, calcX+w, calcY+h);
    }
    applyFrame() {
        console.warn('applyFrame',this.id);
        var el = document.getElementById(this.id);
        var start = this.getFrame().getStart();
        var end = this.getFrame().getEnd();
        el.style.top = (start.y) + 'px';
        el.style.left = (start.x) + 'px';
        el.style.height = (end.y - start.y) + 'px';
        el.style.width = (end.x - start.x) + 'px';
        el.style.overflow = 'hidden'; // otherwise it shows collapsed content
    }
    applyFrames() {
        var current = this;
        while (current != null) {
            current.calcFrame();
            current.applyFrame();
            if (current.left != null) {
                current = current.left;
            } else if (current.top != null) {
                current = current.top;
            } else {
                current = null;
            }
        }
    }
}

//window.gWinOffset = 0;
window.pal = function(name) {
    let url = '?template='+name;
    let target = '_blank';
    let winTitleH = 2;//just a guess of the height, also change in templates.js
    let winScrollH = 21;//just a guess of the height
    let h = (winTitleH + winScrollH + 750);
    let windowFeatures = `height=${h},width=750,left=999,top=0`;//+(0+window.gWinOffset);
    //window.gWinOffset += 100;
    window.open(url, target, windowFeatures);
}
