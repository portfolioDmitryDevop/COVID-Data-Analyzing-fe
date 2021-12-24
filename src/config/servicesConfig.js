import MMediaAPI from "../services/m-mediaAPI";
const url = "https://covid-api.mmediagroup.fr/v1/cases";
export const dataProvider = new MMediaAPI(url);