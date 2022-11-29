import { Route, Routes } from "react-router-dom";
import InvitePage from "./pages/Join";

const Router = () => {
  return (
      <main>
        <Routes>
          <Route path="/" element={<InvitePage />} />
        </Routes>
      </main>
  );
}

export default Router;
