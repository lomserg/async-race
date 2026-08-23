import type { Car } from "../types/car";
import { renderCarForm } from "./car-form";

const CARS_PER_PAGE = 7;

function getPageCars(cars: Car[], page: number): Car[] {
  const startIndex = (page - 1) * CARS_PER_PAGE;

  return cars.slice(startIndex, startIndex + CARS_PER_PAGE);
}

export function renderGarage(cars: Car[], currentPage: number): string {
  const pageCars = getPageCars(cars, currentPage);
  const totalPages = Math.ceil(cars.length / CARS_PER_PAGE);

  const carsMarkup = pageCars
    .map(
      (car) => `
        <article class="car-card">
          <h2>${car.name}</h2>

      <div class="car-track">
  <div
    class="car"
    data-car-id="${car.id}"
    style="color: ${car.color}"
  >
    🚗
  </div>
</div>

          <div class="car-controls">
            <button
              type="button"
              class="start-engine"
              data-id="${car.id}"
            >
              Start
            </button>

            <button
              type="button"
              class="stop-engine"
              data-id="${car.id}"
              disabled
            >
              Stop
            </button>

            <button
              type="button"
              class="update-car"
              data-id="${car.id}"
            >
              Update
            </button>

            <button
              type="button"
              class="delete-car"
              data-id="${car.id}"
            >
              Delete
            </button>
          </div>
        </article>
      `,
    )
    .join("");

  return `
    <section class="garage">
      <h1>Garage</h1>

      ${renderCarForm()}

      <button
        type="button"
        id="generate-cars"
      >
        Generate 100 cars
      </button>
<div class="race-controls">
  <button type="button" id="start-race">
    🏁 Start Race
  </button>

  <button type="button" id="reset-race">
    🔄 Reset Race
  </button>

  <button type="button" id="show-winner">
    🏆 Winner
  </button>
</div>

<p id="race-winner"></p>
      <p>Cars: ${cars.length}</p>

      <div class="cars">
        ${carsMarkup}
      </div>

      <div class="pagination">
        <button
          type="button"
          id="prev-page"
          ${currentPage === 1 ? "disabled" : ""}
        >
          Previous
        </button>

        <span>
          Page ${currentPage} / ${totalPages}
        </span>

        <button
          type="button"
          id="next-page"
          ${currentPage === totalPages ? "disabled" : ""}
        >
          Next
        </button>
      </div>
    </section>
  `;
}
