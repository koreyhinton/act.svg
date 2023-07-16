window.AppModeKeyDispatcher = class {
    constructor() {
        this.q = [];
    } // end constructor
    dispatchKey(key) {
        if (key.ctrlKey) return false;
        if (key.key.toLowerCase() == 'shift') return true;// fake handle non-
                                                          // paired shift (to
                                                          // ignore it)
        let dispatched = false;
        if (this.q.length >= 2) {
            while (this.q.length > 0) this.q.shift();
        } // end queue length check
        if (this.q.length == 0 && ['|', '-', 'c'].indexOf(key.key)>-1) {
            this.q.push(key);
        } // end mode will have submode cond
        else if (this.q.length == 1) {
            AppMode.set(this.q[0].key, key.key);
            this.q.push(key);
            dispatched = true;
        } // end submode cond
        else {
            AppMode.set(key.key);
            dispatched = true;
        } // end mode will not have submode cond
        if (dispatched) {
            document.getElementsByTagName('iframe')[0]?.contentWindow.postMessage('key:'+(this.q[0]?.key??'')+key.key, '*');
            let msg = (this.q[0]?.key??'')+key.key + ' =&gt; ' + AppMode.name() + ' Mode';
            notifyMsg(msg);
        } // end dispatch cond
        return dispatched;
    } // end dispatch key function
} // end app mode key dispatcher class

window.AppClipKeyDispatcher = class {
    constructor() {
        this.pending = false;
    } // end app clipboard key dispatcher constructor
    dispatchKey(key) {
        let self = this;
        let ctrlC = {
            dispatchKey: function(key) {
                let dispatch = key.key == 'c' && key.ctrlKey;
                if (dispatch) new NodeClipboard().copy();
                return dispatch;
            }
        };
        let ctrlX = {
            dispatchKey: function(key) {
                let dispatch = key.key == 'x' && key.ctrlKey;
                if (dispatch) { // TDDTEST30 FTR
                    new NodeClipboard().cut();
                }
                return dispatch;
            }
        };
        let ctrlV = {
            dispatchKey: function(key) {
                let dispatch = key.key == 'v' && key.ctrlKey;
                if (self.pending && dispatch) {
                    new NodeClipboard().paste2();
                    self.pending = false;
                    // console.warn('paste2');
                } else if (dispatch) {
                    new NodeClipboard().paste1();
                    dispatch = false;
                    self.pending = true;
                    // console.warn('paste1')
                } else { self.pending = false; }
                return dispatch;
            }
        };
        let dispatchers = [ ctrlV, ctrlX, ctrlC ];
        while (dispatchers.length > 0) {
            if (dispatchers.shift().dispatchKey(key)) return true;
        } // end dispatchers queue loop
        return false;
    } // end dispatch key function
}; // end app clipboard key dispatcher class

window.AppKeyDispatcher = class {
    constructor(dispatchers) {
        this.q = dispatchers;
    } // end app key dispatcher constructor
    dispatchKey(key) {
        let dispatched = false;
        while (this.q.length > 0) {
            let dispatcher = this.q.shift();
            dispatched = dispatcher.dispatchKey(key);
            // console.warn('dispatched', dispatched, key, dispatcher);
            if (dispatched) return true;
        } // end dispatcher queue loop
        return false;
    } // end dispatch key method
} // end app key dispatcher class def

setTimeout(function(){
window.gAppModeKeyDispatcher = new window.AppModeKeyDispatcher();
window.gAppClipKeyDispatcher = new window.AppClipKeyDispatcher();

//console.warn(window.AppClipKeyDispatcher);
},0);
