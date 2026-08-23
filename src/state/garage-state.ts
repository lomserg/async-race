import type { Car } from "../types/car";

export interface GarageState {
  cars: Car[];
  editingCarId: number | undefined;
  currentPage: number;
  raceStarted: boolean;
  winner: string | undefined;
}

export const garageState: GarageState = {
  cars: [],
  editingCarId: undefined,
  currentPage: 1,
  raceStarted: false,
  winner: undefined,
};
