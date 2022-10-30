//DECIMAAAAAAAALS FOR THE FRONEND - NEED TO CALL THE DECIMALS FN OF THE INPUT
//CHANGE THE NFTD ADDRESS TO THE NEW ONE .
//COPY THE CODE OF THE NEW SWAP CONTRACT HERE AND PUSH IT TO THE REPO TOGETHER WITH THE NEW NFTD TOKEN CONTRACT CODE !
import { BigNumber, ethers } from "ethers";
import ABI from "../contracts/Swap.json";
import { useState, useEffect } from "react";
import { useMoralis, useChain } from "react-moralis";
import ERC20Abi from "../contracts/ERC20.json";
import "../App.css";
const MintStable = () => {
  const [currency, setCurrency] = useState(" ");
  const [value, setValue] = useState(" ");
  const [NFTDBalance, setNFTDBalance] = useState(0);
  const [RETHBalance, setRETHBalance] = useState(0);
  const { web3, account, isWeb3Enabled } = useMoralis();
  let swapContractAddress = "0xCf94E2876258EAF7EfdFE779fd1530c6b60cf4DA";
  const { switchNetwork, chainId, chain } = useChain();

  const resetForm = () => {
    setCurrency(null);
    setValue(null);
  };

  useEffect(() => {
    if (isWeb3Enabled && chainId === "0x5") {
      fetchNFTDBalance();
      fetchRETHBalance();
    }
  }, [isWeb3Enabled, web3]);
  const fetchNFTDBalance = async () => {
    const NFTDAddress = "0x6e5B038169F177a026a32FcFF7bB80333831D038";
    let signer = web3.getSigner();
    const NFTDContract = new ethers.Contract(NFTDAddress, ERC20Abi, signer);

    setNFTDBalance(BigNumber.from(await NFTDContract.balanceOf(account)));
  };

  const fetchRETHBalance = async () => {
    let signer = web3.getSigner();

    const swapContract = new ethers.Contract(swapContractAddress, ABI, signer);

    let RETHbalanceTemp = String(
      await swapContract.depositedRethByUser(account)
    );
    let RETHBalanceFormatted = Number(
      ethers.utils.formatEther(RETHbalanceTemp)
    ).toFixed(4);
    setRETHBalance(RETHBalanceFormatted);
  };
  const selectCurrency = async (e) => {
    setCurrency(e.target.value);
    console.log(e.target.value);
  };

  const valueInput = async (e) => {
    setValue(e.target.value);
  };

  const approve = async () => {
    let signer = web3.getSigner();
    const selectedStablecoin = new ethers.Contract(currency, ERC20Abi, signer);
    let tx = await selectedStablecoin.approve(swapContractAddress, value);
    let response = await tx.wait();
    response
      ? console.log("approved successfully")
      : console.log("error with the approve transaction");
  };

  return (
    <div className="mintStableBody">
      <h2 className="explanation">
        NFTD is a fully decentralised stablecoin with 100% capital efficiency,
        backed by staked ETH, generating staking yield for the stablecoin holder
      </h2>
      <a
        className="btn btn-light"
        href="https://goerlifaucet.com/"
        target="blank"
      >
        Get Goerli Ether
      </a>{" "}
      <a
        href="https://app.uniswap.org/chain=gorli#/swap?exactField=input&inputCurrency=ETH&outputCurrency=0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844"
        target="blank"
        className="btn btn-light"
      >
        {" "}
        Buy test DAI
      </a>
      <h3> Mint NFTD with a stablecoin of your choice:</h3>
      <div className="stablecoinInput">
        <label htmlFor="amount"></label>
        {
          <select
            id="stablecoinList"
            onChange={(e) => {
              selectCurrency(e);
            }}
          >
            <option>Select stablecoin:</option>
            <option value="0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844">
              DAI
            </option>
            <option value="0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C">
              USDC
            </option>
          </select>
        }

        <input
          type="number"
          placeholder="Enter amount"
          value={value}
          onChange={(e) => {
            valueInput(e);
          }}
        ></input>
        <button
          className="btn btn-secondary"
          onClick={() => {
            approve();
          }}
        >
          Approve
        </button>
        <button
          className="btn btn-info"
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
          NFTD balance of user:{" "}
          <span>{ethers.utils.formatEther(NFTDBalance)}</span>{" "}
        </p>
        <p>
          {" "}
          total rETH staked by user: <span>{RETHBalance} rETH</span>
        </p>
      </div>
    </div>
  );
};

export default MintStable;
