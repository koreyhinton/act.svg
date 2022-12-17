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
