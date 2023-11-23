// Import necessary Move modules and libraries
module profile_addr::Profile {
    // use aptos_framework::account;
    use std::signer;
    use std::vector;
    use std::string::String;
     #[test_only]
    use std::string;

    // Struct to represent a song
    struct Song has key {
        album_id: u64,
        song_id: u64,
        file: vector<u8>,
        artist_address: address,
        name: String,
        duration: u64,
        num_likes: u64,
        current_price: u64,
        date: u64,
        cid: u64,
        num_streams: u64,
        genre: String,
        preview_info: String,
    }

    // Struct to represent a user
    struct User has key{
        user_address: address,
        liked_songs: vector<u64>,
        playlist: vector<PlaylistEntry>,
        transaction_history: vector<u64>,
        listening_history: vector<u64>,
    }

    // Struct to represent a transaction
    struct Transaction {
        price: u64,
        transaction_id: u64,
        timestamp: u64,
        song_id: u64,
    }

    // Struct for playlist entry
    struct PlaylistEntry has store {
        song_id: u64,
        name: String,
    }

    // Struct to represent an artist
    struct Artist has key{
        user_address: address,
        liked_songs: vector<u64>,
        playlist: vector<PlaylistEntry>,
        transaction_history: vector<u64>,
        listening_history: vector<u64>,
        uploaded_songs: vector<u64>,
        earner_money: u64,
    }

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;

    // Function to create a new user
    public fun create_user(account: &signer) {
        let user = User {
            user_address: signer::address_of(account),
            liked_songs: vector::empty<u64>(),
            playlist: vector::empty<PlaylistEntry>(),
            transaction_history: vector::empty<u64>(),
            listening_history: vector::empty<u64>(),
        };
        move_to(account, user);
    }

    // Function to create a new artist
    public fun create_artist(account: &signer) {
        let artist = Artist {
            user_address: signer::address_of(account),
            liked_songs:vector::empty<u64>(),
            playlist:vector::empty<PlaylistEntry>(),
            transaction_history: vector::empty<u64>(),
            listening_history: vector::empty<u64>(),
            uploaded_songs:vector::empty<u64>(),
            earner_money: 0,
        };
        move_to(account, artist);
    }

    // Function to create a new song
    public fun create_song(
        account: &signer,
        album_id: u64,
        song_id: u64,
        file: vector<u8>,
        name: String,
        duration: u64,
        current_price: u64,
        date: u64,
        cid: u64,
        genre: String,
        preview_info: String,
    ) acquires Artist{
        // Get the artist's address
        let artist_address = signer::address_of(account);

        // Ensure the artist has been created (you might want additional checks here)
        assert!(exists<Artist>(artist_address), E_NOT_INITIALIZED);

        // Create a new Song
        let song = Song {
            album_id,
            song_id,
            file,
            artist_address,
            name,
            duration,
            num_likes: 0,
            current_price,
            date,
            cid,
            num_streams: 0,
            genre,
            preview_info,
        };
        let song_id_copy = song.song_id;
        // Move the Song resource under the artist's account
        move_to(account, song);

        // Add the song to the artist's uploaded_songs
        let  artist_var: &mut Artist = borrow_global_mut(artist_address);

        vector::push_back(&mut artist_var.uploaded_songs, song_id_copy);

    }
    // Test flow
    #[test(admin = @0x123)]
    public entry fun test_profile_flow(admin: signer) acquires  Artist, Song {
        // Create a user
        create_user(&admin);

        // Make the user an artist
        create_artist(&admin);

        // Upload a song by the artist
        create_song(
            &admin,
            1, // album_id
            1, // song_id
            vector::empty<u8>(), // file data
            string::utf8(b"Song name"), // name
            180, // duration
            100, // current_price
            20231231, // date
            123, // cid
            string::utf8(b"Rock"), // genre
            string::utf8(b"Preview Info"), // preview_info
        );

        // Check if the song is successfully uploaded
        let artist_var = borrow_global<Artist>(signer::address_of(&admin));
        assert!(vector::length(&artist_var.uploaded_songs) == 1,1);


        // Retrieve the uploaded song
        let song = borrow_global<Song>(signer::address_of(&admin));
        assert!(song.album_id == 1, 2);
        assert!(song.song_id == 1, 3);
        assert!(song.artist_address == signer::address_of(&admin), 4);
        assert!(song.name == string::utf8(b"Song name"), 5);
        assert!(song.duration == 180, 6);
        assert!(song.current_price == 100, 7);
        assert!(song.date == 20231231, 8);
        assert!(song.cid == 123, 9);
        assert!(song.num_streams == 0, 10);
        assert!(song.genre == string::utf8(b"Rock"), 11);
        assert!(song.preview_info == string::utf8(b"Preview Info"), 12);
    }
}
