import { useEffect, useState, type ChangeEvent } from "react";
import Papa from "papaparse";
import type { ExperimentData } from "@/types/experiment.types";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "./ui/progress";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const CSVUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ExperimentData[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.log(file);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setStatus("uploading");
      setUploadProgress(0);
      setErrorMessage(null);

      const parsedData: ExperimentData[] = [];

      Papa.parse(selectedFile, {
        header: true,
        step: (result: any, parser: any) => {
          try {
            const parsedExperiment: ExperimentData = {
              experiment_id: result.data.experiment_id,
              metric_name: result.data.metric_name,
              step: Number(result.data.step),
              value: Number(result.data.value),
            };
            parsedData.push(parsedExperiment);

            const progress = Math.min(
              100,
              (parser.streamer._rowCount / (selectedFile.size / 100)) * 100,
            );
            setUploadProgress(Math.round(progress));
          } catch (err) {
            throw new Error(
              `Invalid data format in CSV row ${parser.streamer._rowCount}`,
            );
          }
        },
        complete: () => {
          setData(parsedData);
          setStatus("success");
          setUploadProgress(100);
          console.log("Parsed CSV:", parsedData);
        },
        error: (error: Error) => {
          console.error("Error parsing CSV:", error);
          setStatus("error");
          setUploadProgress(0);
          setErrorMessage(
            error.message ||
              "Failed to parse CSV file. Please ensure it has the correct format.",
          );
        },
      });
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(uploadProgress);
  }, [uploadProgress]);

  return (
    <section className="border-2 border-dashed rounded-sm flex items-center p-4 flex-col">
      <div className="flex gap-2 items-center">
        <Upload />
        <h2 className="text-xl font-semibold">Upload Experiment Data</h2>
      </div>
      <div className="text-muted-foreground mb-2">
        Select a csv file which contains experiment logs
      </div>

      <Button className="cursor-pointer">
        <input
          type="file"
          onChange={handleFileChange}
          className="cursor-pointer"
          accept=".csv"
        />
      </Button>
      {status === "uploading" ? (
        <div className="mt-2 p-4 w-full">
          <Progress value={uploadProgress} />
          <p className="text-center mt-1">
            Loading experiment data...
            <span className="ml-1">{uploadProgress}%</span>
          </p>
        </div>
      ) : null}
      {status === "success" && (
        <div className="mt-2 max-w-lg w-full bg-emerald-50 border border-emerald-200 rounded-sm">
          <h3 className="p-4 text-center text-lg text-emerald-400">
            Experiment data successfully loaded!
          </h3>
        </div>
      )}
      {status === "error" && (
        <div className="mt-2 max-w-lg w-full bg-red-50 border border-red-200 rounded-sm text-center">
          <h3 className="p-4 text-lg text-red-400">Error</h3>
          <p className="text-sm text-red-600 pb-4">
            {errorMessage ||
              "An unexpected error occurred while processing the CSV file."}
          </p>
        </div>
      )}
    </section>
  );
};

export default CSVUploader;
