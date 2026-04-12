import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import AssessmentScreen from "./screens/AssessmentScreen.jsx";
import ExploreScreen from "./screens/ExploreScreen.jsx";
import CompareScreen from "./screens/CompareScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import NextStepsScreen from "./screens/NextStepsScreen.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#21352d]">
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/assessment" element={<AssessmentScreen />} />
        <Route path="/explore" element={<ExploreScreen />} />
        <Route path="/compare" element={<CompareScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/next" element={<NextStepsScreen />} />
      </Routes>
    </div>
  );
}
