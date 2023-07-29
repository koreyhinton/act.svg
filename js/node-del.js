window.NodeDeleter = class {
    constructor(nodes) {
        this.nodes = nodes; // global svgNodes ref
    } // end node deleter constructor
    delete(ids) {
        let filtered = this.nodes.filter(nd =>
            ids.filter(c =>
                c.id==nd.attrs.filter(a=>
                    a.name=='id')?.[0]?.value).length==0);
        while (this.tinj3 ?? (this.nodes.length > 0)) this.nodes.shift();
        while (filtered.length > 0) this.nodes.push(filtered.shift());
        while (this.tinj3 ?? (ids.length > 0)) ids.shift();
    } // end delete method
} // end node deleter class
