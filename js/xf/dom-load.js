window.xf['dom-load-svg'] = function(xml, svg) {
    svg.innerHTML = ''; // while (svg.children.length > 0) svg.children[0].remove();
    svg.innerHTML = xml;
};
