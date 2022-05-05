var my_device_id = null;
var last_track = {id: null};
var next_tracks = [];
var player = null;

var playSong = function(song_id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://api.spotify.com/v1/me/player/play?device_id=" + my_device_id);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("accessToken"));

    xhr.send(JSON.stringify({
        uris: ["spotify:track:" + song_id]
    }));
}

var getRecommendations = function(cb) {
    var seedArtists = ["6nB0iY1cjSY1KyhYyuIIKH", "5he5w2lnU9x7JFhnwcekXX", "5K4W6rqBFWDnAN6FQUkS6x"].join(",");
    var seedGenres = [].join(",");
    var seedTracks = [].join(",");
    
    var url = "https://api.spotify.com/v1/recommendations"
              + "?seed_artists=" + seedArtists
              + "&seed_genres=" + seedGenres
              + "&seed_tracks=" + seedTracks;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("accessToken"));

    xhr.onload = function() {
        cb(JSON.parse(xhr.responseText));
    };
    
    xhr.send();
}

var setVolume = function(pct) {
    var url = "https://api.spotify.com/v1/me/player/volume?device_id=" + my_device_id + "&volume_percent=" + Math.trunc(pct).toString();

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("accessToken"));
    
    xhr.send();
}

var paintVolume = function(pct) {
    var color = "var(--slider-fill)";
    var bkg = "--volume-slidebkg: linear-gradient(90deg, " + color + " 0%, " + color + " " + pct + "%, black " + (pct + 1) + "%);";
    var iconID = "0";
    if (pct >= 66) iconID = "3";
    else if (pct >= 33) iconID = "2";
    else if (pct >= 1) iconID = "1";
    var icon = "--slider-icon: url(/assets/volume/volume_icon_" + iconID + ".png);";
    document.getElementById("volume").style = bkg + icon;
}


document.getElementById("volume-input").oninput = function() {
    paintVolume(parseInt(document.getElementById("volume-input").value));
}

document.getElementById("volume-input").onchange = function() {
    setVolume(parseInt(document.getElementById("volume-input").value));
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = localStorage.getItem("accessToken");
    player = new Spotify.Player({
        name: "Tindify Web Player",
        getOAuthToken: cb => { cb(token); },
        volume: 0.12
    });
    paintVolume(12);

    // Update player state
    player.addListener('player_state_changed', ({ position, duration, paused, track_window: {current_track} }) => {
        // Remove playing from play button
        document.getElementById("play-button").classList.remove("playing");
        // If playing, add to play button
        if (!paused) document.getElementById("play-button").classList.add("playing");
        // Get album cover
        var url = current_track.album.images[0].url;
        document.getElementById("cover").style = "background-image: url(" + url + ")";
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
        // Recommendations lol
        getRecommendations(function(tracks) {
            next_tracks = tracks.tracks.map(function(track) { return track.id; });
            playSong(next_tracks[0]);
        });
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

    document.getElementById('play-button').onclick = function() {
        player.togglePlay();
    };

    var playNewSong = function() {
        next_tracks = next_tracks.slice(1);
        playSong(next_tracks[0]);
    };

    document.getElementById('nope-button').onclick = playNewSong;
    document.getElementById('like-button').onclick = playNewSong;

    player.connect();
}