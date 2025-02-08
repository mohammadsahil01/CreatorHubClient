import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatorPage from "./pages/Creator";
import ChannelPage from "./pages/ChannelPage";
import VideoPage from "./pages/VideoPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:creatorName" element={<CreatorPage />} />
          <Route path="/:creatorName/:name" element={<ChannelPage />} />
          <Route
            path="/:creatorName/:channelId/:videoId"
            element={<VideoPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
