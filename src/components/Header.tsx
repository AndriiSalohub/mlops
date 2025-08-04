import { BarChart3 } from "lucide-react";

const Header = () => {
  return (
    <header className="p-4 w-full shadow-sm mb-4">
      <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        MLOps Tracker
      </h1>
    </header>
  );
};

export default Header;
