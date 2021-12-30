import { removeTime } from "../utilities/extensions";
import _ from "lodash";
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

    async getVaccinesData(){
        const obj = await this.getData(requestVaccines);
        return _.mapValues(obj, (e) => e.All);
        
    }

    async getCasesData(){
        let obj = await this.getData(requestCases);
        return _.mapValues(obj, (e) => e.All);
    }

    async getData(parameters){
        const response = await fetch(this.#url + parameters);
        const res = await response.json();
        return res;
    }

    async #updateHistoryData() {        
        this.#historyDeathData = _.mapValues(await this.getData(requestDeathHistory), (e) => e.All); 
        this.#historyConfirmedData = _.mapValues(await this.getData(requestConfirmedHistory), (e) => e.All);
        this.#lastHistoryUpdate = new Date();
    }

    #dataIsUpToDate(currentDate) {
        return removeTime(currentDate) > removeTime(this.#lastHistoryUpdate);
    }
}