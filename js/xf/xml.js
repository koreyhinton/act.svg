window.xf.xml2xdomNds = function(xml) {
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(xml, "text/xml");
    var elements = xmlDocument.getElementsByTagName('*');
    return elements;
};
