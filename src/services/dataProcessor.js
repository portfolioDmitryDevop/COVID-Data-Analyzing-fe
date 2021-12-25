import _ from "lodash";
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

        // If the second date is not specified - use the previous day
        const fromDate = convertDate(from);
        const toDate = to != undefined ? convertDate(to) : convertDate(getPreviousDay(from));
        const data = await this.#dataProvider.getHistoryData();
        const confirmed = data.confirmed;
        const death = data.death;

        const arrCases = []; 

        for (const key in confirmed) {
            if (confirmed.hasOwnProperty(key)) {
                const statCase = this.#createStatCase(confirmed[key], death[key], fromDate, toDate);
                if (statCase != null) arrCases.push(statCase);
            }
        }

        return arrCases;
    }

    #createStatCase(confirmedData, deathData, from, to) {
        const population = confirmedData.All.population;
        const iso = confirmedData.All.abbreviation;
        const country = confirmedData.All.country;
        const confirmedDates = this.#parseDatesData(confirmedData.All.dates, population, from, to);
        const deathDates = this.#parseDatesData(deathData.All.dates, population, from, to);
        
        if (country != undefined) {
            const statCase = this.#createStatCase(iso, country, confirmedDates, deathDates, from, to);
            console.log(statCase);
            return statCase
        }
    }

    #parseDatesData(data, population, from, to) {
        const first = this.#findTheNearestDate(data, from);
        const second = this.#findTheNearestDate(data, to);
        return (second - first) / population;
    }

    #findTheNearestDate(data, date) {
        let count = data[date];
        if (count == undefined) {
            let prevDay = getPreviousDay(date);
            while (count == undefined) {
                count = data[prevDay];
                getPreviousDay(date);
            }
        }
        return count;
    }

    #validateInputDates(from, to) {
        if (from == undefined) throw new Error("At least one date must be specified for a historical request.");
        if (removeTime(from).getTime() == removeTime(new Date()).getTime()) throw new Error("History request for today is not available.");
        if (to != undefined) if (from >= to) throw new Error("From date can't be equal or higher than To date.");
    }


}