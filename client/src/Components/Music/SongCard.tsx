import React, { useState } from "react";
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
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const module_address = process.env.REACT_APP_MODULE_ADDRESS;




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
            <center className="show-button">
              <FaPlay className="play-button" onClick={playSong} />
            </center>
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
        <div className={Purchase_Status == true ? "purchase" : "not-purchase"}>
          <LiaCoinsSolid
            onClick={handleCardClick}
            className={
              Purchase_Status == true ? "image-show" : "image-not-show"
            }
          />
          <div
            className={Purchase_Status == false ? "show_paid" : "not_show_paid"}
          >
            Paid
          </div>
          <div
            className={
              Purchase_Status == true ? "show_price" : "not-show-price"
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
