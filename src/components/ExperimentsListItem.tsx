import type { FC } from "react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "@radix-ui/react-label";

interface ExperimentMetricsItemProps {
  experimentId: string;
  metrics: Set<string>;
}

const ExperimentMetricsItem: FC<ExperimentMetricsItemProps> = ({
  experimentId,
  metrics,
}) => {
  return (
    <li className="flex items-center gap-2">
      <Checkbox className="cursor-pointer" id={experimentId} />
      <div>
        <Label htmlFor={experimentId} className="cursor-pointer mb-1">
          Experiment Identifier:{" "}
          <span className="font-semibold">{experimentId}</span>
        </Label>
        <ul className="flex gap-2">
          {Array.from(metrics).map((metric) => (
            <li>
              <Badge
                key={metric}
                variant="secondary"
                className="text-sm font-semibold"
              >
                {metric}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default ExperimentMetricsItem;
