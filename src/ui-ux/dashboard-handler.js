export default class DashboardHandler {

    #map;
    #dashboard;
    #conventions;

    constructor(mapId, dashboardId, conventionsId) {
        this.#map = document.getElementById(mapId);
        this.#dashboard = document.getElementById(dashboardId);
        this.#conventions = document.getElementById(conventionsId);
        if (!this.#map) throw new Error(`Wrong map ID (${mapId})`)
        if (!this.#dashboard) throw new Error(`Wrong dashboard ID (${dashboardId})`);
        if (!this.#conventions) throw new Error(`Wrong conventions ID (${conventionsId})`);
    }

    clear() {
        this.#map.innerHTML = '';
        this.#dashboard.innerHTML = '';
        this.#conventions.innerHTML = '';
    }

    addGlobalEntry(data) {
        this.#dashboard.innerHTML += `
        <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow bg-info">
              <ul class="list-unstyled pt-3 ps-2">
                <li><i class="bi bi bi-globe"></i><span class="fw-bold"> World</span></li>
                <li><i class="bi bi-check-circle"></i> ${data.confirmed.toFixed(3)}% <span style="font-size: small;">(${data.confirmedAmount.toLocaleString("en")} people)</span></li> 
                <li><i class="bi bi-emoji-dizzy"></i> ${data.deaths.toFixed(3)}% <span style="font-size: small;">(${data.deathsAmount.toLocaleString("en")} people)</span></li> 
                <li><i class="bi bi-shield-shaded"></i> ${data.vaccinated.toFixed(3)}% <span style="font-size: small;">(${data.vaccinatedAmount.toLocaleString("en")} people)</span></li> 
              </ul>
            </div>
            <div class="col-md-5 rounded rounded-3 me-2 mb-2"></div>
        `
    }

    addEntry(data, color) {
        const contName = data.continent;
        const confirmPr = data.confirmed.toFixed(3);
        const deathsPr = data.deaths.toFixed(3);
        const vaccinetedPr = data.vaccinated.toFixed(3);
        const confirmAm = data.confirmedAmount.toLocaleString("en")
        const deathsAm = data.deathsAmount.toLocaleString("en")
        const vaccineAm = data.vaccinatedAmount.toLocaleString("en")

        // Fill mobile view
        this.#dashboard.innerHTML += `
        <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow" style="background-color: ${color};">
              <ul class="list-unstyled pt-3 ps-2">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold"> ${contName}</span></li>
                <li><i class="bi bi-check-circle"></i> ${confirmPr}% <span style="font-size: small;">(${confirmAm} people)</span></li> 
                <li><i class="bi bi-emoji-dizzy"></i> ${deathsPr}% <span style="font-size: small;">(${deathsAm} people)</span></li> 
                <li><i class="bi bi-shield-shaded"></i> ${vaccinetedPr}% <span style="font-size: small;">(${vaccineAm} people)</span></li> 
              </ul>
            </div>
        `

        // Fill desctop view
        this.#map.innerHTML += `
        <div class="${contName.toLowerCase().replace(/\s/g, '')}">
            <div class="rounded rounded-3 bg-light shadow">
              <ul class="list-unstyled p-3 text-start">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold" style="color: ${color};"> ${contName}</span></li>
                <li><i class="bi bi-check-circle"></i> ${confirmPr}% <span style="font-size: small;">(${confirmAm} people)</span></li> 
                <li><i class="bi bi-emoji-dizzy"></i> ${deathsPr}% <span style="font-size: small;">(${deathsAm} people)</span></li> 
                <li><i class="bi bi-shield-shaded"></i> ${vaccinetedPr}% <span style="font-size: small;">(${vaccineAm} people)</span></li> 
              </ul>
            </div>
          </div>
        `
    }

    addConventions() {
        this.#conventions.innerHTML = `
        <ul class="list-unstyled list-inline small text-center pt-2">
              <li class="list-inline-item"><i class="bi bi-check-circle"></i> Confirmed cases rate.</li>
              <li class="list-inline-item"><i class="bi bi-emoji-dizzy"></i> Death rate.</li>
              <li class="list-inline-item"><i class="bi bi-shield-shaded"></i></i> Rate of people vaccinated.</li>
            </ul>
        `
    }

    
}