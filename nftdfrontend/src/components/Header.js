import React from "react";

export default function Header() {
  return (
    <header className="App-header">
      <div className="buttons">
        <button className="dashboard">Dashboard</button>
        <button className="stablecoin">Mint NFTD With your stablecoin</button>
        <button className="about">About minting NFTD</button>
        <button className="virtualLandMint">Mint NFTD with virtual Land</button>
      </div>
      <button className="connect">Connect Wallet</button>
    </header>
  );
}
