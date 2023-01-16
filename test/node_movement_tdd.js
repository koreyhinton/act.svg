window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 42 - ARROW KEY MOVE KEEPS SELECTION ACTIVE
    function test42() {
        onStart({});

        // rect frame in svg coordinate
        let rectFrame = window.StartEndFrame.FromEl(
            document.getElementsByTagName('rect')[0]
        ); // frame of the default rect svg element

        let clX = window.gSvgFrame.getStart().x + rectFrame.getEnd().x - 1;
        let clY = window.gSvgFrame.getStart().y + rectFrame.getEnd().y - 1;
            //^ 1px just inside end of rect frame (avoids selecting inner text)

        var e  = {clientX:clX, clientY:clY};

        // click Rect as single click to select
        window.mousedown(e); window.mouseup(e);

        // Left Arrow keypress
        window.keydown({
            key: 'ArrowLeft',
            shiftKey: false,
            view:{event:{preventDefault:()=>{}}}
        }); // moves 1 px left

        // Must be tracked (curId) and not reverted back to original cacheColor
        return curIds.length > 0 &&
            document.getElementsByTagName('rect')[0]
                .getAttribute('stroke') != 'black';
    }
];
