import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css"
import DataProcessor from "./services/dataProcessor";
import Spinner from "./ui-ux/spinner";
import { dataProvider } from "./config/servicesConfig";
import TableHandler from "./ui-ux/table-handler";
import Navigator from "./ui-ux/navigator";
import config from "./config/config.json";

// Creating required objects
const dataProcessor = new DataProcessor(dataProvider, config);
const spinner = new Spinner("spinner");
const navigator = new Navigator('nav-tab');
const mainTableHandler = new TableHandler(undefined, 'main-body', 
    ['continent', 'confirmed', 'deaths', 'vaccinated']);

/***** FUNCTIONS *****/
// const res = dataProcessor.getStatisticsContinents();
// res.then((element) => console.log(element));
async function poller() {
    const continentsData = await dataProcessor.getStatisticsContinents();
    fillMainTable(continentsData);
    fillMapData(continentsData);
}
function fillMainTable(continentsArr) {
    mainTableHandler.clear();
    continentsArr.forEach(c => {
        const color = config.continentColors[c.continent.toLowerCase()];
        mainTableHandler.addRowColored(c, color);
    });
}
function fillMapData(continentsArr) {

}

async function fillHistroryTableAll(){
    const res = await dataProcessor.getHistoryStatistics(new Date("2021-12-24"),new Date("2021-12-25"));
    console.log(res);
}
/***** ACTIONS *****/

spinner.wait(async () => {
    const continentsData = await dataProcessor.getStatisticsContinents();
    fillMainTable(continentsData);
    fillMapData(continentsData);
});
setInterval(poller, config.pollingIntervalInSeconds * 1000);

fillHistroryTableAll();

