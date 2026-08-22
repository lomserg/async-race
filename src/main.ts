import "./styles.css";
import { getCars } from "./api/cars-api";
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
  const cars = await getCars();

  app.innerHTML = renderGarage(cars);
}

await init();
