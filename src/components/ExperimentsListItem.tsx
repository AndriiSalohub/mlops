import { useState } from "react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "@radix-ui/react-label";

interface ExperimentMetricsItemProps {
  experimentId: string;
  metrics: Set<string>;
  isSelected: boolean;
  onSelectionChange: (experimentId: string, isSelected: boolean) => void;
}

const ExperimentMetricsItem = ({
  experimentId,
  metrics,
  isSelected,
  onSelectionChange,
}: ExperimentMetricsItemProps) => {
  const VISIBLE_LIMIT = 3;
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange(experimentId, checked);
  };

  const handleToggleMetrics = () => {
    setShowAllMetrics(!showAllMetrics);
  };

  const metricsLength = Array.from(metrics).length;

  return (
    <li className="flex items-center gap-2">
      <Checkbox
        className="cursor-pointer"
        id={experimentId}
        checked={isSelected}
        onCheckedChange={handleCheckboxChange}
      />
      <div>
        <Label htmlFor={experimentId} className="cursor-pointer mb-1">
          Experiment Identifier:{" "}
          <span className="font-semibold">{experimentId}</span>
        </Label>
        <ul className="flex gap-2">
          {metricsLength > VISIBLE_LIMIT && !showAllMetrics ? (
            <>
              {Array.from(metrics)
                .slice(0, VISIBLE_LIMIT)
                .map((metric) => (
                  <li key={metric}>
                    <Badge
                      key={metric}
                      variant="secondary"
                      className="text-sm font-semibold"
                    >
                      {metric}
                    </Badge>
                  </li>
                ))}
              <Badge
                variant="outline"
                className="text-sm font-semibold cursor-pointer"
                onClick={handleToggleMetrics}
              >
                +{metricsLength - VISIBLE_LIMIT}
              </Badge>
            </>
          ) : (
            <>
              {Array.from(metrics).map((metric) => (
                <li key={metric}>
                  <Badge variant="secondary" className="text-sm font-semibold">
                    {metric}
                  </Badge>
                </li>
              ))}
              {metricsLength > VISIBLE_LIMIT && (
                <li>
                  <Badge
                    variant="outline"
                    className="text-sm font-semibold cursor-pointer"
                    onClick={handleToggleMetrics}
                  >
                    Show Less
                  </Badge>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </li>
  );
};

export default ExperimentMetricsItem;
