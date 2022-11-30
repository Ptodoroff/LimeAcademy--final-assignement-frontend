import { Link } from "react-router-dom";

const Bridge = () => {
  return (
    <div>
      <div className="Intro">
        {" "}
        <h1 className="title">This is an ERC-20 Bridge</h1>
      </div>{" "}
      <div>
        <h2>Use it to move funds between Goerli and the BSC Testnet chains</h2>
      </div>
      <div>
        <Link to={"/Bridge"} className=" bridgeButton btn btn-warning btn-lg">
          Bridge
        </Link>
      </div>
    </div>
  );
};

export default Bridge;
