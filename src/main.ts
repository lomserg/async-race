import "./styles.css";

import { createCar, getCars } from "./api/cars-api";
import { renderGarage } from "./components/garage";

function getAppElement(): HTMLDivElement {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("App root not found");
  }

  return app;
}

async function init(): Promise<void> {
  const app = getAppElement();

  const render = async (): Promise<void> => {
    const cars = await getCars();

    app.innerHTML = renderGarage(cars);

    const form = document.querySelector<HTMLFormElement>("#car-form");

    if (!form) {
      throw new Error("Car form not found");
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const name = formData.get("name");
      const color = formData.get("color");

      if (typeof name !== "string" || typeof color !== "string") {
        throw new TypeError("Invalid form data");
      }

      await createCar(name, color);

      await render();
    });
  };

  await render();
}

await init();
