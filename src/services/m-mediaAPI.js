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
    #countrys;

    constructor(url) {
        if (!url) throw 'API URL is not specified.'
        this.#url = url;
        this.#updateHistoryData();
    }

    //     export default function createStatDataObject(iso, country, confirmedRate, deathsRate, vaccinatedRate, confirmed, deaths, vaccinated) {
    //         return {iso, country, confirmedRate, deathsRate, vaccinatedRate, confirmed, deaths, vaccinated};
    // }

    async getCountrys() {
        const death = this.#parseObjDeath(await this.getData(requestDeathHistory));
        const confirmed = this.#parseObjConfirmed(await this.getData(requestConfirmedHistory));
        const vaccines = this.#parseObjVaccines(await this.getData(requestVaccines));
        const cases = this.#parseObjCases(await this.getData(requestCases));
        const covid = _.merge(cases, vaccines, confirmed, death);
        const array = _.filter(covid, e => 
            e.confirmed != null &&
            e.continent != null &&
            e.deaths != null &&
            e.population != null &&
            e.vaccinated != null);
        return array;

    }

    #parseObjCases(obj) {
        return _.mapValues(obj, (e) => {
            return {country: e.All.country,  confirmed: e.All.confirmed, deaths: e.All.deaths, population: e.All.population, continent: e.All.continent, iso: e.All.abbreviation };
        });
    }

    #parseObjVaccines(obj) {
        return _.mapValues(obj, (e) => {
            return {country: e.All.country,  vaccinated: e.All.people_vaccinated, population: e.All.population };
        });
    }
    #parseObjDeath(obj) {
        return _.mapValues(obj, (e) => {
            return {country: e.All.country,  datesDeath: e.All.dates };
        });
    }
    #parseObjConfirmed(obj) {
        return _.mapValues(obj, (e) => {
            return {country: e.All.country,  datesConfirmed: e.All.dates };
        });
    }

    async getHistoryData() {
        // Update data if needed before returning
        if (!this.#dataIsUpToDate(new Date())) await this.#updateHistoryData();
        return { death: this.#historyDeathData, confirmed: this.#historyConfirmedData };
    }

    async getVaccinesData() {
        const obj = await this.getData(requestVaccines);
        return _.mapValues(obj, (e) => e.All);

    }

    async getCasesData() {
        let obj = await this.getData(requestCases);
        return _.mapValues(obj, (e) => e.All);
    }

    async getData(parameters) {
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