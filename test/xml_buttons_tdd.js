window.tddTests = [
    ...(window.tddTests||[]),
    // TDD TEST 19 - DOWNLOADS XML
    function test19() {
        var el = issueDownload();
        var href = el.href.indexOf('data:image/svg+xml') > -1;
        href &&= el.href.indexOf('333') > -1;//text x="333" element
        return href && (el.download == 'act.svg');
    },
    // TDD TEST 20 - COPIES XML
    function test20() {
        // all we can test from ci is if the execCommand function was called
        document.execCommand = (cmd) => cmd=='copy';
        var copied = issueCopy();
        document.execCommnad = null;
        return copied;
    }
];
