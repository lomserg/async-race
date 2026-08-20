const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

app.innerHTML = `
    <h1>Async Race</h1>
`;
