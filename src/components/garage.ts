import type { Car } from "../types/car";
import { renderCarForm } from "./car-form";
export function renderGarage(cars: Car[]): string {
  const carsMarkup = cars
    .map(
      (car) => `
            <article class="car" data-car-id="${car.id}">
                <h2>${car.name}</h2>

                <div
                    class="car-color"
                    style="background-color: ${car.color}"
                ></div>

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
            </article>
        `,
    )
    .join("");

  return `
        <section class="garage">
            <h1>Garage</h1>

            ${renderCarForm()}

            <p>Cars: ${cars.length}</p>

            <div class="cars">
                ${carsMarkup}
            </div>
        </section>
    `;
}
