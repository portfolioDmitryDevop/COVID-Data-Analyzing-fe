import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css"
import DataProcessor from "./services/dataProcessor";
import Spinner from "./ui-ux/spinner";
import { dataProvider } from "./config/servicesConfig";

// Creating required objects
const dataProcessor = new DataProcessor(dataProvider);
const spinner = new Spinner("spinner");

/***** FUNCTIONS *****/

// Show/hide spinner
async function waitWithSpinner(awaitFunction) {
    spinner.start();
    try {
        const result = await awaitFunction();
        return result;
    } finally {
        spinner.stop()
        
    }
}

// const res = dataProcessor.getStatisticsContinents();
// res.then((element) => console.log(element));
const test = dataProcessor.getHistoryStatistics(new Date('2021-10-17T13:24:00'), new Date('2021-11-17T13:24:00'));
// const test = dataProcessor.getHistoryStatistics(new Date('2021-12-24T13:24:00'));
console.log(test);