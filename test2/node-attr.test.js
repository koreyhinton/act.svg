import * as assert from "uvu/assert";
import "../js/node-attr.js"

(async()=>{await Promise.all([

    [{ t: 3, inj: null }].testEach("Placeholder test 3", async () => { 
        assert.ok(true); 
    }),

    [
        { t: 4, inj: null, expect: 1 }, // test
        { t: 4, inj: {x:0, y:0}, expect: 0 }, // reverse test
    ].testEach("Placeholder test 4", async ({t,inj,expect,scope}) => {
        // assert.ok(true);
        let vtx = { x: 0, y: 0 };
        assert.ok(true);
        //let iVtx = window.vxInverse.call(scope, vtx);
        //assert.is(iVtx.x, expect);
        //assert.is(iVtx.y, expect);
    }),

    [{ t: 5, inj: null }].testEach("Placeholder test 5", async () => { assert.ok(true); }),

])})();
