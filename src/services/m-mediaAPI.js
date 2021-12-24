
const requestCases = "cases";
const requestVaccines = "vaccines";
const requestHistory = "history?status=deaths";

export default class MMediaAPI {

    #url;
    #historyData;
    #vaccinesData;

    constructor(url) {
        if (!url) throw 'API URL is not specified.'
        this.#url = url;
        this.#historyData = this.getData(requestHistory);
        this.#vaccinesData = this.getData(requestVaccines);
    }

    getHistoryData(){
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

}