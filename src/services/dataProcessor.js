import _ from "lodash";
import createStatDataObject from "../models/StatCase";
import { convertDate, getPreviousDay, removeTime } from "../utilities/extensions";

export default class DataProcessor {

    #dataProvider;

    constructor(dataProvider) {
        this.#dataProvider = dataProvider;
    }

    /* STAT BY CONTINENT REQUEST */

    /**
     * 
     * @returns array[{"continent","confirmed","deaths","vaccinated"}];
     */
    async getStatisticsContinents() {
        const objCases = await this.#dataProvider.getCasesData();
        const arrCases = this.#parseObjCases(objCases);
        const objVaccines = await this.#dataProvider.getVaccinesData();
        const arrVaccines = this.#parseObjVaccines(objVaccines);
        const arrMerge = _.merge(arrCases, arrVaccines);

        const objContinent = _.groupBy(arrMerge, (e) => {
            return e.continent;
        });
    
        const arrRate = this.#getArrRate(objContinent);
        return arrRate;
    }

    #parseObjCases(objCases){
        const arrCases = [];
        for (const key in objCases) {
            arrCases.push({
                "country": key,
                "confirmed": objCases[key].All.confirmed,
                "deaths": objCases[key].All.deaths,
                "population": objCases[key].All.population,
                "continent": objCases[key].All.continent
            });
        }
        return arrCases;
    }

    #parseObjVaccines(objVaccines){
        const arrVaccines = [];
        for (const key in objVaccines) {
            arrVaccines.push({
                "country": key,
                "vaccinated": objVaccines[key].All.people_vaccinated
            });
        }
        return arrVaccines;
    }

    #getArrRate(objContinent){
        const arrRate = [];
        Object.entries(objContinent)
        .forEach((e) => {
            e[1].reduce((r,v) => {
                v.population = (v.population === undefined) ? 0 : v.population;
                v.vaccinated = (v.vaccinated === undefined) ? 0 : v.vaccinated;
                v.confirmed = (v.confirmed === undefined) ? 0 : v.vaccinated;
                v.deaths = (v.deaths === undefined) ? 0 : v.vaccinated;
                
                r.population=v.population+r.population;
                r.confirmed=v.confirmed+r.confirmed;
                r.deaths=v.deaths+r.deaths;
                r.vaccinated=v.vaccinated+r.vaccinated;
                return r;
            });
            arrRate.push({  "continent":e[0],
                            "confirmed":e[1][0].confirmed/e[1][0].population,
                            "deaths":e[1][0].deaths/e[1][0].population,
                            "vaccinated":e[1][0].vaccinated/e[1][0].population});
        });
        return arrRate;
    }

    /* HISTORICAL REQUEST */

    async getHistoryStatistics(from, to) {
        this.#validateInputDates(from, to);

        const fromDate = convertDate(from);
        const toDate = convertDate(getPreviousDay(from)); // From is excluded parameter
        const data = await this.#dataProvider.getHistoryData();
        const confirmed = data.confirmed;
        const death = data.death;
        const arrCases = []; 

        for (const key in confirmed) {
            if (confirmed.hasOwnProperty(key)) {
                const statCase = await this.#createStatCase(confirmed[key], death[key], fromDate, toDate);
                if (statCase != null) arrCases.push(statCase);
            }
        }
        return arrCases;
    }

    async #createStatCase(confirmedData, deathData, from, to) {
        const country = confirmedData.All.country;
        if (country != undefined) {
            const population = confirmedData.All.population;
            const iso = confirmedData.All.abbreviation;
            const confirmed = this.#parseDatesData(confirmedData.All.dates, population, from, to);
            const death = this.#parseDatesData(deathData.All.dates, population, from, to);
            const vaccinatedCount = await this.#getVaccinatedCount(country);
            const statCaseDataObject = createStatDataObject(iso, country, confirmed.percent, death.percent, vaccinatedCount / population, confirmed.amount, death.amount, vaccinatedCount);
            return statCaseDataObject
        } 
    }

     async #getVaccinatedCount(country) {
        const vaccinatedData = await this.#dataProvider.getVaccinesData();
        const countryVaccinated = _.get(vaccinatedData, country);
        return countryVaccinated != undefined ? countryVaccinated.All.people_vaccinated : 0;
    }

    #parseDatesData(data, population, from, to) {
        const count = data[to] - data[from];
        return {percent: count / population, amount: count};
    }

    #validateInputDates(from, to) {
        if (from == undefined || to == undefined) throw new Error("Both dates must be specified for a historical request.");
        if (removeTime(from).getTime() > removeTime(new Date()).getTime()) throw new Error("Historical requests for the future are not available.");
        if (from >= to) throw new Error("From date can't be equal or higher than To date.");
        if (from < new Date('2020-01-22T00:00:00')) { throw new Error("There is no data on the epidemic earlier than 01/22/2020.") };
    }


}