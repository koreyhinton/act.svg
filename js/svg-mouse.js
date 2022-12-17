window.SvgMouse = class {

    constructor(svgX, svgY) {
        this.svgX = svgX; // 750
        this.svgY = svgY; // 88
    }

    getX(clientX) {
        return clientX - this.svgX + this.scrollX();
    }

    getY(clientY) {
        return clientY - this.svgY + this.scrollY();
    }

    scrollX() {
        console.warn('scrollLeft',window.pageXOffset);
        return window.pageXOffset;
    }

    scrollY() {
        console.warn('scrollTop',window.pageYOffset);
        return window.pageYOffset;
    }
}
