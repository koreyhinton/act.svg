window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 21 - SELECTS USING RECTANGLE
    function test21() {
        onStart({});

        var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        // click to select just outside of it
        window.issueRectSelectClick(actionNd.xmin-1, actionNd.ymin-1);
        window.issueRectSelectClick2(actionNd.xmax+1, actionNd.ymax+1);

        // should have selected 3 nodes (the rectangle and the 2 inner text nds)
        return curIds.length === 3;
    },
    // TDD TEST 22 - RECTANGULAR SELECTION IS VISIBLE
    function test22() {
        onStart({});

        window.issueRectSelectClick(751, 89);

        var selEl = document.getElementById("selMarker");
        
        return window.getComputedStyle(selEl).visibility == 'visible';
    },
    // TDD TEST 23 - RECTANGULAR SELECTION UPDATES WITH MOVE
    function test23() {
        onStart({});

        window.issueRectSelectClick(751, 89);
        window.updateVisibleRectSelection(1000, 100);
        var selEl = document.getElementById("selMarker");
        return parseInt(window.getComputedStyle(selEl).width.replace('px',''))>200;
    },
    // TDD TEST 24 - BG-CLICK CANCELS SELECTION
    function test24() {
        onStart({});

        var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        // click to select just outside of it
        window.issueRectSelectClick(actionNd.xmin-1, actionNd.ymin-1);
        window.issueRectSelectClick2(actionNd.xmax+1, actionNd.ymax+1);

        window.mousedown({clientX:750+10, clientY:88+10});
        window.mouseup({clientX:750+10, clientY:88+10}); // cancels selection
        return curIds.length === 0;
    },
    // TDD TEST 25 - RECTANGULAR SELECTION WORKS IN SWIMLANE
    function test25() {
        onStart({});
        issueKeyNum(4, {}); // rect mode
        issueClick(1, 1);    updateFrames();
        issueClick(749, 749);    updateFrames();  // create bounding rect

        var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        var x1 = 750 + actionNd.xmin-1;
        var y1 = 88 + actionNd.ymin-1;
        var x2 = 750 + actionNd.xmax+1;
        var y2 = 88 + actionNd.ymax+1; // surrounding rect

        issueKeyNum(0, {}); // select mode

        window.mousedown({clientX:x1, clientY:y1});
        window.mousemove({clientX:x2, clientY:y2, view:{event:{preventDefault:function(){}}}});
        window.mouseup({clientX:x2, clientY:y2}); // selects action node
        return window.id2nd(curIds[0].id).xmin>10;//ensures bounding rect isn't selected

        // maybe say any rect that has a dimension >=greater a quadrant
        // 1/4 of 750px is a swimlane
        // return false;
    },
    // TDD TEST 26 - SWIMLANE CLICK SELECTS SWIMLANE
    function test26() {
        onStart({});
        issueKeyNum(4, {}); // rect mode
        issueClick(1, 1);    updateFrames();
        issueClick(749, 749);    updateFrames();  // create bounding rect

        /*var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        var x1 = 750 + actionNd.xmin-1;
        var y1 = 88 + actionNd.ymin-1;
        var x2 = 750 + actionNd.xmax+1;
        var y2 = 88 + actionNd.ymax+1; // surrounding rect
        */
        issueKeyNum(0, {}); // select mode

        window.mousedown({clientX:750+1, clientY:88+1});
        window.mouseup({clientX:750+1, clientY:88+1}); // selects bounding rect
        return curIds.length==1 && window.id2nd(curIds[0].id).xmin<10;//ensures bounding rect is selected
    },
    // TDD TEST 28 - MOVES NODE THAT OVERLAPS OTHER NODES
    function test28() {
        onStart({});

        // there are 3 nodes.
        // * 1 - the default rect node that is already there
        // * 2 - another node that gets placed on top of #1, and will move to #3
        // * 3 - another node that gets placed at 0,0

        issueKeyNum(4, {}); // rect mode

        var dfltNd = svgNodes.filter(n => n.tagName =='rect')[0];
        //console.warn(dfltNd.attrs);
        var dX = parseInt(
            dfltNd.attrs.filter(a=>a.name=='x')[0].value
        ); // default X
        var dY = parseInt(
            dfltNd.attrs.filter(a=>a.name=='y')[0].value
        ); // default Y
        var dW = parseInt(dfltNd.attrs.filter(a=>a.name=='width')[0].value);
        var dH = parseInt(dfltNd.attrs.filter(a=>a.name=='height')[0].value);
        var dX2 = dX + dW;
        var dY2 = dY + dH;
        issueClick(dX,dY);    updateFrames();
        issueClick(dX2,dY2);    updateFrames(); // draws overlapping node

        issueClick(0,0);    updateFrames();
        issueClick(dW,dH);    updateFrames();

        issueKeyNum(0, {}); // select mode

        // first select circle movee
        var circle = document.getElementsByTagName('circle')[0];
        issueClick(/*750+*/circle.attributes['cx'].value, /*88+*/circle.attributes['cy'].value);    updateFrames();
        // next select the overlapped rect being tested
        issueClick(dX, dY);    updateFrames();

        //document.getElementById(curIds[0].id)
        //    .attributes['x'].value;

        //console.warn(curIds[0]);
        /*console.warn(document.getElementById("svgFullTextarea").value
                        .split(`
`).filter(ln=>ln.indexOf('rect1')>-1)[0]);
*/

        var mt = new MoveTester({
            mover: document.getElementById(curIds[1].id),
            movee: circle
        });

        mt.moveBy(-dX,-dY);//go to 0,0

        return mt.test();
        //return document.getElementById("svgFullTextarea").value.split('x="0"').length ==2 && document.getElementById("svgFullTextarea").value.indexOf(`x=${dX}`)>-1;
    }
];
