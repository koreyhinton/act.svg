import * as assert from "uvu/assert";
import "../js/node-map.js";
import "../js/node-sel.js";
import "../js/node-sel-dec.js";

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

    [ { t: 1, inj: null, xvals: [1,2], selected: true }, // test
      { t: 1, inj: true, xvals: [1,2], selected: false }  // inj prev impl. bug
    ].testEach("nav and save keeps selection visible", async ({t,inj,xvals,selected,scope}) => {

        // bug: nav forward 1 selection, edit and save results in de-selection
        //      (save shouldn't have de-selected)

        let ids = [1,2];

        let dec = new window.NodeDecorator();

        let nodes = [{
            tagName: 'text',
                attrs: [
                    {name: 'id', value: ids[0]},
                    {name: 'fill', value: 'black'},
                    {name: 'x', value: xvals[0]+''}
                ]
        },{
            tagName: 'text',
                attrs: [
                    {name: 'id', value: ids[1]},
                    {name: 'fill', value: 'black'},
                    {name: 'x', value: xvals[0]+''}
                ]
        }];

        let resultNds = null;

        let selIds = ids.map((id) => ({id: id}));

        window.lgLogNode = ()=>{};
        window.cmFill = ()=>{};

        let nav = new window.NodeSelectionNavigator(
            ()=>{while(nav.selNdIds.length>0)nav.selNdIds.shift();},
            ()=>{resultNds = dec.decorateDiagram(nodes, selIds);},
            (id)=>{return nodes.filter(nd => nd.attrs.filter(a=>a.name=='id' && a.value == id).length > 0)?.[0];},
            window.issueSelection,
            selIds
        );
        nav.next();

        // after nav, edit and save 2nd node and selection should stay present
        dec.decorateDiagram = dec.decorateDiagram.bind({...dec,...scope});
        window.xAttr(resultNds[1]).value ??= xvals[1]+'';
        resultNds = dec.decorateDiagram(nodes, selIds);
        assert.ok(
            (selected && resultNds[1].attrs.filter(a => a.name == 'fill')[0].value != 'black') ||
            (!selected && resultNds[1].attrs.filter(a => a.name == 'fill')[0].value == 'black'));
    }), // end tinj1

    [ { t: 2, inj: null }, // test
      { t: 2, inj: 2 } // todo: disfeature test
    ].testEach("decorate node as icon", async ({t,inj,scope}) => {
        let selIds = [{id: 'text1'}];
        let node = {
            tagName: 'text',
            attrs: [
                {name: 'id', value: 'text1'},
                {name: 'fill', value: window.editColor},
                {name: 'x', value: '10'},
                {name: 'y', value: '10'},
            ],
            text: 'Long Text Value'
        };
        let dec = new window.NodeDecorator();
        dec.decorateIcon = dec.decorateIcon.bind({...dec,...scope});
        let decorated = dec.decorateIcon([node], selIds)[0];
        // icon decorated node should become smaller and position closer to 0,0
        assert.ok(
            decorated.text.length < 'Long Text Value'.length &&
            parseInt(xAttr(decorated.attrs).value) < 10
        );
    }), // end tinj2

])})();
