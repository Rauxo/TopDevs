import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import HomeScreen from "./pages/home/HomeScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App