import { ethers } from "ethers";
import ABI from "../contracts/Swap.json";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import ERC20Abi from "../contracts/ERC20.json";

const MintStable = () => {
  const [currency, setCurrency] = useState(
    "0xe00D656db10587363c6106D003d08fBE2F0EaC81"
  );
  const [value, setValue] = useState(" ");
  const [NFTDBalance, setNFTDBalance] = useState(" ");
  const [RETHBalance, setRETHBalance] = useState();
  let selectedStablecoin = document.getElementById("stablecoinList");
  const { web3, account, isWeb3Enabled } = useMoralis();
  let swapContractAddress = "0x14b3E3dd85dCf193e10658C76dA31c31A0f62a36";

  const resetForm = () => {
    setCurrency(null);
    setValue(null);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      fetchNFTDBalance();
      fetchRETHBalance();
    }
  }, [isWeb3Enabled]);
  const fetchNFTDBalance = async () => {
    const NFTDAddress = "0xa362c101a5d1317ac30376eeeefb543833d34d1a";
    let signer = web3.getSigner();
    const NFTDContract = new ethers.Contract(NFTDAddress, ERC20Abi, signer);

    setNFTDBalance(String(await NFTDContract.balanceOf(account)).slice(0, 3));
  };

  const fetchRETHBalance = async () => {
    let signer = web3.getSigner();
    const swapContractAddress = "0x14b3E3dd85dCf193e10658C76dA31c31A0f62a36";

    const swapContract = new ethers.Contract(swapContractAddress, ABI, signer);

    let RETHbalanceTemp = await swapContract.depositedRethByUser(account);
    let RETHBalanceFormatted = ethers.utils.formatEther(RETHbalanceTemp);
    setRETHBalance(RETHBalanceFormatted);
  };
  const selectCurrency = async () => {
    setCurrency(selectedStablecoin.value);
    console.log(currency);
  };

  const valueInput = async (e) => {
    setValue(e.target.value);
  };

  const approve = async () => {
    const dummyUSDTAddress = "0xe00D656db10587363c6106D003d08fBE2F0EaC81";
    let signer = web3.getSigner();
    const dummyUSDTcontract = new ethers.Contract(
      dummyUSDTAddress,
      ERC20Abi,
      signer
    );
    let tx = await dummyUSDTcontract._approve(swapContractAddress, value);
    let response = await tx.wait();
    response
      ? console.log("approved successfully")
      : console.log("error with the approve transaction");
  };

  return (
    <div>
      <h2 className="explanation">
        NFTD is a fully decentralised stablecoin with 100% capital efficiency,
        backed by staked ETH, generating staking yield for the stablecoin holder
      </h2>
      <div className="stablecoinInput">
        <label htmlFor="amount">Select stablecoin:</label>
        <select
          id="stablecoinList"
          onChange={() => {
            selectCurrency();
            console.log(isWeb3Enabled);
          }}
        >
          <option value="0xe00D656db10587363c6106D003d08fBE2F0EaC81">
            TestUSDT
          </option>
          <option>DAI</option>
          <option>USDC</option>
          <option>USDT</option>
        </select>
        <input
          type="number"
          placeholder="Enter amount"
          value={value}
          onChange={(e) => {
            valueInput(e);
          }}
        ></input>
        <button
          onClick={() => {
            approve();
          }}
        >
          Approve
        </button>
        <button
          onClick={async () => {
            let signer = web3.getSigner();

            const swapContract = new ethers.Contract(
              swapContractAddress,
              ABI,
              signer
            );
            let tx = await swapContract.swap(value, currency);
            let response = await tx.wait();
            response
              ? console.log("swapped successfully")
              : console.log("error with the swap transaction");
            await resetForm();
          }}
        >
          Swap
        </button>
        <label>NFTD Received </label>
        <input
          type="number"
          placeholder="NFTD Received"
          disabled={true}
          value={value}
        ></input>
      </div>
      <div id="infoCluster">
        <p>
          NFTD balance of user: <span>{NFTDBalance}</span>{" "}
        </p>
        <p>
          {" "}
          total Reth staked by user: <span>{RETHBalance}</span>
        </p>
      </div>
    </div>
  );
};

export default MintStable;
