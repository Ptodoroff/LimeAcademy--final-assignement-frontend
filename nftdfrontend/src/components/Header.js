import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import { useChain } from "react-moralis";
import { ethChainIdGoerli, bscChainIdTestnet } from "../constants";

export default function Header() {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    enableWeb3,
    logout,
  } = useMoralis();
  const { switchNetwork, chainId, chain } = useChain();

  useEffect(() => {
    if (isAuthenticated) {
      async function web3andSwitchChain() {
        await enableWeb3();
        console.log("is authenticated");
        await switchNetwork("0x5");
        await connectedChain(chainId);
      }
      web3andSwitchChain();
    }
  }, [isAuthenticated]);

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

  const connectedChain = (chainId) => {
    let networks = {
      "0x5": "Goerli",
      "0x61": "Bsc Testnet",
      "0x1": "Ethereum Mainnet",
    };
    return networks[chainId];
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
        {" | "}
        <Link to={"/Bridge"} className=" btn btn-warning">
          Bridge
        </Link>
      </div>
      <a
        className="btn btn-light"
        href="https://goerlifaucet.com/"
        target="blank"
      >
        Get Goerli Ether
      </a>
      <a
        className="btn btn-light"
        href="https://testnet.bnbchain.org/faucet-smart"
        target="blank"
      >
        Get test BNB
      </a>
      {!isAuthenticated ? (
        <a href={"#!"} className="btn btn-primary" onClick={loginWeb3}>
          Connect Wallet
        </a>
      ) : isAuthenticating ? (
        <p>Siging in...</p>
      ) : (
        <>
          <span className="btn btn-info">
            connected to: {connectedChain(chainId)}
          </span>
          <a href={"#!"} className="btn btn-success" onClick={() => logOut()}>
            {`${user.get("ethAddress").slice(0, 6)}...${user
              .get("ethAddress")
              .slice(-4)}`}
          </a>
        </>
      )}
    </header>
  );
}
