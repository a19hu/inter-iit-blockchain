import React, { useState,useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { LiaCoinsSolid } from "react-icons/lia";
import deva from "../images/deva-deva.jpg";
import { FaRegHeart } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { Network, Provider } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

type Props = {
  SongName: string;
  ArtistName: string;
  SongID: number;
  AlbumName: string;
  SongUrl: string;
  PhotoUrl: string;
  Purchase_Status: boolean;
  Song_Price: number;
  purchaseHandler: () => void;
  onPlaySong: (
    songID: number,
    url: string,
    songName: string,
    photourl: string,
    ArtistName: string
  ) => void;
};

const provider = new Provider(Network.DEVNET);
type EntryFunctionId = string;
type MoveType = string;
type ViewRequest = {
  function: EntryFunctionId;
  type_arguments: Array<MoveType>;
  arguments: Array<any>;
};

const SongCard: React.FC<Props> = ({
  SongName,
  ArtistName,
  AlbumName,
  SongID,
  SongUrl,
  PhotoUrl,
  Purchase_Status,
  Song_Price,
  purchaseHandler,
  onPlaySong,
  // likeSongHandler
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPurchased, setIsPurchased] = useState(true);
  const[isUSer,setIsUser]=useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const provider = new Provider(Network.DEVNET);
  const module_address = process.env.REACT_APP_MODULE_ADDRESS;
  type EntryFunctionId = string;
  type MoveType = string;
  type ViewRequest = {
    function: EntryFunctionId;
    type_arguments: Array<MoveType>;
    arguments: Array<any>;
  };

  useEffect(() => {
    checkIfUSer();
    if(isUSer){
      checkIfPurchased();
    }
}
, [SongID,isUSer])
const checkIfUSer = async () => {
  const payload: ViewRequest = {
    function: `${module_address}::Profile::isUser`,
    type_arguments: [],
    arguments: [account?.address],
  };
  try {
    const response = await provider.view(payload);
    let isUser = JSON.parse(JSON.stringify(response));
    console.log("isUser", isUser[0]);
    setIsUser(isUser[0]);
  } catch (error: any) {
    console.log("error", error);
    return false;
  }
};

// };
const checkIfPurchased = async()=>{
  if (!account) return [];
  const payload: ViewRequest = {
    function: `${module_address}::Profile::isUserPurchasedMain`,
    type_arguments: [],
    arguments: [account?.address,SongID],
  };
  const response=await provider.view(payload);
  const res=JSON.parse(JSON.stringify(response))
  console.log(res[0]);
  if(res[0]===true){
    setIsPurchased(false);
  }

}

  const handleCardClick = () => {
    if (Purchase_Status) {
      purchaseHandler();
    }
  };
  const playSong = () => {
    onPlaySong(SongID, SongUrl, SongName, PhotoUrl, ArtistName); // Add this line
  };
  return (
    <center
      className="Liked-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // onClick={handleCardClick}
    >
      {isHovered ? (
        <>
          <div className="playlist-image">
            
            <img src={PhotoUrl} alt="song-image" className="card-image" />
            {!isPurchased?(
                      <center className="show-button">
                      <FaPlay className="play-button" onClick={playSong} />
                    </center>
            ):(null)}
    
          </div>
        </>
      ) : (
        <>
          <div className="playlist-image">
            
            <img src={PhotoUrl} alt="song-image" className="card-image" />
          </div>
        </>
      )}
      <div className="bottom-details">
        <div className="songs">
          <div className="song-details">{SongName}</div>
          <div className="song-details">Artist : {ArtistName}</div>
          <div className="song-details">Album : {AlbumName}</div>
        </div>
        <div className={isPurchased == true ? "purchase" : "not-purchase"}>
          <LiaCoinsSolid
            onClick={handleCardClick}
            className={
              isPurchased == true ? "image-show" : "image-not-show"
            }
          />
          <div
            className={isPurchased == false ? "show_paid" : "not_show_paid"}
          >
            Paid
          </div>
          <div
            className={
              isPurchased == true ? "show_price" : "not-show-price"
            }
          >
            {Song_Price}
          </div>
        </div>
      </div>
    </center>
  );
};

export default SongCard;
