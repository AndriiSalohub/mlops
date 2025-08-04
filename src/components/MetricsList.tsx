import { useExperimentsStore } from "@/store/experimentsStore";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const MetricsList = () => {
  const { metrics, selectedMetrics, selectMetric } = useExperimentsStore();

  const handleCheckboxChange = (metric: string, checked: boolean) => {
    selectMetric(metric, checked);
  };

  return (
    <section className="mt-4 p-4 border-2 rounded-sm mb-4">
      {metrics.size === 0 ? (
        <h3 className="text-center text-slate-500">No metrics available.</h3>
      ) : (
        <>
          <div className="flex justify-between">
            <p className="text-2xl font-semibold mb-2">
              Metrics ({metrics.size})
            </p>
            {/* <Button className="cursor-pointer">Select All</Button> */}
          </div>
          {/* <div className="relative mb-4"> */}
          {/*   <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" /> */}
          {/*   <Input placeholder="Search experiments..." className="pl-8" /> */}
          {/* </div> */}
          <ul>
            {Array.from(metrics).map((metric: string) => (
              <li key={metric} className="flex items-center gap-y-4 gap-x-2">
                <Checkbox
                  className="cursor-pointer"
                  id={metric}
                  checked={selectedMetrics.has(metric)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(metric, !!checked)
                  }
                />

                <Label htmlFor={metric} className="cursor-pointer mb-1 text-md">
                  {metric}
                </Label>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default MetricsList;
