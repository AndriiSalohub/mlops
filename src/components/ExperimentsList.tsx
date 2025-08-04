import { useEffect, useState } from "react";
import { useExperimentsStore } from "@/store/experimentsStore";
import type { ExperimentData } from "@/types/experiment.types";
import ExperimentMetricsItem from "./ExperimentsListItem";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const ExperimentMetricsList = () => {
  const { experiments } = useExperimentsStore();
  const [metricsByExperiment, setMetricsByExperiment] = useState<
    Map<string, Set<string>>
  >(new Map());

  useEffect(() => {
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

    setMetricsByExperiment(experimentMetricsMap);
  }, [experiments]);

  return (
    <section className="mt-4 p-4 border-2 border-dashed rounded-sm">
      <div className="flex justify-between">
        <p className="text-2xl font-semibold mb-2">Experiment Metrics</p>
        <Button className="cursor-pointer">Select All</Button>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input placeholder="Search experiments..." className="pl-8" />
      </div>
      <ul className="flex flex-col gap-4 max-h-64 overflow-y-auto">
        {Array.from(metricsByExperiment.entries()).map(([expId, metrics]) => (
          <ExperimentMetricsItem experimentId={expId} metrics={metrics} />
        ))}
      </ul>
    </section>
  );
};

export default ExperimentMetricsList;
