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
        if (sortFun) {
            const columnsEl = document.querySelectorAll(`#${headerId} th`);
            columnsEl.forEach(c => {
                if (c.innerHTML != "country" && c.innerHTML != "") {
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
        this.#bodyElement.innerHTML += `<tr><td width="3%" style="padding-right: 0; text-align: center;">${position}</td>${this.#getRecordData(obj, position)}</tr>`;
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
            return `<td width="37%">
                <img src="node_modules/svg-country-flags/png100px/${flagImg}" 
                    style="height: 15px; width: 25px; margin-bottom: 3px"> 
                ${obj[key]}</td>`;
        }
        else {
            if (typeof obj[key] == 'number'){
                return `<td width="20%"> ${obj[key].toLocaleString("ru")}</td>`;
            }
            return `<td width="20%">${obj[key]}</td>`;
        }
    }
    repaintTableHendler(key, headerId) {
        let oldDown = document.getElementsByClassName("bi bi-arrow-down-short");
        let oldUp = document.getElementsByClassName("bi bi-arrow-up-short");

        if (oldDown != undefined) {
            for (const key in oldDown) {
                if (oldDown[key].className != undefined) {
                    oldDown[key].className = "bi bi-arrow-down-short d-none";
                }
            }
        }
        if (oldUp != undefined) {
            for (const key in oldUp) {
                if (oldUp[key].className != undefined) {
                    oldUp[key].className = "bi bi-arrow-up-short d-none";
                }
            }
        }
        let element = document.querySelector(`#${headerId} #${key}`);
        if (element.className == "bi bi-arrow-down-short d-none") {
            element.className = "bi bi-arrow-up-short";
        } else {
            element.className = "bi bi-arrow-down-short";
        }
    }
}

function fillTableHeader(headerElement, keys, sortFun) {
    headerElement.innerHTML = getColumns(keys, sortFun);
}
function getColumns(keys, sortFun) {
    return keys.map(key => {
        if(key == `deaths`){
            return  `<th style="width: 20%; cursor: pointer; color: #fd5786 ">${key}<i id="${key}" class="bi bi-arrow-up-short"></i></th>`
        }

        return !sortFun || key == '' || key == 'country' ? `<th>${key}</th>`
            : `<th style="width: 20%; cursor: pointer; color: #fd5786 ">${key}<i id="${key}" class="bi bi-arrow-up-short d-none"></i></th>`;
    })
        .join('');
}

