export default class Navigator {
    #navigatorId
    constructor(navigatorId) {
        this.#navigatorId = navigatorId;
        if (!this.#navigatorId) {
            throw "Wrong navigator id";
        }
    }
    getActiveTab() {
        let activeTab = document.querySelector(`#${this.#navigatorId} .active`);
        return activeTab?.id;
    }
}