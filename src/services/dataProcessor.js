import _ from "lodash";
import createStatDataObject from "../models/StatCase";
import { convertDate, getPreviousDay, removeTime } from "../utilities/extensions";

export default class DataProcessor {

    #dataProvider;
    #config;
    #dataHistoryAll;

    constructor(dataProvider, config) {
        this.#dataProvider = dataProvider;
        this.#config = config;
    }

    /* STAT BY CONTINENT REQUEST */

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

    #parseObjCases(objCases) {
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

    #parseObjVaccines(objVaccines) {
        const arrVaccines = [];
        for (const key in objVaccines) {
            arrVaccines.push({
                "country": key,
                "vaccinated": objVaccines[key].All.people_vaccinated
            });
        }
        return arrVaccines;
    }

    #getArrRate(objContinent) {
        const arrRate = [];
        Object.entries(objContinent)
            .forEach((e) => {
                const acc = { population: 0, confirmed: 0, deaths: 0, vaccinated: 0 };
                e[1].forEach((v) => {
                    if (v.continent === undefined) {
                        return;
                    }
                    let population = (v.population === undefined) ? 0 : v.population;
                    let vaccinated = (v.vaccinated === undefined) ? 0 : v.vaccinated;
                    let confirmed = (v.confirmed === undefined) ? 0 : v.confirmed;
                    let deaths = (v.deaths === undefined) ? 0 : v.deaths;
                    acc.population += population;
                    acc.confirmed += confirmed;
                    acc.deaths += deaths;
                    acc.vaccinated += vaccinated;
                })
                if (e[0] != 'undefined') {
                    arrRate.push({
                        "continent": e[0],
                        "confirmed": acc.confirmed / acc.population,
                        "deaths": acc.deaths / acc.population,
                        "vaccinated": acc.vaccinated / acc.population
                    });
                }
            });
        return arrRate;
    }

    /* HISTORICAL REQUEST */

    async getHistoryStatistics(from, to) {
        this.#validateInputDates(from, to);

        const fromDate = this.#setFromDate(from, to)
        const toDate = convertDate(getPreviousDay(to)); // To is excluded parameter
        const data = await this.#dataProvider.getHistoryData();
        const confirmed = data.confirmed;
        const death = data.death;
        const objVaccines = await this.#dataProvider.getVaccinesData();
        const arrCases = [];

        for (const key in confirmed) {
            if (confirmed.hasOwnProperty(key)) {
                const statCase = await this.#createStatCase(confirmed[key], death[key],objVaccines[key], fromDate, toDate);
                if (statCase != null) arrCases.push(statCase);
            }
        }
        this.#dataHistoryAll = arrCases;
        return arrCases;
    }

    async #createStatCase(confirmedData, deathData,objVaccines, from, to) {
        const country = confirmedData.All.country;
        if (country != undefined) {
            const population = confirmedData.All.population;
            const iso = confirmedData.All.abbreviation;
            const confirmed = this.#parseDatesData(confirmedData.All.dates, population, from, to);
            const death = this.#parseDatesData(deathData.All.dates, population, from, to);
            const vaccinated = objVaccines != undefined ? objVaccines.All.people_vaccinated : 0;
            const statCaseDataObject = createStatDataObject(iso, country, confirmed.percent, death.percent, vaccinated / population, confirmed.amount, death.amount, vaccinated);
            return statCaseDataObject;
        }
    }

    #parseDatesData(data, population, from, to) {
        const count = data[to] - data[from];
        return { percent: count / population, amount: count };
    }

    #validateInputDates(from, to) {
        if (from == undefined || to == undefined) throw new Error("Both dates must be specified for a historical request.");
        if (from >= to) throw new Error("From date can't be equal or higher than To date.");
        if (from < new Date('2020-01-22T00:00:00')) { throw new Error("There is no data on the epidemic earlier than 01/22/2020.") };
        const currentDay = removeTime(new Date()).getTime();
        if (removeTime(from).getTime() > currentDay || removeTime(to).getTime() > currentDay) throw new Error("Historical requests for the future are not available.");
    }

    // Correct the interval if the period is set to one day
    #setFromDate(from, to) {
        const checkTo = getPreviousDay(to);
        const checkFrom = removeTime(from);
        if (checkTo.getTime() === checkFrom.getTime()) {
            return convertDate(getPreviousDay(from));
        } else {
            return convertDate(from);
        }
    }    

    /* HISTORICAL REQUEST BY COUNTRIES */

    async getHistoryStatisticsByCountries(countries, from, to) {
        const allData = await this.getHistoryStatistics(from, to)
        return _.filter(allData, function (o) { return countries.includes(o.country); });
    }

    sort(key) {
        return _.sortBy(this.#dataHistoryAll, key);
    }


}