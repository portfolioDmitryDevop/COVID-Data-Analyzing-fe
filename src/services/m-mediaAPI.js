export default class MMediaAPI {

    #url;

    constructor(url) {
        if (!url) throw 'API URL is not specified.'
        this.#url = url;
    }

}