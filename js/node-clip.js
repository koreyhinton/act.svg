window.NodeClipboard = class {
    copy() {
        var xml = '';
        for (var i=0; i<curIds.length; i++) {
            var nd = {};
            window.forceMap(window.id2nd(curIds[i].id), nd);
            nd.attrs = nd.attrs.filter(a => a.name != 'id');
            if (i<curIds.length-1){
                nd.attrs.push({name:'class', value:'unresolvedmovee'});
            } else {
                nd.attrs.push({name:'class', value:'unresolvedmover'});
            }
            xml += '    '+window.nd2xml(nd, nd.cacheColor) +`
`;
        }
        navigator.clipboard.writeText(xml);
    }
    cut() {
        this.copy();
        var curIdsCopy = [];
        for (var i=0; i<curIds.length; i++) {
            curIdsCopy.push({id: curIds[i].id});
        }
        window.onDone(); // stop selection
        new NodeDeleter(svgNodes).delete(curIdsCopy);
    }
    paste1() {
        window.onDone();
        // jump to end of full textarea so it will recieve the paste (paste2)
        var ta = document.getElementById("svgFullTextarea");
        ta.disabled = false;
        ta.focus();
        ta.selectionStart = ta.value.indexOf('</svg>')-1;
        ta.selectionEnd = ta.value.indexOf('</svg>');
    }
    paste2(testCb) {
        if (window.gTest) { testCb(); }
        //onStart();
        window.gDispatch(function() {
            // after paste event
            var x = window.mouse.x;
            var y = window.mouse.y;
            svgNodes = [];
            //onStart();
            document.getElementById("svgId").innerHTML='';
            window.loadSvg(document.getElementById("svgFullTextarea").value, window.gTest?{}:null);
            var els = document.getElementsByClassName("unresolvedmovee");
            cacheNd = {};
            var moverNd = window.matchNode(document.getElementsByClassName("unresolvedmover")[0]);
            window.forceMap(moverNd, cacheNd);
    
            window.setPos(moverNd, x, y);
            // console.warn('mover: '+window.getPosId(moverNd.attrs), 'mouse: '+x+','+y);
    
            for (var i=0; i<els.length; i++) {
                var el = els[i];
                var moveeNd = window.matchNode(el);
                moveeNd.attrs = moveeNd.attrs.filter(a => a.name != 'class');
                window.smartMap(moverNd, moveeNd);
            }
            moverNd.attrs = moverNd.attrs.filter(a => a.name != 'class');
            window.xmlflow(window.xf.xmlflows['nodes-load-full-xml-and-svg'], window.xf); // updateFrames();
            document.getElementById("svgFullTextarea").disabled = true;
        }, 600);
    }
}; // end node clipboard class def

window.addEventListener("paste", function(e) {
    if (window.gStarted && // TDDTEST52 FIX // CT/40
           window.getComputedStyle(document.getElementById("editModalBG"))
               .visibility != "visible" // TDDTEST53 FIX // CT/42
    ) { // end paste condition
        window.lgUser('// paste'); // TDDTEST52
                                   // and // TDDTEST53
                                   // tests look for this value
        window.gAppClipKeyDispatcher.dispatchKey({key: 'v', ctrlKey: true});
        // window.NodeClipboard().paste2();
    } // end started condition
}); // end paste event listener
