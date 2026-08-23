import type { Car } from "../types/car";

export interface GarageState {
  cars: Car[];
  editingCarId: number | undefined;
  currentPage: number;
}

export const garageState: GarageState = {
  cars: [],
  editingCarId: undefined,
  currentPage: 1,
};
