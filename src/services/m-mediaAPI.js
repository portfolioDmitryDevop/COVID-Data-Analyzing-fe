const requestCases = "cases";
const requestVaccines = "vaccines";
const requestHistory = "history?status=deaths";

export default class MMediaAPI {

    #url;
    #historyData;
    #vaccinesData;
    #lastHistoryUpdate;

    constructor(url) {
        if (!url) throw 'API URL is not specified.'
        this.#url = url;
        this.#vaccinesData = this.getData(requestVaccines);
        this.#updateHistoryData();
    }

    getHistoryData(){
        // Update data if needed before returning
        if (!this.#dataIsUpToDate(new Date())) this.#updateHistoryData();
        return this.#historyData;
    }
    getVaccinesData(){
        return this.#vaccinesData;
    }
    getCasesData(){
        return this.getData(requestCases);
    }

    async getData(parameters){
        const response = await fetch(this.#url + parameters);
        const res = await response.json();
        return res;
    }

    #updateHistoryData() {
        this.#historyData = this.getData(requestHistory);
        this.#lastHistoryUpdate = new Date();
    }

    #dataIsUpToDate(currentDate) {
        return currentDate.withoutTime() > this.#lastHistoryUpdate.withoutTime();
    }

}

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}