import { getCars } from "./api/cars-api";

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

  app.innerHTML = `
        <h1>Async Race</h1>
        <p>Cars: ${cars.length}</p>
    `;
}

await init();
