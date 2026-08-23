import type { Car } from "../types/car";

export interface GarageState {
  cars: Car[];
  editingCarId: number | undefined;
}

export const garageState: GarageState = {
  cars: [],
  editingCarId: undefined,
};
