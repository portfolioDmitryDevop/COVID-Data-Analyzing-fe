import _ from "lodash";

export default class DataProcessor {

    #dataProvider;

    constructor(dataProvider) {
        this.#dataProvider = dataProvider;
    }

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
            arrRate.push({ "continent":e[0],
                          "confirmed":e[1][0].confirmed/e[1][0].population,
                           "deaths":e[1][0].deaths/e[1][0].population,
                            "vaccinated":e[1][0].vaccinated/e[1][0].population});
        });
        return arrRate;
    }


}