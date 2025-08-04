import type { ExperimentData } from "@/types/experiment.types";
import { create } from "zustand";

interface ExperimentsStore {
  experiments: ExperimentData[];
  metricsByExperiment: Map<string, Set<string>>;
  uploadExperiments: (experiments: ExperimentData[]) => void;
  selectedExperiments: Set<string>;
  selectedMetrics: Set<string>;
  selectExperiment: (experimentId: string, isSelected: boolean) => void;
  selectMetric: (metric: string, isSelected: boolean) => void;
  selectAll: (experimentIds: string[]) => void;
  deselectAll: () => void;
  metrics: Set<string>;
}

export const useExperimentsStore = create<ExperimentsStore>((set) => ({
  experiments: [],
  metricsByExperiment: new Map(),
  selectedExperiments: new Set(),
  selectedMetrics: new Set(),
  metrics: new Set(),
  uploadExperiments: (experiments) => {
    const experimentMetricsMap = new Map<string, Set<string>>();

    experiments.forEach((experiment: ExperimentData) => {
      if (!experiment.experiment_id || !experiment.metric_name) {
        console.warn("Skipping invalid experiment:", experiment);
        return;
      }
      if (!experimentMetricsMap.has(experiment.experiment_id)) {
        experimentMetricsMap.set(experiment.experiment_id, new Set());
      }
      experimentMetricsMap
        .get(experiment.experiment_id)!
        .add(experiment.metric_name);
    });

    set({ experiments, metricsByExperiment: experimentMetricsMap });
  },
  selectExperiment: (experimentId, isSelected) => {
    set((state) => {
      const newSelected = new Set(state.selectedExperiments);
      if (isSelected) {
        newSelected.add(experimentId);
      } else {
        newSelected.delete(experimentId);
      }

      const selectedMetrics = new Set<string>();
      newSelected.forEach((id) => {
        const experimentMetrics = state.metricsByExperiment.get(id);
        if (experimentMetrics) {
          experimentMetrics.forEach((metric) => selectedMetrics.add(metric));
        }
      });

      return { selectedExperiments: newSelected, metrics: selectedMetrics };
    });
  },
  selectMetric: (metric, isSelected) => {
    set((state) => {
      const newSelectedMetrics = new Set(state.selectedMetrics);
      if (isSelected) {
        newSelectedMetrics.add(metric);
      } else {
        newSelectedMetrics.delete(metric);
      }

      return { selectedMetrics: newSelectedMetrics };
    });
  },
  selectAll: (experimentIds) => {
    set((state) => {
      const newSelected = new Set(state.selectedExperiments);
      experimentIds.forEach((id) => newSelected.add(id));

      const selectedMetrics = new Set<string>();
      newSelected.forEach((id) => {
        const experimentMetrics = state.metricsByExperiment.get(id);
        if (experimentMetrics) {
          experimentMetrics.forEach((metric) => selectedMetrics.add(metric));
        }
      });

      return { selectedExperiments: newSelected, metrics: selectedMetrics };
    });
  },
  deselectAll: () => {
    set(() => ({
      selectedExperiments: new Set(),
      metrics: new Set(),
    }));
  },
}));
