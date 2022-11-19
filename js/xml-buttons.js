// EVENTS - PROGRAMMATIC - ISSUE DOWNLOAD

window.issueDownload = function() { // TDDTEST19 FTR
    var temp = document.createElement('a');
    temp.href = 'data:image/svg+xml,' + encodeURI(document.getElementById('svgFullTextarea').value);
    temp.target = '_blank';
    temp.download = 'act.svg';
    temp.click();
    return {
        href:temp.href,
        download:temp.download,
        target:temp.target
    };
}

// EVENTS - PROGRAMMATIC - ISSUE DOWNLOAD

window.issueCopy = function() { // TDDTEST20 FTR
    var ta = document.getElementById("svgFullTextarea");
    ta.disabled = false;
    ta.focus();
    ta.select();
    var copied = document.execCommand("copy");
    ta.disabled = true;
    console.log('copy');
    return copied;
}
