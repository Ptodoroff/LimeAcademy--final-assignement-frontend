import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";

export default function Header() {

  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    // account,
    logout,
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("is authenticated");
    }
  }, [isAuthenticated]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in to NFTD Dasboard" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
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

  return (
    <header className="App-header">
      <div className="buttons">
        <Link to={"/dashboard"} className="dashboard">Dashboard</Link>{" | "}
        <Link to={"/about"} className="about">About minting NFTD</Link>{" | "}
        <Link to={"/mint-stable"} className="stablecoin">Mint NFTD With your stablecoin</Link>{" | "}
        <Link to={"/mint-virtual"} className="virtualLandMint">Mint NFTD with virtual Land</Link>
      </div>
      {!isAuthenticated ? (
        <a href={"#!"} onClick={() => login()}>
          Connect Wallet
        </a>
      ) : isAuthenticating ? (
        <p>Siging in...</p>
      ) : (
        <a href={"#!"} onClick={() => logOut()}>
          {`${user.get("ethAddress").slice(0,6)}...${user.get("ethAddress").slice(-4)}`}
        </a>
      )}
    </header>

  );
}

// import React from "react";
//
// export default function Header() {
//   return (
//     <header className="App-header">
//       <div className="buttons">
//         <button className="dashboard">Dashboard</button>
//         <button className="stablecoin">Mint NFTD With your stablecoin</button>
//         <button className="about">About minting NFTD</button>
//         <button className="virtualLandMint">Mint NFTD with virtual Land</button>
//       </div>
//       <button className="connect">Connect Wallet</button>
//     </header>
//   );
// }
