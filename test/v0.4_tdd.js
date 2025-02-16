// VERSION 0.4 TESTS
window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 85 - SINGLE CLICK CREATES SMALL RECT
    function test85() {
        //issueClear();
        onStart({});
        issueKeyNum(3, {}); // rect mode
        // issueClick(expectedP1.x+segLen, expectedP1.y);    updateFrames();
        issueClick(400,400);    updateFrames();
        //window.mousedown({clientX:401,clientY:400}); window.updateFrames();
        //window.mouseup({clientX:401,clientY:400}); window.updateFrames();
        return document.getElementById('svgFullTextarea').value.indexOf('x="400" y="400"') > -1;
    }
]
