import { exec, suite } from 'uvu';
import "./array.js";

import fs from "fs";

(async() => {

    let promises = [];
    await fs.readdir('./test2', async (err, files) => {
        //let imports = [];
        files.forEach(file => {
            if (file.endsWith('.test.js')) {
                //imports.push('./'+file);
                promises.push(new Promise(async (resolve, reject) => {
                    import('./'+file);
                    resolve();
                }));
            }
        });
        /*for (const imp of imports) {
            import(imp);
        }*/
    });
    // import "./node-vertex.test.js";
    

    await Promise.all(promises);

})();
