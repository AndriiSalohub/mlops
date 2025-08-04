import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";
import { useExperimentsStore } from "../store/experimentsStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const LineGraph = () => {
  const { selectedMetrics, selectedExperiments, experiments } =
    useExperimentsStore();

  const chartData = useMemo(() => {
    const filteredData = experiments.filter(
      (exp) =>
        selectedExperiments.has(exp.experiment_id) &&
        selectedMetrics.has(exp.metric_name),
    );

    if (filteredData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const allSteps = [...new Set(filteredData.map((exp) => exp.step))].sort(
      (a, b) => a - b,
    );

    const groupedData = new Map();

    filteredData.forEach((exp) => {
      const key = `${exp.experiment_id}_${exp.metric_name}`;
      if (!groupedData.has(key)) {
        groupedData.set(key, {
          experiment_id: exp.experiment_id,
          metric_name: exp.metric_name,
          data: new Map(),
        });
      }
      groupedData.get(key).data.set(exp.step, exp.value);
    });

    const colors = [
      "rgba(75, 192, 192, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(201, 203, 207, 1)",
      "rgba(255, 205, 86, 1)",
    ];

    const datasets = Array.from(groupedData.values()).map((group, index) => {
      const data = allSteps.map((step) => group.data.get(step) || null);

      return {
        label: `${group.experiment_id} - ${group.metric_name}`,
        data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace("1)", "0.2)"),
        tension: 0.1,
        spanGaps: false,
        pointRadius: 2,
        pointHoverRadius: 4,
      };
    });

    return {
      labels: allSteps,
      datasets,
    };
  }, [selectedMetrics, selectedExperiments, experiments]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
          callbacks: {
            title: (context: any) => `Step: ${context[0].label}`,
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y?.toFixed(4) || "N/A"}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Step",
          },
          type: "linear" as const,
        },
        y: {
          title: {
            display: true,
            text: "Metric Value",
          },
        },
      },
      interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
      },
    }),
    [],
  );

  if (chartData.datasets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Select experiments and metrics to view the chart</p>
      </div>
    );
  }

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LineGraph;
