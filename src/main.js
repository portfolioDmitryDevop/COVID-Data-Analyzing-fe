import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css"
import DataProcessor from "./services/dataProcessor";
import Spinner from "./ui-ux/spinner";
import { dataProvider } from "./config/servicesConfig";
import TableHandler from "./ui-ux/table-handler";
import config from "./config/config.json";
import FormHandler from "./ui-ux/form-handler";
import { objToExponential, convertDate } from "./utilities/extensions";
import DashboardHandler from "./ui-ux/dashboard-handler";
import _ from "lodash";

/***** !!! DO NOT TOUCH !!! *****/
FormHandler.fillCheckBoxes('countries-list', config.countriesList, 'countries');

/***** OBJECTS *****/
const firstObservationDay = '2020-01-22';
const dataProcessor = new DataProcessor(dataProvider, config);
const spinner = new Spinner("spinner");
const dashboard = new DashboardHandler('map','dashboard', 'conventions');
const historyTableHandler = new TableHandler('history-header', 'history-body',
    ['', 'country', 'confirmed', 'deaths', 'vaccinated'], historySort);
const statTableHandler = new TableHandler('stat-header', 'stat-body',
    ['','country', 'confirmed', 'deaths', 'vaccinated'], statSort);
const historyFormHandler = new FormHandler('history-form', 'alert');
const statFormHandler = new FormHandler('stat-form', 'alert');
let countCountry;


/***** FUNCTIONS *****/
async function poller() {
    const continentsData = await dataProcessor.getStatisticsContinents();
    fillDashboard(continentsData);
    fillMapData(continentsData);
}
function fillDashboard(continentsArr) {
    const worldStat = {confirmedAmount: 0, deathsAmount: 0, vaccinatedAmount: 0, population: 0};
    dashboard.clear();
    continentsArr.forEach(data => {
        // Update Global World Stat Object
        worldStat.confirmedAmount += data.confirmedAmount;
        worldStat.deathsAmount += data.deathsAmount;
        worldStat.vaccinatedAmount += data.vaccinatedAmount;
        worldStat.population += data.population;

        // Add Continent Entry
        const color = config.continentColors[data.continent.toLowerCase()];
        dashboard.addEntry(data, color)
    });
    dashboard.addGlobalEntry(worldStat);
    dashboard.addConventions();
}
function fillMapData(continentsArr) {

}
function fillHistTable(from, to, num) {
    spinner.wait(async () => {
        historyTableHandler.clear();
        countCountry = num;
        let counter = 1;
        let histArr = await dataProcessor.getHistoryStatistics(from, to);
        if (num == '' || num == undefined) {
            histArr.forEach(obj => {
                historyTableHandler.addRowImPosition(objToExponential(obj), counter++);
            });
        } else {
            for (let i = 0; i < num; i++) {
                historyTableHandler.addRowImPosition(objToExponential(histArr[i]), counter++);
            }
        }
    });
}

function historySort(key, headerId){
    spinner.wait(async () => {
        historyTableHandler.clear();
        let counter = 1;
        const sorted = dataProcessor.sort(key, headerId, countCountry);
        sorted.forEach(c => historyTableHandler.addRowImPosition(c, counter++));
    })
}

function fillStatTable(from, to, countries) {
    statTableHandler.clear();
    spinner.wait(async () => {
        if (countries == undefined || countries.length == 0) {
            countries = config.countriesList;
        }
        let statArr = 
            await dataProcessor.getHistoryStatisticsByCountries(countries, from, to);
        statArr.forEach(obj => {
            statTableHandler.addRow(objToExponential(obj));
        })
    });
}

function statSort(key, headerId){
    spinner.wait(async () => {
        statTableHandler.clear();
        let counter = 1;
        const sorted = dataProcessor.sort(key, headerId, countCountry);
        sorted.forEach(c => statTableHandler.addRowImPosition(c, counter++));
    })
}

/***** ACTIONS *****/
spinner.wait(async () => {
    const continentsData = await dataProcessor.getStatisticsContinents();
    fillDashboard(continentsData);
    fillMapData(continentsData);
});
setInterval(poller, config.pollingIntervalInSeconds * 1000);

FormHandler.fillCalendarValues('dateFromHist', undefined, convertDate(new Date()));
FormHandler.fillCalendarValues('dateToHist', convertDate(new Date()), convertDate(new Date()));
FormHandler.fillCalendarValues('dateFromStat', undefined, convertDate(new Date()));
FormHandler.fillCalendarValues('dateToStat', convertDate(new Date()), convertDate(new Date()));

fillHistTable(new Date(firstObservationDay), new Date());
historyFormHandler.addHandler(data => 
    fillHistTable(new Date(data.fromDate), new Date(data.toDate), data.countriesNum));

fillStatTable(new Date(firstObservationDay), new Date());
statFormHandler.addHandler(data => {
    fillStatTable(new Date(data.fromDate), new Date(data.toDate), data.countries);
});
