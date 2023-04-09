window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 59 - SET X,Y COMMANDS
    function test59() {
        let foundX = false;
        let foundY = false;
        let p = new window.cmParser(
            () => {return "setx 1; sety 1"},
            (cmd,vals) => {
                if (cmd=='setx' && vals.x === 1) foundX=true;
                if (cmd=='sety' && vals.y === 1) foundY=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundX && foundY;
    }, // end test 59
    // TDD TEST 60 - INC X,Y COMMANDS
    function test60() {
        let foundX = false;
        let foundY = false;
        let p = new window.cmParser(
            () => {return "incx -1; incy -1"},
            (cmd,vals) => {
                if (cmd=='incx' && vals.x === -1) foundX=true;
                if (cmd=='incy' && vals.y === -1) foundY=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundX && foundY;
    }, // end test 60
    // TDD TEST 61 - SET W,H COMMANDS
    function test61() {
        let foundW = false;
        let foundH = false;
        let p = new window.cmParser(
            () => {return "setw 10; seth 10"},
            (cmd,vals) => {
                if (cmd=='setw' && vals.w === 10) foundW=true;
                if (cmd=='seth' && vals.h === 10) foundH=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundW && foundH;
    }, // end test 61
    // TDD TEST 62 - SET W,H COMMANDS
    function test62() {
        let foundW = false;
        let foundH = false;
        let p = new window.cmParser(
            () => {return "incw 10; inch 10"},
            (cmd,vals) => {
                if (cmd=='incw' && vals.w === 10) foundW=true;
                if (cmd=='inch' && vals.h === 10) foundH=true;
            }// end cb arg
        ); // end init parser
        p.parseArgs();
        return foundW && foundH;
    }, // end test 62
];
