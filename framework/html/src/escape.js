
let dict = {"<":"&lt;", ">":"&gt;", "&":"&amp;"};
let _replace = v => dict[v];
let pattern = /[<>&]/g;

let escape = v => v.replace(pattern, _replace);

export default escape;