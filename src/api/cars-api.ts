import type { Car } from "../types/car";

const BASE_URL = "http://127.0.0.1:3000";
const GARAGE_URL = `${BASE_URL}/garage`;

async function checkResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response;
}

export async function getCars(): Promise<Car[]> {
  const response = await fetch(GARAGE_URL);

  await checkResponse(response);

  return response.json();
}
export async function createCar(name: string, color: string): Promise<Car> {
  const response = await fetch(GARAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      color,
    }),
  });

  await checkResponse(response);

  return response.json();
}

export async function updateCar(
  id: number,
  name: string,
  color: string,
): Promise<Car> {
  const response = await fetch(`${GARAGE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      color,
    }),
  });

  await checkResponse(response);

  return response.json();
}

export async function deleteCar(id: number): Promise<void> {
  const response = await fetch(`${GARAGE_URL}/${id}`, {
    method: "DELETE",
  });

  await checkResponse(response);
}
export interface EngineResponse {
  velocity: number;
  distance: number;
}

export async function startEngine(id: number): Promise<EngineResponse> {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, {
    method: "PATCH",
  });

  await checkResponse(response);

  return response.json();
}
export async function driveCar(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, {
    method: "PATCH",
  });

  await checkResponse(response);
}
export async function stopEngine(id: number): Promise<EngineResponse> {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=stopped`, {
    method: "PATCH",
  });

  await checkResponse(response);

  return response.json();
}
