import "../App.css";
import { useMoralis, useChain, useERC20Balances } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import {
  ethChainIdGoerli,
  bscChainIdTestnet,
  EthBridgeContractAddress,
  BscBridgeContractAddress,
  fee,
} from "../constants";
import bridgeContractAbi from "../contracts/Bridge.json";
import wrappedTokenAbi from "../contracts/WrappedToken.json";
import NotificationPanel from "./NotificationPanel";

export default function Bridge() {
  const { fetchERC20Balances, data, isLoading, isFetching, error } =
    useERC20Balances();
  const { isAuthenticated, account, web3, isWeb3Enabled } = useMoralis();
  const { switchNetwork, chainId, chain } = useChain();
  const [selectedToken, setSelectedToken] = useState("0x0");
  const [selectedDestinationChain, setSelectedDestinationChain] = useState("");
  const [selectedTokenName, setSelectedTokenName] = useState("");
  const [selectedTokenBalance, setSelectedTokenBalance] = useState("");
  const [selectedTokenDecimals, setSelectedTokenDecimals] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [hiddenNotification, setHiddenNotification] = useState(true);
  const [message, setMessage] = useState("");
  let bridgeAbi = bridgeContractAbi.abi;
  let tokenAbi = wrappedTokenAbi.abi;
  let signer;
  //================================
  //UseEffect
  //================================

  useEffect(() => {
    setSelectedDestinationChain(chainId);
  }, [chainId]);

  useEffect(() => {
    if (isWeb3Enabled) {
      signer = web3.getSigner();
    }
  });
  useEffect(() => {
    if (isAuthenticated) {
      fetchERC20Balances({ params: { chain: chainId } });
    }
  }, [isAuthenticated, account]);

  const handleChange = (e) => {
    let name = e.target.selectedOptions[0].getAttribute("data-name");
    let balance = e.target.selectedOptions[0].getAttribute("data-balance");
    let decimals = e.target.selectedOptions[0].getAttribute("data-decimals");

    setSelectedToken(e.target.selectedOptions[0].getAttribute("value"));
    setSelectedTokenName(name);
    setSelectedTokenBalance(balance);
    setSelectedTokenDecimals(decimals);
  };

  const displayNotification = (displayedMessage) => {
    setMessage(displayedMessage);
    setHiddenNotification(false);
  };
  // ================================
  // contract instances
  // ================================
  // const EthBridgeContract = new ethers.Contract(
  //   EthBridgeContractAddress,
  //   bridgeAbi,
  //   signer
  // );
  // const BscBridgeContract = new ethers.Contract(
  //   BscBridgeContractAddress,
  //   bridgeAbi,
  //   signer
  // );
  // ================================
  // contract function  calls
  // ================================

  async function approve() {
    let signer = web3.getSigner();
    let selectedTokenContract = new ethers.Contract(
      selectedToken,
      tokenAbi,
      signer
    );
    console.log(selectedTokenContract);
    let bridgeContractToApprove =
      chainId == "0x5" ? EthBridgeContractAddress : BscBridgeContractAddress;
    console.log(chainId);
    console.log(bridgeContractToApprove);
    let tx = await selectedTokenContract.approve(
      bridgeContractToApprove,
      ethers.utils.parseUnits(inputAmount, selectedTokenDecimals)
    );
    displayNotification("Approve pending ... ");
    setHiddenNotification(false);
    let response = await tx.wait();
    if (response) {
      displayNotification("Approve Successful.");
    } else {
      displayNotification("Error with the approve transaction");
    }
  }

  async function lock() {
    let signer = web3.getSigner();
    const EthBridgeContract = new ethers.Contract(
      EthBridgeContractAddress,
      bridgeAbi,
      signer
    );
    const BscBridgeContract = new ethers.Contract(
      BscBridgeContractAddress,
      bridgeAbi,
      signer
    );
    let selectedBridgeContract =
      chainId == "0x5" ? EthBridgeContract : BscBridgeContract;
    let tx = await selectedBridgeContract.lock(
      selectedToken,
      ethers.utils.parseUnits(String(inputAmount), selectedTokenDecimals),
      {
        value: String(fee),
      }
    );
    displayNotification("Bridging in process ... ");
    setHiddenNotification(false);
    let response = await tx.wait();
    if (response) {
      displayNotification("Bridging Successful.");
    } else {
      displayNotification("Error with the bridge transaction");
    }
  }

  return (
    <div className="mainContainer">
      {" "}
      <h1>Bridge</h1>
      <div>
        <div className="tokenSelect">
          <span>Select a token to bridge:</span>{" "}
          <div>
            {isAuthenticated && data && (
              <select onChange={handleChange}>
                <option style={{ textAlign: "center" }}> Select a token</option>
                {data.map((token, i) => (
                  <option
                    key={i}
                    className="tokenInfo"
                    value={token.token_address}
                    data-name={token.name}
                    data-balance={token.balance}
                    data-decimals={token.decimals}
                    style={{ textAlign: "center" }}
                  >
                    {" "}
                    {token.name}{" "}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
      <div className="chainSelect">
        <span>Destination chain:</span>{" "}
        <div>
          {isAuthenticated && data && (
            <select
              onChange={(e) => {
                setSelectedDestinationChain(e.target.value);
              }}
            >
              <option> Select a chain to bridge to</option>
              <option
                value={ethChainIdGoerli}
                disabled={
                  selectedDestinationChain == ethChainIdGoerli ? true : false
                }
              >
                ETH Goerli{" "}
              </option>
              <option
                value={bscChainIdTestnet}
                disabled={
                  selectedDestinationChain == bscChainIdTestnet ? true : false
                }
              >
                {" "}
                BSC Testnet{" "}
              </option>
            </select>
          )}
        </div>
      </div>
      <div className="amountCluster">
        {" "}
        {selectedTokenName != "" ? (
          <p>
            Available {selectedTokenName}:{" "}
            {ethers.utils.formatEther(
              selectedTokenBalance,
              selectedTokenDecimals
            )}{" "}
          </p>
        ) : (
          ""
        )}
        <div>
          <span>Amount:</span>{" "}
          <input
            type="number"
            onChange={(e) => setInputAmount(e.target.value)}
          ></input>
        </div>
      </div>
      <p>
        {" "}
        Note: there is a 0.03 {chainId == "0x5" ? "ETH" : "BSC"} fee on
        bridging.{" "}
      </p>
      <div className="buttons">
        <button
          className="btn btn-secondary"
          onClick={() => {
            approve();
          }}
          disabled={!inputAmount || !selectedToken}
        >
          Approve
        </button>
        <div className="lockButton">
          <button
            className="btn btn-secondary"
            onClick={() => {
              lock();
            }}
            disabled={!inputAmount || !selectedToken}
          >
            Lock
          </button>
        </div>
      </div>
      <NotificationPanel
        message={message}
        setHiddenNotification={setHiddenNotification}
        hiddenNotification={hiddenNotification}
      />
    </div>
  );
}
