import * as assert from "uvu/assert";
import "../js/node-sel.js"

(async()=>{await Promise.all([

    [ { t: 0, inj: null, ids: [1,2,3], expect: 1 }, // nav sel feature test
      { t: 0, inj: 2,    ids: [1,2,3], expect: 3 } // disfeature test
    ].testEach("can navigate selection", async ({t,inj,ids,expect,scope}) => {
        let selIds = ids.map((id) => ({id: id}));

        window.lgLogNode = ()=>{};
        window.cmFill = ()=>{};

        let nav = new window.NodeSelectionNavigator(
            ()=>{while(nav.selNdIds.length>0)nav.selNdIds.shift();},
            ()=>{},
            (id)=>({
                tagName: 'text',
                attrs: [
                    {name: 'id', value: id},
                    {name: 'fill', value: 'black'}
                ]
            }),
            window.issueSelection,
            selIds
        );
        nav.next = nav.next.bind({...nav,...scope});
        nav.next();

        assert.is(selIds[selIds.length-1].id, expect);
    }), // end tinj0

])})();
