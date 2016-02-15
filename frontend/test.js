import paginate from './reducers/paginate'

console.dir( paginate({
    mapActionToKey: action => action.login,
    types: [
        "REQ",
        "SUC",
        "FAIL"
    ]
}));