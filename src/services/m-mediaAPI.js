import { removeTime } from "../utilities/extensions";

const requestCases = "cases";
const requestVaccines = "vaccines";
const requestDeathHistory = "history?status=deaths";
const requestConfirmedHistory = "history?status=confirmed";

export default class MMediaAPI {

    #url;
    #historyDeathData;
    #historyConfirmedData;
    #lastHistoryUpdate;

    constructor(url) {
        if (!url) throw 'API URL is not specified.'
        this.#url = url;
        this.#updateHistoryData();
    }

    async getHistoryData(){
        // Update data if needed before returning
        if (!this.#dataIsUpToDate(new Date())) await this.#updateHistoryData();
        return {death: this.#historyDeathData, confirmed: this.#historyConfirmedData};
    }

    getVaccinesData(){
        return this.getData(requestVaccines);
    }

    getCasesData(){
        return this.getData(requestCases);
    }

    async getData(parameters){
        const response = await fetch(this.#url + parameters);
        const res = await response.json();
        return res;
    }

    async #updateHistoryData() {
        this.#lastHistoryUpdate = new Date();
        this.#historyDeathData = await this.getData(requestDeathHistory);
        this.#historyConfirmedData = await this.getData(requestConfirmedHistory);
    }

    #dataIsUpToDate(currentDate) {
        return removeTime(currentDate) > removeTime(this.#lastHistoryUpdate);
    }

}