import type { Car } from "../types/car";

export interface GarageState {
  cars: Car[];
  editingCarId: number | null;
}

export const garageState: GarageState = {
  cars: [],
  editingCarId: null,
};
