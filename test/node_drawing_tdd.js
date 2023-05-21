window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 56 - DRAG RECT @ VERTICES RESIZES
    function test56() {
        issueClear();
        issueKeyNum(3, {}); // rect mode
        issueDrag(300,300,    400,400); // create rect => 300,300,    400,400
        issueKeyNum(0, {}); // sel mode

        // 1,1 vertex drag
        issueDrag(400,400,    600,600); // => 300,300,    600,600
        let cond11 = [...document.getElementsByTagName("rect")]
            .filter(el => parseInt(el.getAttribute("width"))>200 &&
                parseInt(el.getAttribute("height"))>200)
            .length == 1;

        // 1,0 vertex drag
        issueDrag(600,300,    400,400); // => 300,400,    400,600
        let cond10 = [...document.getElementsByTagName("rect")]
            .filter(el => parseInt(el.getAttribute("width"))==100 &&
                parseInt(el.getAttribute("height"))==200)
            .length == 1;

        // 0,1 vertex drag
        issueDrag(300,600,    200,500); // => 200,400,    400,500
        let cond01 = [...document.getElementsByTagName("rect")]
            .filter(el => parseInt(el.getAttribute("width"))==200 &&
                parseInt(el.getAttribute("height"))==100)
            .length == 1;

        // 0,0 vertex drag
        issueDrag(200,400,    100,300); // => 100,300,    400,500
        let cond00 = [...document.getElementsByTagName("rect")]
            .filter(el => parseInt(el.getAttribute("width"))==300 &&
                parseInt(el.getAttribute("height"))==200)
            .length == 1;

        return cond11 && cond10 && cond01 && cond00;
    }, // end test 56
    // TDD TEST 57 - DRAG LINE @ VERTICES RESIZES
    function test57() {
        issueClear();
        issueKeyNum(1, {}); // line mode
        issueDrag(20,20,    60,20); // create horiz. line
        //issueDrag(60,20,    20,20); // create horiz. line
        issueKeyNum(0, {}); // sel mode

        // 1,1 vertex drag
        issueDrag(60,20,    80,20); // => 20,20,    80,20
        let cond11 = [...document.getElementsByTagName("line")]
            .filter(el => parseInt(el.getAttribute("x2"))==80 &&
                parseInt(el.getAttribute("y2"))==20)
            .length == 1;

        // 0,0 vertex drag
        issueDrag(20,20,    10,20); // => 10,20,    80,20
        let cond00 = [...document.getElementsByTagName("line")]
            .filter(el => parseInt(el.getAttribute("x1"))==10 &&
                parseInt(el.getAttribute("y1"))==20)
            .length == 1;

        return cond11 && cond00;
    }, // end test 57
    // TDD TEST 58 - DRAG ARROW @ VERTICES RESIZES
    function test58() {
        issueClear();
        issueKeyNum(2, {}); // arrow mode
        issueDrag(20,20,    60,20); // create horiz. arrow
        issueKeyNum(0, {}); // sel mode

        // 1,1 vertex drag
        issueDrag(60,20,    80,20); // => 20,20,    80,20
        let cond11 = [...document.getElementsByTagName("polyline")]
            .filter(el => el.getAttribute("points").indexOf("80 20")>-1)
            .length == 1;

        // 0,0 vertex drag
        issueDrag(20,20,    10,20); // => 10,20,    80,20
        let cond00 = [...document.getElementsByTagName("polyline")]
            .filter(el => el.getAttribute("points").indexOf("10 20")>-1)
            .length == 1;

        return cond11 && cond00;
    }, // end test 58
    // TDD TEST 73 - DRAG ON NON-ID RECT VERTEX RESIZES
    function test73() {

        onStart({}); // don't issue clear because we are testing the case of the
                     // default provided <rect> node which does not have an id
                     // attribute yet.

        let rect = document.getElementsByTagName("rect")[0];
        let x0 =parseInt(rect.getAttribute("x"));
        let y0 = parseInt(rect.getAttribute("y"))
        let startW = parseInt(rect.getAttribute("width"));
        let startH = parseInt(rect.getAttribute("height"));
        issueDrag(x0,y0, 5, 5);
        let endW = parseInt(
            document.getElementsByTagName("rect")[0].getAttribute("width")
        ); // end width
        let endH = parseInt(
            document.getElementsByTagName("rect")[0].getAttribute("height")
        ); // end height

        // dragging to the top left corner (5,5) should have greatly increased
        // the width and height (more than doubling it) of the rect.
        return endW > (startW*2) && endH > (startH*2);
    }, // end test 73
    // TDD TEST 74 - MOVE-DRAG OVER ANOTHER ELEMENT'S VERTEX DOES NOT RESIZE
    function test74() {
        onStart({});

        let text = document.getElementsByTagName("text")[0];
        let x = parseInt(text.getAttribute("x"));
        let y = parseInt(text.getAttribute("y"));

        let rect = document.getElementsByTagName("rect")[0];
        let rectW = parseInt(rect.getAttribute("width"));
        let rectH = parseInt(rect.getAttribute("height"));
        let rectCX = parseInt(rect.getAttribute("x")) + rectW; // rect corner X
        let rectCY = parseInt(rect.getAttribute("y")) + rectH; // rect corner Y

        window.issueDragOver(x,y,  rectCX,rectCY,  rectCX+50,rectCY+50);

        //console.warn(x,y, document.getElementsByTagName("text")[0].getAttribute("x"),document.getElementsByTagName("text")[0].getAttribute("y"));
        //console.warn(rectW, rectH, document.getElementsByTagName("rect")[0].getAttribute("width"), document.getElementsByTagName("rect")[0].getAttribute("height"));
        // should have moved the text towards bottom-right, passing over the
        // bottom-right corner of the rect without resizing the rect
        return (
          document.getElementsByTagName("rect")[0].getAttribute("width")==rectW
        ) && (
          document.getElementsByTagName("rect")[0].getAttribute("height")==rectH
        ) && (
          parseInt(document.getElementsByTagName("text")[0].getAttribute("x"))>x
        ) && (
          parseInt(document.getElementsByTagName("text")[0].getAttribute("y"))>y
        ); // end return conds
    }, // end test 74
];
