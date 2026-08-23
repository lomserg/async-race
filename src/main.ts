import "./styles.css";

import {
  createCar,
  deleteCar,
  driveCar,
  getCars,
  startEngine,
  stopEngine,
  updateCar,
} from "./api/cars-api";
import { animateCar, stopAnimation } from "./utils/car-animation";
import { renderGarage } from "./components/garage";
import { garageState } from "./state/garage-state";
import { generateCarData } from "./utils/car-generator";

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

    app.innerHTML = renderGarage(cars, garageState.currentPage);
    const generateButton =
      document.querySelector<HTMLButtonElement>("#generate-cars");

    if (!generateButton) {
      throw new Error("Generate button not found");
    }
    const startRaceButton =
      document.querySelector<HTMLButtonElement>("#start-race");

    const resetRaceButton =
      document.querySelector<HTMLButtonElement>("#reset-race");

    const winnerButton =
      document.querySelector<HTMLButtonElement>("#show-winner");

    const winnerElement =
      document.querySelector<HTMLParagraphElement>("#race-winner");

    if (
      !generateButton ||
      !startRaceButton ||
      !resetRaceButton ||
      !winnerButton ||
      !winnerElement
    ) {
      throw new Error("Race elements not found");
    }
    generateButton.addEventListener("click", async () => {
      for (let index = 0; index < 100; index += 1) {
        const car = generateCarData();

        await createCar(car.name, car.color);
      }

      await render();
    });

    startRaceButton.addEventListener("click", async () => {
      if (garageState.raceStarted) {
        return;
      }

      garageState.raceStarted = true;
      garageState.winner = undefined;
      winnerElement.textContent = "";

      startRaceButton.disabled = true;

      const pageCars = cars.slice(
        (garageState.currentPage - 1) * 7,
        garageState.currentPage * 7,
      );

      const racePromises = pageCars.map(async (car) => {
        const carElement = document.querySelector<HTMLElement>(
          `.car[data-car-id="${car.id}"]`,
        );

        const track = carElement?.parentElement;

        if (!carElement || !track) {
          throw new Error("Car elements not found");
        }

        const result = await startEngine(car.id);

        const availableDistance = track.clientWidth - carElement.offsetWidth;

        const duration = result.distance / result.velocity;

        return new Promise<string>((resolve) => {
          animateCar(carElement, availableDistance, duration, () => {
            resolve(car.name);
          });
        });
      });

      const winner = await Promise.race(racePromises);

      garageState.winner = winner;
      garageState.raceStarted = false;

      winnerElement.textContent = `🏆 Winner: ${winner}`;

      startRaceButton.disabled = false;
    });

    resetRaceButton.addEventListener("click", async () => {
      garageState.raceStarted = false;
      garageState.winner = undefined;

      const carElements = document.querySelectorAll<HTMLElement>(".car");

      for (const carElement of carElements) {
        stopAnimation(carElement);
        carElement.style.transform = "translateX(0)";

        const idValue = carElement.dataset.carId;

        if (!idValue) {
          continue;
        }

        try {
          await stopEngine(Number(idValue));
        } catch {
          // Двигатель мог уже остановиться.
        }
      }

      winnerElement.textContent = "";
      startRaceButton.disabled = false;
    });

    winnerButton.addEventListener("click", () => {
      if (!garageState.winner) {
        winnerElement.textContent = "🏆 Race hasn't started yet";
        return;
      }

      winnerElement.textContent = `🏆 Winner: ${garageState.winner}`;
    });

    const previousButton =
      document.querySelector<HTMLButtonElement>("#prev-page");

    const nextButton = document.querySelector<HTMLButtonElement>("#next-page");

    if (!previousButton || !nextButton) {
      throw new Error("Pagination buttons not found");
    }

    previousButton.addEventListener("click", async () => {
      garageState.currentPage -= 1;
      await render();
    });

    nextButton.addEventListener("click", async () => {
      garageState.currentPage += 1;
      await render();
    });
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
    const startButtons =
      document.querySelectorAll<HTMLButtonElement>(".start-engine");

    for (const button of startButtons) {
      button.addEventListener("click", async () => {
        const idValue = button.dataset.id;

        if (!idValue) {
          throw new TypeError("Car ID not found");
        }

        const id = Number(idValue);

        const carElement = document.querySelector<HTMLElement>(
          `.car[data-car-id="${id}"]`,
        );

        const track = carElement?.parentElement;

        const stopButton = document.querySelector<HTMLButtonElement>(
          `.stop-engine[data-id="${id}"]`,
        );

        if (!carElement || !track || !stopButton) {
          throw new TypeError("Car elements not found");
        }

        button.disabled = true;
        stopButton.disabled = false;

        const result = await startEngine(id);

        const availableDistance = track.clientWidth - carElement.offsetWidth;

        const duration = result.distance / result.velocity;

        animateCar(carElement, availableDistance, duration);

        try {
          await driveCar(id);
        } catch {
          // Сервер может вернуть 500 при поломке двигателя.
        }
      });
    }

    const stopButtons =
      document.querySelectorAll<HTMLButtonElement>(".stop-engine");

    for (const button of stopButtons) {
      button.addEventListener("click", async () => {
        const idValue = button.dataset.id;

        if (!idValue) {
          throw new TypeError("Car ID not found");
        }

        const id = Number(idValue);

        const carElement = document.querySelector<HTMLElement>(
          `.car[data-car-id="${id}"]`,
        );

        const startButton = document.querySelector<HTMLButtonElement>(
          `.start-engine[data-id="${id}"]`,
        );

        if (!carElement || !startButton) {
          throw new TypeError("Car elements not found");
        }

        stopAnimation(carElement);

        await stopEngine(id);

        carElement.style.transform = "translateX(0)";
        button.disabled = true;
        startButton.disabled = false;
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
