export default class DashboardHandler {

    #dashboard;
    #conventions;

    constructor(dashboardId, conventionsId) {
        this.#dashboard = document.getElementById(dashboardId);
        this.#conventions = document.getElementById(conventionsId);
        if (!this.#dashboard) throw new Error(`Wrong dashboard ID (${dashboardId})`);
        if (!this.#conventions) throw new Error(`Wrong conventions ID (${conventionsId})`);
    }

    clear() {
        this.#dashboard.innerHTML = '';
        this.#conventions.innerHTML = '';
    }

    addEntry(data, color) {
        this.#dashboard.innerHTML += `
        <div class="col-md-5 rounded rounded-3 me-2 mb-2" style="background-color: ${color};">
              <ul class="list-unstyled pt-3 ps-2">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold"> ${data.continent}</span></li>
                <li><i class="bi bi-check-circle"></i> ${data.confirmed.toFixed(5)}% <span style="font-size: small;">(${data.confirmedAmount.toLocaleString("en")} people)</span></li> 
                <li><i class="bi bi-emoji-dizzy"></i> ${data.deaths.toFixed(5)}% <span style="font-size: small;">(${data.deathsAmount.toLocaleString("en")} people)</span></li> 
                <li><i class="bi bi-shield-shaded"></i> ${data.vaccinated.toFixed(5)}% <span style="font-size: small;">(${data.vaccinatedAmount.toLocaleString("en")} people)</span></li> 
              </ul>
            </div>
        `
    }

    addConventions() {
        this.#conventions.innerHTML = `
        <ul class="list-unstyled list-inline small text-center">
              <li class="list-inline-item"><i class="bi bi-check-circle"></i> Confirmed cases rate.</li>
              <li class="list-inline-item"><i class="bi bi-emoji-dizzy"></i> Death rate.</li>
              <li class="list-inline-item"><i class="bi bi-shield-shaded"></i></i> Rate of people vaccinated.</li>
            </ul>
        `
    }

    
}