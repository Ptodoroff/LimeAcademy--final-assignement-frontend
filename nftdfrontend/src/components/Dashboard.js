import React from "react";
import "../App.css";
import { useMoralis, useChain } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import ABI from "../contracts/Swap.json";
import NFTDAbi from "../contracts/ERC20.json";

export default function Dashboard() {
  const { chainId } = useChain();
  const [DAI, setDAI] = useState(0);
  const [USDC, setUSDC] = useState(0);
  const [NFTD, setNFTD] = useState(0);
  const [ETH, setETH] = useState(0);
  const { web3, isWeb3Enabled } = useMoralis();
  const swapContractAddress = "0xCf94E2876258EAF7EfdFE779fd1530c6b60cf4DA";
  const DAIAddress = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";
  const USDCAddress = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C";

  useEffect(() => {
    if (isWeb3Enabled && chainId === "0x5") {
      seeTotalNFTDSupply();
      seeDaiSwapped();
      seeUsdcSwapped();
      seeEthStaked();
    }
  }, [isWeb3Enabled, web3]);

  async function seeEthStaked() {
    let RETHAddress = "0x178E141a0E3b34152f73Ff610437A7bf9B83267A";
    let ETHStaked;
    let signer = web3.getSigner();
    const RETHTokenContract = new ethers.Contract(RETHAddress, NFTDAbi, signer);
    ETHStaked = await RETHTokenContract.balanceOf(swapContractAddress);
    setETH(BigNumber.from(ETHStaked));
  }

  async function seeDaiSwapped() {
    let DAIswapped;
    let signer = web3.getSigner();

    const swapContract = new ethers.Contract(swapContractAddress, ABI, signer);

    DAIswapped = await swapContract._TotalSwappedStablecoins(
      swapContractAddress,
      DAIAddress
    );
    setDAI(BigNumber.from(DAIswapped));
  }
  async function seeUsdcSwapped() {
    let USDCSwapped;
    let signer = web3.getSigner();

    const swapContract = new ethers.Contract(swapContractAddress, ABI, signer);

    USDCSwapped = await swapContract._TotalSwappedStablecoins(
      swapContractAddress,
      USDCAddress
    );
    setUSDC(BigNumber.from(USDCSwapped));
  }

  async function seeTotalNFTDSupply() {
    const NFTDAddress = "0x6e5B038169F177a026a32FcFF7bB80333831D038";
    let signer = web3.getSigner();
    const NFTDContract = new ethers.Contract(NFTDAddress, NFTDAbi, signer);
    setNFTD(BigNumber.from(await NFTDContract.totalSupply()));
  }
  return (
    <div className="dashboard">
      <h2 className="explanation">
        NFTD is a fully decentralised stablecoin with 100% capital efficiency,
        backed by staked ETH, generating staking yield for the stablecoin
        holders
      </h2>
      <div className="dashboard-main">
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem" }}>
              Total NFTD minted:
              <div className="card-body">
                <p className="card-text">
                  {" "}
                  <span>{ethers.utils.formatUnits(NFTD)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem" }}>
              Total USDC swapped:
              <div className="card-body">
                <p className="card-text">{ethers.utils.formatEther(USDC)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem" }}>
              Total DAI swapped:
              <div className="card-body">
                <p className="card-text">{ethers.utils.formatEther(DAI)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="card" style={{ width: "10rem" }}>
            Total ETH staked:
            <div className="card-body">
              <p className="card-text">
                {Number(ethers.utils.formatEther(ETH)).toFixed(4)}
              </p>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem" }}>
              Total Rewards accrued:
              <div className="card-body">
                <p className="card-text"></p>
              </div>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem", height: "9.2rem" }}>
              Average APY:{" "}
              <div className="card-body">
                <p className="card-text"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
