import React, { useEffect } from "react";
import "../style/likedSongs.css";
import "../style/transaction.css";
import { LiaCoinsSolid } from "react-icons/lia";
import { Network, Provider } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

type Props = {
  TransactionID: number;
  TransactionDate: string;
  SongName: string;
};

const TransactionCard: React.FC<Props> = ({
  TransactionID,
  TransactionDate,
  SongName,
}) => {
  const provider = new Provider(Network.DEVNET);
  const [songOrgName, setSongOrgName] = React.useState("");
  const [songPrice, setSongPrice] = React.useState(0);
  const { account, signAndSubmitTransaction } = useWallet();
  const module_address = process.env.REACT_APP_MODULE_ADDRESS;
  type EntryFunctionId = string;
  type MoveType = string;
  type ViewRequest = {
    function: EntryFunctionId;
    type_arguments: Array<MoveType>;
    arguments: Array<any>;
  };
  useEffect(() => {
    fethcSongFromID();
  }, []);

  const fethcSongFromID = async () => {
    const payload: ViewRequest = {
      function: `${module_address}::Profile::retrieveSong`,
      type_arguments: [],
      arguments: [SongName],
    };
    console.log("calling view function retrieveSong");
    console.log(SongName);
    const song = await provider.view(payload);
    let songDetails = JSON.parse(JSON.stringify(song));
    console.log("songDetails:");
    console.log(songDetails);
    console.log(songDetails[0].name);
    setSongOrgName(songDetails[0].name);
    setSongPrice(songDetails[0].current_price);
  };
  return (
    <center className="Transaction-card">
      <div className="left-side">
        <div className="transac-details">
          <div className="key-transac">Artist :</div>
          <div className="val-transac">{TransactionDate}</div>
        </div>
        <div className="transac-details">
          <div className="key-transac">Transaction ID :</div>
          <div className="val-transac">{TransactionID}</div>
        </div>
        <div className="transac-details">
          <div className="key-transac"> Song Name :</div>
          <div className="val-transac">{songOrgName}</div>
        </div>
        <div className="transac-details">
          <div className="key-transac"> Price :</div>
          <div className="val-transac">{songPrice}</div>
        </div>
      </div>
    </center>
  );
};

export default TransactionCard;
