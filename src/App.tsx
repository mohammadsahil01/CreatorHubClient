import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Home from "./pages/Home";
import CreatorPage from "./pages/Creator";
import ChannelPage from "./pages/ChannelPage";
import VideoPage from "./pages/VideoPage";
import { Button } from "./components/ui/button";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, login } = useKindeAuth();

  if (!isAuthenticated) {
    login(); // Redirect to Kinde login
    return null; // Prevent rendering
  }

  return children;
};

const App = () => {
  const { isAuthenticated, isLoading } = useKindeAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Don't redirect immediately; wait for auth state */}
        <Route
          path="/"
          element={
            isLoading ? (
              <div>Loading...</div>
            ) : isAuthenticated ? (
              <Navigate to="/Home" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:creatorName"
          element={
            <ProtectedRoute>
              <CreatorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:creatorName/:name"
          element={
            <ProtectedRoute>
              <ChannelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:creatorName/:name/:videoId"
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const Login = () => {
  const { login } = useKindeAuth();

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-white text-3xl font-bold">Welcome to Creator Hub</h1>
      <Button
        onClick={() => login()}
        className="mt-4 text-white bg-gray-800 rounded-[10px] hover:bg-gray-700"
      >
        Login / Sign Up
      </Button>
    </div>
  );
};

export default App;
