window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 21 - SELECTS USING RECTANGLE
    function test21() {
        onStart({});

        var actionNd = svgNodes.filter(n => n.tagName =='rect')[0];
        // click to select just outside of it
        window.issueRectSelectClick(actionNd.xmin-1, actionNd.ymin-1);
        window.issueRectSelectClick(actionNd.xmax+1, actionNd.ymax+1);

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
    // TDD TEST 24 - RECTANGULAR SELECTION WORKS IN SWIMLANE
    function test24() {
        // maybe say any rect that has a dimension >=greater a quadrant
        // 1/4 of 750px is a swimlane
        return false;
    }
];
