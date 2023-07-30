// xmlflow
// window.xf = {xmlflows: {}};

window.xf.xmlflows['full-xml-load-nodes-and-svg'] = `
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<xmlflow id="full-xml-load-nodes-and-svg">
    <data-stream-full-xml>
        <B1/>
        <xml2xdomNds>
            <xdomXroot>
                <xdom2nds>
                    <ndsSetMouseRects>
                        <A1/>
                    </ndsSetMouseRects>
                </xdom2nds>
            </xdomXroot>
        </xml2xdomNds>
    </data-stream-full-xml>
    <data-stream-nodes>
        <A2/>
    </data-stream-nodes>
    <dom-stream-svg>
        <B2/>
    </dom-stream-svg>
    <A>
        <data-load-nodes/>
    </A>
    <B>
        <dom-load-svg/>
    </B>
</xmlflow>
`;

window.xf.xmlflows['editNode-xml-load-nodes'] = `
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<xmlflow id="editNode-xml-load-nodes">
    <data-stream-editNd-xml>
        <xml2xdomNd>
            <xdom2nd>
                <ndSetMouseRects>
                    <B1/>
                    <C1/>
                    <D1/>
                </ndSetMouseRects>
            </xdom2nd>
        </xml2xdomNd>
    </data-stream-editNd-xml>
    <data-stream-edit-id>
        <id2nd><C2/></id2nd>
    </data-stream-edit-id>
    <data-stream-cacheNd>
        <D2/>
    </data-stream-cacheNd>
    <data-stream-sub-selected-nodes>
        <B2/><!-- sub-sel upd must happen before cacheNd update -->
    </data-stream-sub-selected-nodes>
    <!-- (A)
         (A) should be connecting svgNodes and editId flows
         in order to call id2nd, however skipping right to B for now
         (since xmlflow has not built and tested connectors within connectors)
     -->
    <B>
        <data-load-map-nodes/>
    </B>
    <C>
        <data-load-node/>
    </C>
    <D>
        <data-load-node/>
    </D>
</xmlflow>
`;

window.xf.xmlflows['nodes-load-full-xml-and-svg'] = `
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<xmlflow id="nodes-load-full-xml-and-svg">
    <data-stream-nodes>
        <nds2xml>
            <A1/>
            <B1/>
        </nds2xml>
    </data-stream-nodes>
    <dom-stream-full-ta>
        <A2/>
    </dom-stream-full-ta>
    <dom-stream-svg>
        <B2/>
    </dom-stream-svg>
    <A>
        <dom-load-ta/>
    </A>
    <B>
        <dom-load-svg/>
    </B>
</xmlflow>
`;
