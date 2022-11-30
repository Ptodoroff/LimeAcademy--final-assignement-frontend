import "../App.css";
import { useMoralis, useChain, useERC20Balances } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { ethChainIdGoerli, bscChainIdTestnet } from "../constants";

export default function Home() {
  const { fetchERC20Balances, data, isLoading, isFetching, error } =
    useERC20Balances();
  const { isAuthenticated } = useMoralis();
  const { switchNetwork, chainId, chain } = useChain();
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedDestinationChain, setSelectedDestinationChain] = useState("");
  const [selectedTokenName, setSelectedTokenName] = useState("");
  const [selectedTokenBalance, setSelectedTokenBalance] = useState("");
  const [selectedTokenDecimals, setSelectedTokenDecimals] = useState("");

  useEffect(() => {
    setSelectedDestinationChain(chainId);
  }, [chainId]);

  useEffect(() => {
    fetchERC20Balances({ params: { chain: chainId } });
  }, [isAuthenticated]);

  const handleChange = (e) => {
    let name = e.target.selectedOptions[0].getAttribute("data-name");
    let balance = e.target.selectedOptions[0].getAttribute("data-balance");
    let decimals = e.target.selectedOptions[0].getAttribute("data-decimals");

    setSelectedToken(e.target.value);
    setSelectedTokenName(name);
    setSelectedTokenBalance(balance);
    setSelectedTokenDecimals(decimals);
  };

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
                switchNetwork(e.target.value);
              }}
            >
              <option> Select a chain to bridge to</option>
              <option
                value={ethChainIdGoerli}
                disabled={
                  selectedDestinationChain == ethChainIdGoerli ? true : false
                }
              >
                ETH Goerli
              </option>
              <option
                value={bscChainIdTestnet}
                disabled={
                  selectedDestinationChain == bscChainIdTestnet ? true : false
                }
              >
                {" "}
                BSC Testnet
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
          <span>Amount:</span> <input type="number"></input>
        </div>
      </div>
    </div>
  );
}
