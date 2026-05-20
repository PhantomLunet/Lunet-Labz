import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Landing from "@/pages/Landing";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import FeaturesPage from "@/pages/FeaturesPage";

function App() {
  return (
    <div className="App" data-testid="app-root">
      <BrowserRouter>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/features" element={<FeaturesPage />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#f4f1ed",
            border: "1px solid #1a1a1a",
            fontFamily: "Outfit, sans-serif",
            borderRadius: "9999px",
          },
        }}
      />
    </div>
  );
}

export default App;
