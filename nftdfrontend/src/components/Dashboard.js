import "../App.css";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../contracts/Swap.json";
import NFTDAbi from "../contracts/ERC20.json";

export default function Dashboard() {
  const [USDT, setUSDT] = useState(" ");
  const [NFTD, setNFTD] = useState(" ");
  const {web3, isWeb3Enabled} = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) {
      seeUsdtSwapped();
      seeTotalNFTDSupply();
      console.log("Isweb3enabled -" + isWeb3Enabled);
    } else {
      alert(" reconnect the wallet to enable web3 ");
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
  }

  async function seeTotalNFTDSupply() {
    const NFTDAddress = "0xa362c101a5d1317ac30376eeeefb543833d34d1a";
    let signer = web3.getSigner();
    const NFTDContract = new ethers.Contract(NFTDAddress, NFTDAbi, signer);
    setNFTD(String(await NFTDContract.totalSupply()).slice(0, 3));
  }


  return (
    <div className="dashboard">
      <h2 className="explanation">
        NFTD is a fully decentralised stablecoin with 100% capital efficiency,
        backed by staked ETH, generating staking yield for the stablecoin holder
      </h2>
      <div className="dashboard-main">
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem" }}>
              Total NFTD minted:
              <div className="card-body">
                <p className="card-text">
                  {" "}
                  <span>{NFTD}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="card" style={{ width: "10rem" }}>
            Total USDT swapped:
            <div className="card-body">
              <p className="card-text">{USDT}</p>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem" }}>
              Total USDC swapped:
              <div className="card-body">
                <p className="card-text"></p>
              </div>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="totalNFTD">
            <div className="card" style={{ width: "10rem" }}>
              Total DAI swapped:
              <div className="card-body">
                <p className="card-text"></p>
              </div>
            </div>
          </div>
        </div>
        <div className="totalNFTD">
          <div className="card" style={{ width: "10rem" }}>
            Total ETH staked:
            <div className="card-body">
              <p className="card-text"></p>
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
            <div className="card" style={{ width: "10rem" }}>
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
