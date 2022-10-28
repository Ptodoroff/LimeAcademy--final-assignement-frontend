import React from "react";
import "../App.css";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../contracts/Swap.json";

export default function Dashboard() {
  const [USDT, setUSDT] = useState(" ");
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    web3,
    isWeb3Enabled,
    // account,
    logout,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) {
      seeUsdtSwapped();
    }
  }, [isWeb3Enabled]);

  async function seeUsdtSwapped() {
    let USDTswapped;
    let signer = web3.getSigner();
    const swapContractAddress = "0x14b3E3dd85dCf193e10658C76dA31c31A0f62a36";
    const dummyUSDTAddress = "0xe00D656db10587363c6106D003d08fBE2F0EaC81";

    const swapContract = new ethers.Contract(swapContractAddress, ABI, signer);

    USDTswapped = await swapContract._TotalSwappedStablecoins(
      swapContractAddress,
      dummyUSDTAddress
    );
    setUSDT(String(USDTswapped));

    console.log(String(USDTswapped));
  }
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
          Total USDT swapped: <span>{USDT}</span>
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
