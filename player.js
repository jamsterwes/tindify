var my_device_id = null;
var last_track = {id: null};

var playSong = function(song_id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://api.spotify.com/v1/me/player/play?device_id=" + my_device_id);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("accessToken"));

    xhr.send(JSON.stringify({
        uris: ["spotify:track:" + song_id]
    }));
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = localStorage.getItem("accessToken");
    const player = new Spotify.Player({
        name: "Wesley Quickstart Web Player",
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Update player state
    player.addListener('player_state_changed', ({ position, duration, track_window: {current_track} }) => {
        console.log("Current Track: ", current_track);
        // Get album cover
        var url = current_track.album.images[0].url;
        document.getElementById("cover").src = url;
        // Get song title
        var title = current_track.name;
        document.getElementById("song-title").innerText = title;
        // Get song artists
        var artists = current_track.artists.map(function(artist) { return artist.name; });
        document.getElementById('song-artist').innerText = artists.join(", ");
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        my_device_id = device_id;
        console.log('Ready with Device ID', device_id);
        playSong("1utTJXz5WzG0tONsJYKywl");
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
    };

    player.connect();
}