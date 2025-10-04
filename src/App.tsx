import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import SubtitleLayout from "./components/SubtitleLayout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Edit from "./pages/Edit";
import Download from "./pages/Download";

/**
 * Main App component with nested routing structure
 * Implements the classic layout pattern for subtitle processing workflow
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout wraps Home and Upload pages */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />

          {/* Subtitle layout wraps Edit and Download pages */}
          <Route path="edit" element={<SubtitleLayout />}>
            <Route index element={<Edit />} />
          </Route>

          <Route path="download" element={<SubtitleLayout />}>
            <Route index element={<Download />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
