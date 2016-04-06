const root = "/admin";
const role = "administrator";

export const generate = role=>path=> `${root}/${role}/${path}`;

class Path {
    constructor(items) {
        this.items = items;
    }

    add(path) {
        return new Path(this.items.concat([path]));
    }

    compile() {
        return this.items.join("/");
    }
}

export {Path as Path};