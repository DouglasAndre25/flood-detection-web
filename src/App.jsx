import { BrowserRouter } from "react-router-dom/dist";
import Router from "./routes";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
