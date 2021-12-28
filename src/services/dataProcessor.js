import _ from "lodash";
import createStatDataObject from "../models/StatCase";
import { convertDate, getPreviousDay, removeTime } from "../utilities/extensions";

export default class DataProcessor {

    #dataProvider;
    #config;
    #dataHistoryAll;
    #dataHistoryCountry;
    #tableSort = [];



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
        let arrMerge = _.merge(_.keyBy(arrCases, 'country'), _.keyBy(arrVaccines, 'country'));
        arrMerge = _.values(arrMerge);
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
                "vaccinated": objVaccines[key].All.people_vaccinated,
                "population": objVaccines[key].All.population
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
                        "confirmed": acc.confirmed / acc.population * 100,
                        "deaths": acc.deaths / acc.population * 100,
                        "vaccinated": acc.vaccinated / acc.population * 100,
                        "confirmedAmount": acc.confirmed,
                        "deathsAmount": acc.deaths,
                        "vaccinatedAmount": acc.vaccinated,
                        "population": acc.population
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
            if(!this.#validateStatCase(confirmedData, objVaccines)){
                return;
            }
        } catch (error) {
            return;
        }

        if (country != undefined && objVaccines != undefined ) {
            const population = confirmedData.All.population;
            const iso = confirmedData.All.abbreviation;
            const confirmed = this.#parseDatesData(confirmedData.All.dates, population, from, to);
            const death = this.#parseDatesData(deathData.All.dates, population, from, to);
            const vaccinated = objVaccines != undefined ? objVaccines.All.people_vaccinated : 0;
            const statCaseDataObject = createStatDataObject(iso, country, confirmed.rate, death.rate, vaccinated / population, confirmed.amount, death.amount, vaccinated);
                                                 // return {iso, country, confirmedRate, deathsRate, vaccinatedRate, confirmed, deaths, vaccinated};

            return statCaseDataObject;
        }

    }

    #validateStatCase(confirmedData, objVaccines){
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
        if(headerId == "stat-header"){
            data = this.#dataHistoryCountry;
        }   else {
            data = this.#dataHistoryAll;
        }

        if(count == undefined || count == "") {
            count = data.length;
        }

 
        switch (key) {

            case "country":{
                
                if (this.#isReverseSort(key, this.#tableSort[headerId])) {
                    return _.sortBy(data, key).slice(0, count);
                } else {
                    return _.sortBy(data, key).reverse().slice(0, count);
                }
            }
            case "confirmed":               {
                    if (this.#isReverseSort(key, this.#tableSort[headerId])) {
                        const res = _.sortBy(data, "confirmed");
                        return res.slice(0, count);
                    } else {
                        const res = _.sortBy(data, "confirmed").reverse();
                        return res.slice(0, count);
                    }
                }
            case "deaths":{
                 
                if (this.#isReverseSort(key, this.#tableSort[headerId])) {
                   const res = _.sortBy(data, "deaths");
                   return res.slice(0, count);
               } else {
                const res = _.sortBy(data, "deaths").reverse();
                   return res.slice(0, count);
               }
            }
            case "vaccinated":{
                
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