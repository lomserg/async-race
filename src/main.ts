import "./styles.css";

import { createCar, deleteCar, getCars, updateCar } from "./api/cars-api";
import { renderGarage } from "./components/garage";
import { garageState } from "./state/garage-state";

function getAppElement(): HTMLDivElement {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error("App root not found");
  }

  return app;
}

function getFormElements(): {
  nameInput: HTMLInputElement;
  colorInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  cancelButton: HTMLButtonElement;
} {
  const nameInput = document.querySelector<HTMLInputElement>("#car-name");
  const colorInput = document.querySelector<HTMLInputElement>("#car-color");
  const submitButton = document.querySelector<HTMLButtonElement>("#submit-car");
  const cancelButton =
    document.querySelector<HTMLButtonElement>("#cancel-edit");

  if (!nameInput || !colorInput || !submitButton || !cancelButton) {
    throw new Error("Form elements not found");
  }

  return {
    nameInput,
    colorInput,
    submitButton,
    cancelButton,
  };
}

async function init(): Promise<void> {
  const app = getAppElement();

  const render = async (): Promise<void> => {
    const cars = await getCars();

    garageState.cars = cars;

    app.innerHTML = renderGarage(cars);

    const deleteButtons =
      document.querySelectorAll<HTMLButtonElement>(".delete-car");

    for (const button of deleteButtons) {
      button.addEventListener("click", async () => {
        const idValue = button.dataset.id;

        if (!idValue) {
          throw new Error("Car ID not found");
        }

        await deleteCar(Number(idValue));
        await render();
      });
    }

    const updateButtons =
      document.querySelectorAll<HTMLButtonElement>(".update-car");

    for (const button of updateButtons) {
      button.addEventListener("click", () => {
        const idValue = button.dataset.id;

        if (!idValue) {
          throw new Error("Car ID not found");
        }

        const id = Number(idValue);
        const car = cars.find((item) => item.id === id);

        if (!car) {
          throw new Error("Car not found");
        }

        const { nameInput, colorInput, submitButton, cancelButton } =
          getFormElements();

        garageState.editingCarId = id;

        nameInput.value = car.name;
        colorInput.value = car.color;

        submitButton.textContent = "Update";
        cancelButton.hidden = false;
      });
    }

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
      if (garageState.editingCarId === undefined) {
        await createCar(name, color);
      } else {
        await updateCar(garageState.editingCarId, name, color);
        garageState.editingCarId = undefined;
      }
      await render();
    });
  };

  await render();
}

await init();
