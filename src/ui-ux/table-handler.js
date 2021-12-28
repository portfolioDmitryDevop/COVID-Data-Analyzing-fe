export default class TableHandler {

    #keys; // fields of being displayed object
    #bodyElement;

    constructor(headerId, bodyId, keys, sortFun) {

        this.#keys = keys;
        this.#bodyElement = document.getElementById(bodyId);
        if (!this.#bodyElement) {
            throw 'Wrong body id';
        }
        if (headerId) {
            const headerElement = document.getElementById(headerId);
            if (!headerElement) {
                throw 'Wrong header id';
            }
            fillTableHeader(headerElement, keys, sortFun);
        }
        if (sortFun){
            const columnsEl = document.querySelectorAll(`#${headerId} th`);
            columnsEl.forEach(c => {
                if(c.innerHTML != "country" && c.innerHTML != ""){
                    c.addEventListener('click', 
                    sortFun.bind(this, c.textContent, headerId));
                }
            });
        }
    }
    clear() {
        this.#bodyElement.innerHTML = ' ';
    }
    addRowImPosition(obj, position) {
        this.#bodyElement.innerHTML += `<tr><td>${position}</td>${this.#getRecordData(obj,position)}</tr>`;
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
        if(obj[key] == undefined){
            return ``;
        }
        if (key === 'country') {
            let flagImg = obj[key] == 'Sri Lanka' ? 'lk.png' : `${obj['iso']}.png`;
            return `<td>
                <img src="node_modules/svg-country-flags/png100px/${flagImg}" style="width: 25px">
                ${obj[key]}</td>`;
        }
        else {
            return `<td>${obj[key]}</td>`;
        }
    }
}

function fillTableHeader(headerElement, keys, sortFun) {
    headerElement.innerHTML = getColumns(keys, sortFun);
}
function getColumns(keys, sortFun) {
    return keys.map(key => {
        return !sortFun || key == '' || key == 'country'  ? `<th>${key}</th>` 
            : `<th style="cursor: pointer">${key}</th>`;
    })
    .join('');
}