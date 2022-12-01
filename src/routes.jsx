import { Route, Routes } from "react-router-dom";
import InvitePage from "./pages/Join";
import ViewPage from "./pages/View";

const Router = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<InvitePage />} />
        <Route path="/view" element={<ViewPage hasAdmin={false} />} />
        <Route path="/management" element={<ViewPage hasAdmin={true} />} />
      </Routes>
    </main>
  );
};

export default Router;
