import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import MintStable from "./components/MintStable";
import MintVirtual from "./components/MintVirtual";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path="artworks" element={<About />} />
          <Route path="users" element={<MintStable />} />
          <Route path="*" element={<MintVirtual />} />
        </Routes>{" "}
      </BrowserRouter>{" "}
    </div>
  );
}

export default App;


/*
<Link to={"#!"} className="dashboard">Dashboard</Link>
<Link to={"#!"} className="about">About minting NFTD</Link>
<Link to={"#!"} className="stablecoin">Mint NFTD With your stablecoin</Link>
<Link to={"#!"} className="virtualLandMint">Mint NFTD with virtual Land</Link>

 */
