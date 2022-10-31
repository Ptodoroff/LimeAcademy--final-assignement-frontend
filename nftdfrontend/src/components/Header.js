import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import { useChain } from "react-moralis";
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
      }
      web3andSwitchChain();
    }
  }, [isAuthenticated]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in to NFTD Dasboard" })
        .then(function (user) {
          console.log("logged in user:" + user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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
        <Link to={"/dashboard"} className="dashboarButton btn btn-warning">
          Dashboard
        </Link>
        {" | "}
        <Link to={"/about"} className="about btn btn-warning">
          About minting NFTD
        </Link>
        {" | "}
        <Link to={"/mint-stable"} className="stablecoin btn btn-warning">
          Mint NFTD With your stablecoin
        </Link>
        {" | "}
        <Link to={"/mint-virtual"} className="virtualLandMint btn btn-warning">
          Mint NFTD with virtual Land
        </Link>
      </div>
      {!isAuthenticated ? (
        <a href={"#!"} className="btn btn-primary" onClick={loginWeb3}>
          Connect Wallet
        </a>
      ) : isAuthenticating ? (
        <p>Siging in...</p>
      ) : (
        <a href={"#!"} className="btn btn-success" onClick={() => logOut()}>
          {`${user.get("ethAddress").slice(0, 6)}...${user
            .get("ethAddress")
            .slice(-4)}`}
        </a>
      )}
    </header>
  );
}
