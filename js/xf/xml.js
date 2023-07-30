window.xf.xml2xdomNd = function(xml) {
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(xml, "text/xml");
    var elements = xmlDocument.getElementsByTagName('*');
    return elements[0];
};

window.xf.xml2xdomNds = function(xml) {
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(xml, "text/xml");
    var elements = xmlDocument.getElementsByTagName('*');
    return elements;
};
