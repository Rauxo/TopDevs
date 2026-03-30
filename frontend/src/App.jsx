import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import HomeScreen from "./pages/home/HomeScreen";
import NotFound from "./NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App