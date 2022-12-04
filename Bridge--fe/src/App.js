import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Bridge from "./components/Bridge";
import Claim from "./components/Claim";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/Home" index element={<Home />} />
          <Route path="/Bridge" index element={<Bridge />} />
          <Route path="/Claim" index element={<Claim />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
