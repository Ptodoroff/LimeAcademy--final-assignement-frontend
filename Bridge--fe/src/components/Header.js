import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import { useChain } from "react-moralis";
import { ethChainIdGoerli, bscChainIdTestnet } from "../constants";

export default function Header() {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    isWeb3Enabled,
    user,
    enableWeb3,
    logout,
  } = useMoralis();
  const { switchNetwork, chainId, chain } = useChain();
  const [selectedDestinationChain, setSelectedDestinationChain] = useState("");

  useEffect(() => {
    setSelectedDestinationChain(chainId);
  }, [chainId]);

  useEffect(() => {
    if (isAuthenticated) {
      async function web3andSwitchChain() {
        console.log("is authenticated");
        await enableWeb3();
        connectedChain(chainId);
      }
      web3andSwitchChain();
    }
  }, [isAuthenticated, isWeb3Enabled]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({
        signingMessage: "Welcome to the ETH-BSC Bridge! :) ",
      })
        .then(function (user) {
          console.log("logged in user:" + user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const connectedChain = (chain_id) => {
    let networks = {
      "0x5": "Goerli",
      "0x61": "Bsc Testnet",
      "0x1": "Ethereum Mainnet",
    };
    return networks[chain_id];
  };
  const logOut = async () => {
    await logout();
    console.log("logged out");
  };

  async function loginWeb3() {
    await login();
  }

  return (
    <header className="App-header">
      <div className="buttons">
        <Link to={"/Home"} className="Button btn btn-warning">
          Home
        </Link>
        <Link to={"/Bridge"} className=" btn btn-warning">
          Bridge
        </Link>
        <Link to={"/Claim"} className=" btn btn-warning">
          Claim
        </Link>
      </div>
      <a
        className="btn btn-light faucet"
        href="https://goerlifaucet.com/"
        target="blank"
      >
        Get Goerli Ether
      </a>
      <a
        className="btn btn-light faucet"
        href="https://testnet.bnbchain.org/faucet-smart"
        target="blank"
      >
        Get test BNB
      </a>
      {!isAuthenticated ? (
        <a href={"#!"} className="btn btn-primary wallet " onClick={loginWeb3}>
          Connect Wallet
        </a>
      ) : isAuthenticating ? (
        <p>Siging in...</p>
      ) : (
        <>
          <span className="btn btn-info chain">
            connected to: {connectedChain(chainId)}
            <select
              onChange={async (e) => {
                setSelectedDestinationChain(e.target.value);
                await switchNetwork(e.target.value);
              }}
            >
              <option> Select chain</option>
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
          </span>
          <a
            href={"#!"}
            className="btn btn-success wallet"
            onClick={() => logOut()}
          >
            {`${user.get("ethAddress").slice(0, 6)}...${user
              .get("ethAddress")
              .slice(-4)}`}
          </a>
        </>
      )}
    </header>
  );
}
