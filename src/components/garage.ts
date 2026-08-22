import type { Car } from "../types/car";

export function renderGarage(cars: Car[]): string {
  const carsMarkup = cars
    .map(
      (car) => `
                <article class="car">
                    <h2>${car.name}</h2>
                    <p>ID: ${car.id}</p>
                    <div
                        class="car-color"
                        style="background-color: ${car.color}"
                    ></div>
                </article>
            `,
    )
    .join("");

  return `
        <section class="garage">
            <h1>Garage</h1>
            <p>Cars: ${cars.length}</p>

            <div class="cars">
                ${carsMarkup}
            </div>
        </section>
    `;
}
