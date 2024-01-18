import React, { useEffect } from 'react'
import '../style/profile.css'
import api from '../API/Playlist.json'
import PlaylistCard from '../Music/PlayList'
import { Link } from 'react-router-dom'
import '../style/playlist.css'
// import likedSongsApi from '../API/LikedSong.json'
import LikedSongCard from '../Music/LikedSongs'
import Transaction from '../API/Transaction.json'
import TransactionCard from '../Music/TransactionCard'
import {useState} from 'react';
import { Network, Provider } from 'aptos'
import { useWallet } from "@aptos-labs/wallet-adapter-react"

 


type Song = {
    album_id: BigInteger,
    song_id: BigInteger,
    artist_address: string,
    name: String,
    duration: BigInteger,
    num_likes: BigInteger,
    current_price: BigInteger,
    date: BigInteger,
    cid: String,
    num_streams: BigInteger,
    genre: String,
    preview_info: [],
}
type Transaction = {
    from_address:String,
    price:BigInteger,
    song_id:BigInteger,
    to_address:String,
}
type Playlist = {
    playlist_id: BigInteger,
    playlist_name: string,
    songs: [],
    date_added: string,
}

const provider = new Provider(Network.DEVNET);
type EntryFunctionId = string;
type MoveType = string;
type ViewRequest = {
  function: EntryFunctionId;
  type_arguments: Array<MoveType>;
  arguments: Array<any>;
};
const Profile = (props: any) => {
    const [isLikedSongFetched, setIsLikedSongFetched] = useState(false);
    const [isRecentSongFetched, setIsRecentSongFetched] = useState(false);
    const [isTransactionFetched, setIsTransactionFetched] = useState(false);
 
    const [isPlaylistFetched, setIsPlaylistFetched] = useState(false);
    const[trasactionApi,setTransactionApi]=useState<Transaction[]>([]);
    const [likedSongsApi, setLikedSongsApi] = useState<Song[]>([]);
    const [recentSongsApi, setRecentSongsApi] = useState<Song[]>([]);

    
    var count = Object.keys(api).length;
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (args: number) => {
        setActiveTab(args);
    };

    const { account, signAndSubmitTransaction } = useWallet();
    const module_address = process.env.REACT_APP_MODULE_ADDRESS;

    // console.log("profile : ", account);

    // const [playlists, setPlaylists] = useState<Task[]>([]);
    // const [newTask, setNewTask] = useState<string>("");
    const [accountHasResource, setAccountHasResource] = useState(false);
    const [accountHasPlaylist, setAccountHasPlaylist] = useState(false);
    const [accountHasUser, setAccountHasUser] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    let accountname= account?.address

    useEffect(() => {  
        // fetchPlaylists();
        fetchLikedSongs();
        // fetchRecentSongs();
        fetchTransactions();
    }, [accountHasPlaylist, accountHasUser, isLikedSongFetched, isRecentSongFetched, isTransactionFetched]);

    const createUser = async () => {
        if (!account) return [];
        const payload = {
            type: "entry_function_payload",
            function: `${module_address}::Profile::create_user`,
            type_arguments: [],
            arguments: [],
        };
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(payload);
            console.log("response", response)
            await provider.waitForTransaction(response.hash);
            setAccountHasUser(true);
            console.log("Completed adding User")
        }
        catch (error: any) {
            setAccountHasUser(false);
        }
    }
    const fetchTransactions = async () => {

        if (!account) return [];
        const payload:ViewRequest = {
            function: `${module_address}::Profile::getTransactionHistory`,
            type_arguments: [],
            arguments: [account?.address],
        };

        try {
            const response = await provider.view(payload);
            let songDetails = JSON.parse(JSON.stringify(response));
            setTransactionApi(songDetails[0]);

            // console.log("Transactions");
            // console.log(songDetails);
            setIsTransactionFetched(true);
            return response;
        } catch (error: any) {
            console.error("Error getting transactions:", error);
        }
    }
    const fetchLikedSongs = async () => {

        if (!account) return [];
        const payload:ViewRequest = {
            function: `${module_address}::Profile::viewLikedSongsMain`,
            type_arguments: [],
            arguments: [account?.address],
        };

        try {
            const response = await provider.view(payload);
            let songDetails = JSON.parse(JSON.stringify(response));
            setLikedSongsApi(songDetails[0]);

            // console.log("Liked Songs");
            // console.log(response);
            setIsLikedSongFetched(true);
            return response;
        } catch (error: any) {
            console.error("Error getting liked songs:", error);
        }
    }
    
    const createResource = async () => {
        if (!account) return [];
        const payload = {
            type: "entry_function_payload",
            function: `${module_address}::Profile::create_resource`,
            type_arguments: [],
            arguments: [],
        };
        try {
            // sign and submit transaction to chain
            const response = await signAndSubmitTransaction(payload);
            await provider.waitForTransaction(response.hash);
            setAccountHasResource(true);
            console.log("Completed adding resource")
        }
        catch (error: any) {
            setAccountHasResource(false);
            console.log("ERROR-----", error)
        }
    }

    const addNewPlaylist = async () => {
        if (!account) return [];
        // console.log("entered add new playlist", account.address)
        const payload = {
            type: "entry_function_payload",
            function: `${module_address}::Profile::create_playlist`,
            type_arguments: [],
            arguments: [5, "Hello World", "2023-01-01"],
        };
        try {
            // sign and submit transaction to chain
            // console.log("entered try loop", payload)
            const response = await signAndSubmitTransaction(payload);
            // console.log("response", response)
            await provider.waitForTransaction(response.hash);
            setAccountHasPlaylist(true);
            console.log("Completed")
        }
        catch (error: any) {
            setAccountHasPlaylist(false);
        }
        // finally {
        //     setTransactionInProgress(false);
        // }
    }

    const addLikes = async () => {
        if (!account) return [];
        const payload = {
            type: "entry_function_payload",
            function: `${module_address}::Profile::addLike`,
            type_arguments: [],
            arguments: [1],
        };
        try {
            // sign and submit transaction to chain
            // console.log("entered try loop for addLikes", payload)
            const response = await signAndSubmitTransaction(payload);
            await provider.waitForTransaction(response.hash);
            console.log("Completed")
        }
        catch (error: any) {
            console.log("ERROR-----", error)
        }
    }

    const fetchPlaylists = async () => {
        console.log("Entered fetch playlists")
        if (!account) return [];
        // console.log(module_address)
        try {
            const Playlists_Table = await provider.getAccountResource(
                account.address,
                `${module_address}::Profile::Playlists_Table`
            );
            // console.log("Playlists_Table---------------")
            // console.log(Playlists_Table)
            // setAccountHasPlaylist(true);

            // const tableHandle = (Playlists_Table as any).data.tasks.handle;
            // const taskCounter = (Playlists_Table as any).data.task_counter;

            // let tasks = [];
            // let counter = 1;
            // while (counter <= taskCounter) {
            //     const tableItem = {
            //         key_type: "u64",
            //         value_type: `${module_address}::todolist::Task`,
            //         key: `${counter}`,
            //     };
            //     const task = await provider.getTableItem(tableHandle, tableItem);
            //     tasks.push(task);
            //     counter++;
            // }
            // setTasks(tasks);
        }
        catch (e: any) {
            setAccountHasPlaylist(false);
        }
    }
 const create_Song=async()=>{
    if(!account) return [];

    const payload={
        type:"entry_function_payload",
        function:`${module_address}::Profile::create_song`,
        type_arguments:[],
        arguments:[1,1,"Song1",180,101,20231231,"onasdolflsandflknsadf","genre",0,120],
    };
    try{
        const response=await signAndSubmitTransaction(payload);
        await provider.waitForTransaction(response.hash);

        // console.log(response);
        console.log("completed")
    }
    catch(error:any){
        console.log("error",error)
    }


 }
    const playlistContent = () => {
        return (
            <div className='Playlists'>
              {/* {!accountHasUser ? <button onClick={createResource}>Create resource</button> : <div></div> }
                {!accountHasPlaylist && <button onClick={addNewPlaylist}>Add Playlist</button>}
                {!accountHasUser && <button onClick={createUser}>Create Artist</button>}
                <h1>kasbdfaskdfkasdfb</h1>
                <button onClick={create_Song}>Create Song</button> */}
                {accountHasPlaylist && api.map((apimusic, index) => {
                    return (
                        <div className="pc">
                            <PlaylistCard PlaylistName={apimusic.PlaylistName} NumOfSongs={apimusic.Songs.length} />
                        </div>
                    )
                })}
            </div>
        );
    }

    const likedSongContent = () => {
        return (
            <div className='Playlists'>

                {JSON.parse(JSON.stringify(likedSongsApi)).map((apimusic:any) => {
                    return (
                        <div className="pc">
                            <LikedSongCard PhotoUrl={apimusic.photoLink} SongName={apimusic.name} ArtistName={apimusic.artist_address} AlbumName={apimusic.album_id} />
                        </div>
                    )
                })}
            </div>
        );
    }

    const recentSongContent = () => {
        return (
            <div className='Playlists'>
                 {JSON.parse(JSON.stringify(likedSongsApi)).map((apimusic:any) => {
                    return (
                        <div className="pc">
                            <LikedSongCard PhotoUrl={apimusic.photoLink} SongName={apimusic.name} ArtistName={apimusic.artist_address} AlbumName={apimusic.album_id} />
                        </div>
                    )
                })}
            </div>
        )
    }

    const transactionContent = () => {
        return (

            <div className='Playlists'>
                {JSON.parse(JSON.stringify(trasactionApi)).map((apimusic:any) => {
                    return (
                        <div className="pc">
                            <TransactionCard TransactionID={apimusic.transaction_id} TransactionDate={apimusic.to_address} SongName={apimusic.song_id} />
                        </div>
                    )
                })}
            </div>
        )
    }

    function Tabs({ activeTab }: { activeTab: number }) {
        switch (activeTab) {
            case 0:
                return playlistContent();
            case 1:
                return likedSongContent();
            case 2:
                return recentSongContent();
            case 3:
                return transactionContent();
            default:
                return <div>No tab selected</div>;
        }
    }

    return (
        <div className='page'>

            <div className='profile-header'>
                <div className='profile-header-start'>
                    <h2>Profile Details</h2>
                </div>
                <div className='profile-header-start-h1'>
                    <h3>User key : {accountname}</h3>
                </div>
                <div className='profile-header-start'>
                    <p>Playlists : {count} </p>

                </div>
            </div>

            <div className='temp'>
                <div className='tabs'>
                    <button onClick={() => { handleTabChange(0) }} className={activeTab == 0 ? "active-button" : "non-active-button"}>Your Playlist</button>
                    <button onClick={() => { handleTabChange(1) }} className={activeTab == 1 ? "active-button" : "non-active-button"}>Liked Songs</button>
                    <button onClick={() => { handleTabChange(2) }} className={activeTab == 2 ? "active-button" : "non-active-button"}>Recent Songs</button>
                    <button onClick={() => { handleTabChange(3) }} className={activeTab == 3 ? "active-button" : "non-active-button"}>Transaction History</button>

                </div>


                {Tabs({ activeTab })}

                <br />

            </div>

        </div>
    )


}
export default Profile;


