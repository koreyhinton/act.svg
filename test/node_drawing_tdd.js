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
    },
];
