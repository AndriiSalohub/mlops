import type { ExperimentData } from "@/types/experiment.types";
import { create } from "zustand";

interface ExperimentsStore {
  experiments: ExperimentData[];
  uploadExperiments: (experiments: ExperimentData[]) => void;
}

export const useExperimentsStore = create<ExperimentsStore>((set) => ({
  experiments: [],
  uploadExperiments: (experiments) => set({ experiments }),
}));
