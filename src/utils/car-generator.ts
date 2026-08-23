const CAR_BRANDS = [
  "Tesla",
  "Ford",
  "BMW",
  "Audi",
  "Toyota",
  "Honda",
  "Nissan",
  "Volvo",
  "Kia",
  "Lexus",
];

const CAR_MODELS = [
  "Model S",
  "Mustang",
  "X5",
  "A6",
  "Camry",
  "Civic",
  "GT-R",
  "XC90",
  "Sportage",
  "RX",
];

function getRandomItem(items: string[]): string {
  const index = Math.floor(Math.random() * items.length);

  return items[index];
}

function getRandomColor(): string {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
}

export function generateCarData(): {
  name: string;
  color: string;
} {
  return {
    name: `${getRandomItem(CAR_BRANDS)} ${getRandomItem(CAR_MODELS)}`,
    color: getRandomColor(),
  };
}
