import CSVUploader from "./components/CSVUploader";
import ExperimentsList from "./components/ExperimentsList";
import Header from "./components/Header";
import LineGraph from "./components/LineChart";
import MetricsList from "./components/MetricsList";

const App = () => {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto">
        <CSVUploader />
        <ExperimentsList />
        <MetricsList />
        <LineGraph />
      </main>
    </>
  );
};

export default App;
