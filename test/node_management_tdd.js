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
        return curIds[0].x>10;//ensures bounding rect isn't selected

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
        return curIds.length==1 && curIds[0].x<10;//ensures bounding rect is selected
    }
];
