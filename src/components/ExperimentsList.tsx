import { useState, type ChangeEvent } from "react";
import { useExperimentsStore } from "@/store/experimentsStore";
import ExperimentMetricsItem from "./ExperimentsListItem";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const ExperimentMetricsList = () => {
  const {
    experiments,
    metricsByExperiment,
    selectedExperiments,
    selectExperiment,
    selectAll,
    deselectAll,
  } = useExperimentsStore();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredExperiments = Array.from(metricsByExperiment.entries()).filter(
    ([expId]) => expId.includes(searchTerm),
  );

  const handleSelectAll = () => {
    const allFilteredIds = filteredExperiments.map(([expId]) => expId);
    const allSelected = allFilteredIds.every((id) =>
      selectedExperiments.has(id),
    );

    if (allSelected) {
      deselectAll();
    } else {
      selectAll(allFilteredIds);
    }
  };

  const allFilteredSelected =
    filteredExperiments.length > 0 &&
    filteredExperiments.every(([expId]) => selectedExperiments.has(expId));

  return (
    <section className="mt-4 p-4 border-2 rounded-sm">
      {experiments.length === 0 ? (
        <h3 className="text-center text-slate-500">
          No experiments available.
        </h3>
      ) : (
        <>
          <div className="flex justify-between">
            <p className="text-2xl font-semibold mb-2">
              Experiment Metrics ({filteredExperiments.length})
            </p>
            <Button
              className="cursor-pointer"
              onClick={handleSelectAll}
              disabled={filteredExperiments.length === 0}
            >
              {allFilteredSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search experiments..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {filteredExperiments.length === 0 ? (
            <p className="text-center text-slate-500">No experiments found.</p>
          ) : (
            <ul className="flex flex-col gap-4 max-h-64 overflow-y-auto">
              {filteredExperiments.map(([expId, metrics]) => (
                <ExperimentMetricsItem
                  key={expId}
                  experimentId={expId}
                  metrics={metrics}
                  isSelected={selectedExperiments.has(expId)}
                  onSelectionChange={selectExperiment}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};

export default ExperimentMetricsList;
