import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "./App.css";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

import PageNotFound from "./Components/pages/PageNotFound";
import Home from "./Components/pages/Home";
import Navbar from "./Components/Navbar/Navbar";
import Profile from "./Components/pages/Profile";
import Login from "./Components/pages/Login";
import Fixedcomp from "./Components/fixed/Fixedcomp";
import SongPage from "./Components/Music/SongPage";
import PlayList from "./Components/Music/PlayList";
import Upload from "./Components/pages/Upload";
import Govern from "./Components/pages/Govern";
import Newplaylist from "./Components/pages/Newplaylist";

// import Appdemo from './Components/demo-music/Appdemo';

type AppProps = {
  songUrl: string | null;
  songArtist: string | null;
};
function App() {
  const [songID, setSongID] = useState<number>(0);
  const [songUrl, setSongUrl] = useState<string | null>(null);
  const [songname, setSongName] = useState<string | null>(null);
  const [photourl, setPhotourl] = useState<string>("");
  const [songIdArray, setSongIdArray] = useState<number[]>([]);
  const [artistname, setArtistname] = useState<string | null>(null);
  const [songUrlArray, setSongUrlArray] = useState<string[]>([]);
  const [songNameArray, setSongNameArray] = useState<string[]>([]);
  const [photoUrlArray, setPhotourlArray] = useState<string[]>([]);

  const [songArtist, setSongArtist] = useState<string | null>(null);
  const { account, signAndSubmitTransaction } = useWallet();
  const module_address = process.env.REACT_APP_MODULE_ADDRESS;
  const provider = new Provider(Network.DEVNET);
  type EntryFunctionId = string;
  type MoveType = string;
  type ViewRequest = {
    function: EntryFunctionId;
    type_arguments: Array<MoveType>;
    arguments: Array<any>;
  };
  // const checkUser()
  const handlePlaySong = (
    SongID : number,
    url: string,
    songName: string,
    photourl: string,
    artistname: string
  ) => {
    console.log("clicked play song");
    console.log(url);
    setSongID(SongID);
    setSongUrl(url);
    setSongName(songName);
    setPhotourl(photourl);
    setArtistname(artistname);
  };

  const handlePlaySOngArray = (
    url: string[],
    songName: string[],
    photourl: string[]
  ) => {
    console.log("inside handle play song array in APP.TSX");
    console.log(url);
    setSongUrlArray(url);
    setSongNameArray(songName);
    setPhotourlArray(photourl);
  };

  return (
    <div>
      <BrowserRouter>
        <Fixedcomp
          SongID={songID}
          songUrl={songUrl}
          songname={songname}
          photourl={photourl}
          artistname={artistname}
          songIDArray={songIdArray}
          songUrlArray={songUrlArray}
          songNameArray={songNameArray}
          photoUrlArray={photoUrlArray}
        />
    <Routes>
      <Route path="/" element={<Home onPlaySong={handlePlaySong} onPlaySongArray={handlePlaySOngArray}/>} />
      <Route path="/songpage" element={<SongPage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="*" element={<PageNotFound/>} />
      <Route path="/profile" element={<Profile onPlaySong={handlePlaySong}/>} />
      {/* <Route path="/Playlist" element={<PlayList PlaylistName={''} NumOfSongs={0}/>} /> */}
      <Route path="/upload" element={<Upload/>} />
      <Route path='/govern' element = {<Govern/>}/>
      <Route path='/playlist' element = {<PlayList PlaylistName='abc' NumOfSongs= {4} />}/>


      

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
