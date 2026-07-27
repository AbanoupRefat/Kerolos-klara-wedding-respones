import BackgroundEffect from "./components/BackgroundEffect";
import ResponsesDashboard from "./components/ResponsesDashboard";
import "./App.css";

export default function App() {
  return (
    <div className="page" style={{ overflowY: "auto" }}>
      <BackgroundEffect />
      <ResponsesDashboard />
    </div>
  );
}
