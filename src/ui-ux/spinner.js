export default class Spinner {

    #spinnerElement;
    #currentStatus;

    constructor(idSpinner) {
        this.#spinnerElement = document.getElementById(idSpinner);
        if (!this.#spinnerElement) {
            throw `Wrong spinner id (${idSpinner})`;
        }
        this.#currentStatus = false;
    }

    #start() {
        this.#currentStatus = true;
        this.#spinnerElement.innerHTML = '<div class="spinner-border" style="color: #fd5786;" role="status"><span class="visually-hidden">Loading...</span></div>';
    }

    #stop() {
        this.#currentStatus = false;
        this.#spinnerElement.innerHTML = '';
    }

    status() {
        return this.#currentStatus;
    }

    // Show/hide spinner
    async wait(awaitFunction) {
        this.#start();
        try {
            const result = await awaitFunction();
            return result;
        } finally {
            this.#stop()
        }
    }
}