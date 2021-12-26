export default class TableHandler {

    #keys; // fields of being displayed object
    #bodyElement;

    constructor(headerId, bodyId, keys, sortFun) {
        this.#keys = keys;

        this.#bodyElement = document.getElementById(bodyId);
        if (!this.#bodyElement) {
            throw 'Wrong body id';
        }

        if (sortFun){
            const columnsEl = document.querySelectorAll(`#${headerId} th`);
            columnsEl.forEach(c => c.addEventListener('click', 
                sortFun.bind(this, c.textContent)));
        }
    }
    clear() {
        this.#bodyElement.innerHTML = ' ';
    }
    addRow(obj) {
        this.#bodyElement.innerHTML += `<tr>${this.#getRecordData(obj)}</tr>`;
    }
    addRowColored(obj, color) {
        this.#bodyElement.innerHTML += `<tr style="background-color:${color};">${this.#getRecordData(obj)}</tr>`;
    }
    #getRecordData(obj) {
        return this.#keys.map(key => this.#getColumnData(obj, key)).join('');
    }
    #getColumnData(obj, key) {
        return `<td>${obj[key].constructor.name === "Date" 
            ? obj[key].toISOString().substr(0,10) 
            : obj[key]}</td>`
    }
}

// function getColumns(keys, sortFnName){
//     return keys.map(key => {
//         return !sortFnName ? `<th>${key}</th>` :
//          `<th style="cursor: pointer" onclick="${sortFnName}('${key}')">${key}</th>`
//     }).join('');
// }

function getColumns(keys, sortFun, remFunName) {
    let res = keys.map(key => {
        return !sortFun ? `<th>${key}</th>` 
            : `<th style="cursor: pointer">${key}</th>`;
    })
    .join('');
    return remFunName ? res.concat(`<th></th>`) : res;
}