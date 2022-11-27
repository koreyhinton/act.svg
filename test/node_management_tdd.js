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
    },
    // TDD TEST 29 - COPY PASTE MULTIPLE NODES
    function test29() {global.NamedNodeMap=window.NamedNodeMap;
        onStart({});

        window.mousedown({clientX:750+1, clientY:88+1});
        window.mouseup({clientX:750+700, clientY:88+700}); // selects everything

        window.mouse.x = 600;
        window.mouse.y = 600; // will paste into quadrant 4

        window.manageKeyDownEvent({key:'c',ctrlKey:true});
        window.issuePaste(()=>{
            var ta=document.getElementById('svgFullTextarea');
            ta.value = ta.value.replace('</svg>', `
    <circle cx="375" cy="39" r="10" fill="black" stroke="black" stroke-width="1"  class='unresolvedmover'/>
    <polyline points="375 52 375 108 365 98 375 108 385 98" stroke="black" fill="transparent" stroke-width="1"  class='unresolvedmovee'/>
    <rect rx="10" ry="10" x="325" y="112" width="100" height="50" stroke="black" fill="transparent" stroke-width="1"  class='unresolvedmovee'/>
    <text x="333" y="134" fill="black" class='unresolvedmovee'>Receive</text>
    <text x="333" y="154" fill="black"  class='unresolvedmovee'>Request</text>
</svg>
`);
        });

        var countQ4 = 0;
        for (var i=0; i<svgNodes.length; i++) {
            if (window.getX1(svgNodes[i])>(750/2) &&
                window.getY1(svgNodes[i])>(750/2)) {
                countQ4 += 1;
            }
        }
        return countQ4 == 5; // copied all 5 default nodes into quadrant 4
    },
    // TDD TEST 30 - DELETE NODE(S) VIA CUT
    function test30() {
        onStart({});

        global.navigator = {clipboard:{writeText: function(t){return '';}}};

        window.mousedown({clientX:750+1, clientY:88+1});
        window.mousemove({view:{event:{preventDefault:()=>{}}},clientX:750+700, clientY:88+700});
        window.mouseup({clientX:750+700, clientY:88+700}); // selects everything
        // console.warn(curIds.length);
        window.manageKeyDownEvent({key:'x',ctrlKey:true});

        return svgNodes.length == 0;
    },
    // TDD TEST 31 - MODE 9 CLICK SHOULD HIGHLIGHT QUESTION MARK
    function test31() {
        onStart({});

        // This bug happened after the change that gives selected nodes
        // id numbers (<.. id="rect1"/>). To fix it 2 things must happen,
        // 1) the selection range needs to apply after a short setTimeout
        //    (this part could not be tested) and
        // 2) the focus and the selection range calculation needs to 
        //     happen after the id="rect1" is applied,
        //     which is what is coded below, and is accomplished by calling the
        //     inner-level functions directly in the same order as happens
        //     when using the real dom's outer functions (mousedown/up).
        window.issueDraw(`<text x="0" y="0" fill="black">?</text>`, 'text');
        issueKeyNum(9, {});
        window.issueClick(0,0);
        svgNodes.filter(nd => nd.attrs.filter(a => a.name == 'x' && a.value =='0').length > 0)[0].attrs.push({name:'id',value:'text10'});    updateFrames();

        var ta = document.getElementById("svgPartTextarea");
        return ta.selectionStart > `<text x="-7" y="3" fill="black" id="text1"`.length && ta.selectionEnd - ta.selectionStart == 1;
    }
];
