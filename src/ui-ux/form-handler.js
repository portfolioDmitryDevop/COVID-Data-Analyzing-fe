export default class FormHandler {

    #formElement;
    #alertElement;
    #inputElements;

    constructor(formId, alertId) {
        this.#formElement = document.getElementById(formId);
        if(!this.#formElement) {
            throw "Wrong form id " + formId;
        }
        if(alertId){
            this.#alertElement = document.getElementById(alertId);
        }
        this.#inputElements = document.querySelectorAll(`#${formId} [name]`);
        if (!this.#inputElements || this.#inputElements.length == 0) {
            throw "Wrong form content";
        }
        this.#inputElements = Array.from(this.#inputElements); // conversion to Array from NodeList
    }

    addHandler(handlerFun) {
        this.#formElement.addEventListener('submit', this.#onSubmit.bind(this, handlerFun));
    }

    async #onSubmit(handlerFun, event) {
        event.preventDefault();
        const obj = this.#inputElements.reduce(createObject, {});
        try {
            hideAlert(this.#alertElement);
            await handlerFun(obj);
        }
        catch(validationErrors) {   
            if (validationErrors == 'Server is unavailable') {
                throw validationErrors;
            }
            showAlert(this.#alertElement, validationErrors);
        }
    }

    static fillOptions(selectId, options) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) {
            throw "Wrong select id";
        }
        selectElement.innerHTML += getOptions(options);
    }

    static fillCalendarValues(calendarId, defaultValue, maxValue) {
        const calendarElement = document.getElementById(calendarId);
        if (!calendarElement) {
            throw 'Wrong calendar id';
        }
        if (defaultValue) {
            calendarElement.setAttribute('value', defaultValue);
        }
        if (maxValue) {
            calendarElement.setAttribute('max', maxValue);
        }
    }

    static fillCheckBoxes(parentId, values, name) {
        const parentElement = document.getElementById(parentId);
        if (!parentElement) {
            throw 'Wrong parent id';
        }
        values.forEach(value => {
            parentElement.innerHTML += `<div class="col-6 col-sm-3 form-check ms-2">
            <input type="checkbox" class="form-check-input" id="${value}" name="${name}"
             value="${value}" checked>
            <label for="${value}" class="form-check-label">${value}</label>
          </div>`
        });
    }
}

function createObject(obj, element) {
    switch(element.type) {
        case "radio":
            if (element.checked){
                obj[element.name] = element.value;
            }
            break;
        case "checkbox":
            if (!obj[element.name]) {
                obj[element.name] = [];
            }
            if (element.checked) {
                obj[element.name].push(element.value);
            }
            break;
        default:
            obj[element.name] = element.value;
    }
    return obj;
}

function getOptions(options) {
    return options.map(o => `<option value="${o}">${o}</option>`).join('');
}

function showAlert(alertElement, message) {
    alertElement.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>${message}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

function hideAlert(alertElement) {
    alertElement.innerHTML = '';
}