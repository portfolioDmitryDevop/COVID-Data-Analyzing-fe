export function setMapPlacholders(mapElement) {
    mapElement.innerHTML = `
    <!-- Placeholders -->
          <div class="northamerica">
            <div class="col-12 rounded rounded-3 bg-light shadow">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold" style="color: rgb(0, 204, 0);"> North
                    America</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-5"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-10"></span></li>
              </ul>
            </div>
          </div>
          <div class="europe">
            <div class="col-12 rounded rounded-3 bg-light shadow">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold" style="color: rgb(73, 163, 208);"> Europe</span>
                </li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-7"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-6"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-11"></span></li>
              </ul>
            </div>
          </div>
          <div class="southamerica">
            <div class="col-12 rounded rounded-3 bg-light shadow">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold" style="color: rgb(138, 99, 177);"> South
                    America</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-4"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-5"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-9"></span></li>
              </ul>
            </div>
          </div>
          <div class="asia">
            <div class="col-12 rounded rounded-3 bg-light shadow">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold" style="color: rgb(242, 127, 56);"> Asia</span>
                </li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-9"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-6"></span></li>
              </ul>
            </div>
          </div>
          <div class="africa">
            <div class="col-12 rounded rounded-3 bg-light shadow">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold" style="color: rgb(254, 213, 46);"> Africa</span>
                </li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-6"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-5"></span></li>
              </ul>
            </div>
          </div>
          <div class="oceania">
            <div class="col-12 rounded rounded-3 bg-light shadow">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold" style="color: rgb(192, 64, 128);"> Oceania</span>
                </li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-5"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-10"></span></li>
              </ul>
            </div>
          </div>
          <!-- End -->`
}

export function setDesctopPlacholders(dashboardElement) {
    dashboardElement.innerHTML = `
    <!-- Placeholders -->
            <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow" style="background-color: rgb(242, 127, 56);">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold"> Asia</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-9"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-6"></span></li>
              </ul>
            </div>

            <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow" style="background-color: rgb(73, 163, 208);">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold"> Europe</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-7"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-6"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-10"></span></li>
              </ul>
            </div>

            <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow" style="background-color: rgb(254, 213, 46);">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold""> Africa</span></li>
                <li><i class=" bi bi-check-circle"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-6"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-5"></span></li>
              </ul>
            </div>

            <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow" style="background-color: rgb(0, 204, 0);">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold"> North America</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-5"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-10"></span></li>
              </ul>
            </div>

            <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow" style="background-color: rgb(138, 99, 177);">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold"> South America</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-4"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-5"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-9"></span></li>
              </ul>
            </div>

            <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow" style="background-color: rgb(192, 64, 128);">
              <ul class="list-unstyled p-3 text-start placeholder-glow">
                <li><i class="bi bi-geo-alt"></i><span class="fw-bold"> Oceania</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-8"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-5"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-10"></span></li>
              </ul>
            </div>

            <div class="col-md-5 rounded rounded-3 me-2 mb-2 shadow bg-info">
              <ul class="list-unstyled pt-3 ps-2 text-start placeholder-glow">
                <li><i class="bi bi bi-globe"></i><span class="fw-bold"> World</span></li>
                <li><i class="bi bi-check-circle"></i> <span class="placeholder col-6"></span></li>
                <li><i class="bi bi-emoji-dizzy"></i> <span class="placeholder col-2"></span></li>
                <li><i class="bi bi-shield-shaded"></i> <span class="placeholder col-10"></span></li>
              </ul>
            </div>
            <div class="col-md-5 rounded rounded-3 me-2 mb-2"></div>
            <!-- End -->
            `
}