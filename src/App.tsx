import CSVUploader from "./components/CSVUploader";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto">
        <CSVUploader />
      </main>
    </>
  );
};

export default App;
