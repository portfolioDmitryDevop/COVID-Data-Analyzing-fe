import _ from "lodash";
import createStatDataObject from "../models/StatCase";
import { convertDate, getPreviousDay, removeTime } from "../utilities/extensions";

export default class DataProcessor {

    #dataProvider;
    #dataHistoryAll;
    #dataHistoryCountry;
    #tableSort = [];
    #useRates;

    constructor(dataProvider, useRates) {
        this.#dataProvider = dataProvider;
        this.#useRates = useRates;
    }

    /* STAT BY CONTINENT REQUEST */

    async getStatisticsContinents() {
        const objCases = this.#parseObjCases(await this.#dataProvider.getCasesData());
        const objVaccines = this.#parseObjVaccines(await this.#dataProvider.getVaccinesData());
        let objCasesVaccines = _.merge(objCases, objVaccines);
        objCasesVaccines = _.values(objCasesVaccines);
        objCasesVaccines =_.filter(objCasesVaccines, (p) => p.continent!=undefined);
        const objContinent = _.groupBy(objCasesVaccines, (e) => e.continent);
        const objContinentAmount = this.#getObjContinentAmount(objContinent);
        const res = this.#getArrRate(objContinentAmount);
        return res;
    }

    #parseObjCases(obj) {
        return _.mapValues(obj, (e) => {
            return { country: e.country, confirmed: e.confirmed, deaths: e.deaths, population: e.population, continent: e.continent };
        });
    }

    #parseObjVaccines(obj) {
        return _.mapValues(obj, (e) => {
            return { country: e.country, vaccinated: e.people_vaccinated, population: e.population };
        });
    }

    #getArrRate(objContinentAmount) {
        return _.map(objContinentAmount, (e) => {
            const deaths = e.deathsAmount / e.population * 100;
            const confirmed = e.confirmedAmount / e.population * 100;
            const vaccinated = e.vaccinatedAmount / e.population * 100;
            const objRate = { deaths: deaths, confirmed: confirmed, vaccinated: vaccinated, continent: undefined };
            return _.merge(objRate, e);
        })
    }

    #getObjContinentAmount(objContinent) {
        for (const key in objContinent) {
            objContinent[key] = _.reduce(objContinent[key], (r, v) => {
                return {
                    deathsAmount: (v.deaths = v.deaths != undefined ? v.deaths : 0) + r.deathsAmount,
                    confirmedAmount: (v.confirmed = v.confirmed != undefined ? v.confirmed : 0) + r.confirmedAmount,
                    population: (v.population = v.population != undefined ? v.population : 0) + r.population,
                    vaccinatedAmount: (v.vaccinated = v.vaccinated != undefined ? v.vaccinated : 0) + r.vaccinatedAmount,
                    continent: v.continent
                }
                }, { population: 0, deathsAmount: 0, confirmedAmount: 0, vaccinatedAmount: 0}
            );
        }
        return objContinent;
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
                const statCase = await this.#createStatCase(confirmed[key], death[key], objVaccines[key], fromDate, toDate);
                if (statCase != null) arrCases.push(statCase);
            }
        }
        this.#dataHistoryAll = _.sortBy(arrCases, "deaths").reverse();
        return this.#dataHistoryAll;
    }

    async #createStatCase(confirmedData, deathData, objVaccines, from, to) {
        const country = confirmedData.All.country;
        try {
            if (!this.#validateStatCase(confirmedData, objVaccines)) {
                return;
            }
        } catch (error) {
            return;
        }

        if (country != undefined && objVaccines != undefined) {
            const population = confirmedData.All.population;
            const iso = confirmedData.All.abbreviation;
            const confirmed = this.#parseDatesData(confirmedData.All.dates, population, from, to);
            const death = this.#parseDatesData(deathData.All.dates, population, from, to);
            const vaccinated = objVaccines != undefined ? objVaccines.All.people_vaccinated : 0;
            // const statCaseDataObject = createStatDataObject(iso, country, confirmed.rate, death.rate, vaccinated / population, confirmed.amount, death.amount, vaccinated);
            const statCaseDataObject = createStatDataObject(iso,
                country,
                this.#useRates ? confirmed.amount : confirmed.rate,
                this.#useRates ? death.amount : death.rate,
                vaccinated / population,
                this.#useRates ? confirmed.rate : confirmed.amount,
                this.#useRates ? death.rate : death.amount,
                this.#useRates ? vaccinated / population : vaccinated);
            // return {iso, country, confirmedRate, deathsRate, vaccinatedRate, confirmed, deaths, vaccinated};

            return statCaseDataObject;
        }

    }

    #validateStatCase(confirmedData, objVaccines) {
        return objVaccines != undefined &&
            confirmedData != undefined &&
            objVaccines.All != undefined &&
            confirmedData.All != undefined &&
            confirmedData.All.population != 0 &&
            objVaccines.All.people_vaccinated != 0;
    }

    #parseDatesData(data, population, from, to) {
        const count = data[to] - data[from];
        return { rate: count / population, amount: count };
    }

    #validateInputDates(from, to) {
        if (from == undefined || to == undefined) throw 'Both dates must be specified for a historical request';
        if (from >= to) throw "From date can't be equal or higher than To date";
        if (from < new Date('2020-01-22T00:00:00')) { throw 'There is no data on the epidemic earlier than 01/22/2020' };
        const currentDay = removeTime(new Date()).getTime();
        if (removeTime(from).getTime() > currentDay || removeTime(to).getTime() > currentDay) throw 'Historical requests for the future are not available';
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
        this.#dataHistoryCountry = _.filter(allData, function (o) { return countries.includes(o.country); });
        return this.#dataHistoryCountry;
    }

    sort(key, headerId, count) {
        if (this.#tableSort[headerId] == undefined) {
            this.#tableSort[headerId] = { country: true, confirmed: true, deaths: true, vaccinated: true };
        }
        let arr = [];
        arr.length;

        let data;
        if (headerId == "stat-header") {
            data = this.#dataHistoryCountry;
        } else {
            data = this.#dataHistoryAll;
        }

        if (count == undefined || count == "") {
            count = data.length;
        }

        switch (key) {

            case "country": {

                if (this.#isReverseSort(key, this.#tableSort[headerId])) {
                    return _.sortBy(data, key).slice(0, count);
                } else {
                    return _.sortBy(data, key).reverse().slice(0, count);
                }
            }
            case "confirmed": {
                if (this.#isReverseSort(key, this.#tableSort[headerId])) {
                    const res = _.sortBy(data, "confirmed");
                    return res.slice(0, count);
                } else {
                    const res = _.sortBy(data, "confirmed").reverse();
                    return res.slice(0, count);
                }
            }
            case "deaths": {

                if (this.#isReverseSort(key, this.#tableSort[headerId])) {
                    const res = _.sortBy(data, "deaths");
                    return res.slice(0, count);
                } else {
                    const res = _.sortBy(data, "deaths").reverse();
                    return res.slice(0, count);
                }
            }
            case "vaccinated": {

                if (this.#isReverseSort(key, this.#tableSort[headerId])) {
                    const res = _.sortBy(data, "vaccinated");
                    return res.slice(0, count);
                } else {
                    const res = _.sortBy(data, "vaccinated").reverse();
                    return res.slice(0, count);
                }
            }

            default:
                break;
        }

    }
    #isReverseSort(key, sortFlag) {
        const res = sortFlag[key];
        sortFlag[key] = !sortFlag[key];
        return res;
    }


}