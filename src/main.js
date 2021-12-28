import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css"
import DataProcessor from "./services/dataProcessor";
import Spinner from "./ui-ux/spinner";
import { dataProvider } from "./config/servicesConfig";
import TableHandler from "./ui-ux/table-handler";
import config from "./config/config.json";
import FormHandler from "./ui-ux/form-handler";
import { convertDate } from "./utilities/extensions";
import DashboardHandler from "./ui-ux/dashboard-handler";
import _ from "lodash";

/***** !!! DO NOT TOUCH !!! *****/
FormHandler.fillCheckBoxes('countries-list', config.countriesList, 'countries');

/***** OBJECTS *****/
const firstObservationDay = '2020-01-22';
const dataProcessor = new DataProcessor(dataProvider, config.useRates);
const spinner = new Spinner("spinner");
const dashboard = new DashboardHandler('map', 'dashboard', 'conventions');
const historyTableHandler = new TableHandler('history-header', 'history-body',
    ['', 'country', 'confirmed', 'deaths', 'vaccinated'], historySort, config.useRates);
const statTableHandler = new TableHandler('stat-header', 'stat-body',
    ['', 'country', 'confirmed', 'deaths', 'vaccinated'], statSort, config.useRates);
const historyFormHandler = new FormHandler('history-form');
const statFormHandler = new FormHandler('stat-form');
let countCountry;
const alertEl = document.getElementById('alert');

/***** FUNCTIONS *****/
async function poller() {
    dashboard.showPlaceHolders();
    const continentsData = await dataProcessor.getStatisticsContinents();
    fillDashboard(continentsData);
}
function fillDashboard(continentsArr) {
    const worldStat = { confirmedAmount: 0, deathsAmount: 0, vaccinatedAmount: 0, population: 0 };
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

function fillHistTable(from, to, num) {    
    spinner.wait(async () => {
        historyTableHandler.clear();
        countCountry = num;
        let counter = 1;

        try {
            hideAlert(alertEl);
            let histArr = await dataProcessor.getHistoryStatistics(from, to);
            if (num == '' || num == undefined) {
                histArr.forEach(obj => {
                    historyTableHandler.addRowImPosition(obj, counter++);
                });
            } else {
                for (let i = 0; i < num; i++) {
                    historyTableHandler.addRowImPosition(histArr[i], counter++);
                }
            }
        }
        catch (error) {
            showAlert(alertEl, error);
        }

    });
    statTableHandler.repaintTableHendler('deaths', 'history-header', 'default');
}
function fillStatTable(from, to, countries) {
    statTableHandler.clear();    
    let counter = 1;
    spinner.wait(async () => {
        if (countries == undefined) {
            countries = config.countriesList;
        }
        try {
            hideAlert(alertEl);
            let statArr =
                await dataProcessor.getHistoryStatisticsByCountries(countries, from, to);
            statArr.forEach(obj => {
                statTableHandler.addRowImPosition(obj, counter++);
            });
        } catch (error) {
            showAlert(alertEl, error);
        }
    });
    statTableHandler.repaintTableHendler('deaths', 'stat-header', 'default');
}

function statSort(key, headerId){
    if (spinner.status()) return;
    statTableHandler.clear();
    historyTableHandler.repaintTableHendler(key, headerId);    
    spinner.wait(async () => {        
        let counter = 1;
        const sorted = dataProcessor.sort(key, headerId, countCountry);
        sorted.forEach(c => statTableHandler.addRowImPosition(c, counter++));
    })
}

function historySort(key, headerId){
    if (spinner.status()) return;
    historyTableHandler.clear();
    historyTableHandler.repaintTableHendler(key, headerId);    
    spinner.wait(async () => {        
        let counter = 1;
        const sorted = dataProcessor.sort(key, headerId, countCountry);
        sorted.forEach(c => historyTableHandler.addRowImPosition(c, counter++));
    })
}

async function firstLoad() {
    const continentsData = await dataProcessor.getStatisticsContinents();
    fillDashboard(continentsData);
    fillHistTable(new Date(firstObservationDay), new Date());
    fillStatTable(new Date(firstObservationDay), new Date());
}

window.checkboxSelector = async function (boolean) {
    const list = document.querySelectorAll("#countries-list [name]");
    for (let index = 0; index < list.length; index++) {
        list[index].checked = boolean == "true";
    }
}
function showAlert(alertElement, message) {
    alertElement.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>${message}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}
function hideAlert(alertElement) {
    alertElement.innerHTML = '';
}

/***** HANDLERS *****/
FormHandler.fillCalendarValues('dateFromHist', undefined, convertDate(new Date()));
FormHandler.fillCalendarValues('dateToHist', convertDate(new Date()), convertDate(new Date()));
FormHandler.fillCalendarValues('dateFromStat', undefined, convertDate(new Date()));
FormHandler.fillCalendarValues('dateToStat', convertDate(new Date()), convertDate(new Date()));

historyFormHandler.addHandler(async data =>
    fillHistTable(new Date(data.fromDate), new Date(data.toDate), data.countriesNum));
statFormHandler.addHandler(async data => {
    fillStatTable(new Date(data.fromDate), new Date(data.toDate), data.countries);
});


/***** ACTIONS *****/
firstLoad();
setInterval(poller, config.pollingIntervalInSeconds * 1000);