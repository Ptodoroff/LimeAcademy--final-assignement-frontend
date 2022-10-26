import React from "react";
import "../App.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2 className="explanation">
        NFTD is a fully decentralised stablecoin with 100% capital efficiency,
        backed by staked ETH, generating staking yield for the stablecoin holder
      </h2>
      <div className="dashboard-main">
        <div className="totalNFTD">
          Total NFTD minted: <span></span>
        </div>
        <div className="totalNFTD">
          Total USDT swapped: <span></span>
        </div>
        <div className="totalNFTD">
          Total USDC swapped: <span></span>
        </div>
        <div className="totalNFTD">
          Total DAI swapped: <span></span>
        </div>
        <div className="totalNFTD">
          Total ETH staked: <span></span>
        </div>
        <div className="totalNFTD">
          Total Rewards accrued: <span></span>
        </div>
        <div className="totalNFTD">
          Average APY: <span></span>
        </div>
      </div>
    </div>
  );
}
