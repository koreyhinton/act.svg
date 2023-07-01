import { test, suite } from "uvu";
import { tinj } from "./tinj.js";
global.window = {};
Array.prototype.testEach = async function (name, test) {
    return new Promise( async (resolve, reject) => {

        let s = suite(`Test ${this[0].t} ${name}`);
        let testno = this[0].t;
        //for await (const a of this) {
        for (let i = 0; i < this.length; i++) {
            /*let*/ var obj = {};
            let a = this[i];
            let testName = 'test';//`Test ${testno}[${i}] ${name}`;
            await s(testName, async () => {
                tinj(a.t,a.inj,obj);//this[i].t, this[i].inj,obj);
                a.scope = obj;//this[i].scope = obj;
                test(a);//test(this[i]);
            });
        }
        await s.run();
        // s.run();
        resolve();
    });
};
