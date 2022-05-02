// Constants
var client_id = "295da56c9fb14e10a173a5fac6a3ba4f";
var redirect_uri = "https://tindify-beta.herokuapp.com/authcode.html";
var show_dialog = true;
// TODO: CHANGE THIS TO BE RANDOM!!!!
var verifier = "EseehPSkqOk3dFfHRgqIEseehPSkqOk3dFfHRgqI33~";
// TODO: state parameter

// Handle presenting spotify login page
var getSpotifyURL = function(state) {
    // Get challenge
    var challengeArr = sha256.array(verifier);
    var challenge = btoa(String.fromCharCode(...challengeArr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    // Build state
    var stateText = "";
    if (state !== undefined) stateText = "&state=" + state;
    // Build URL
    var url = "https://accounts.spotify.com/authorize?response_type=code"
                + "&client_id=" + client_id
                + "&redirect_uri=" + redirect_uri
                + stateText
                + "&scope=streaming%20user-read-email%20user-read-private"
                + "&code_challenge=" + challenge
                + "&code_challenge_method=S256";
    return url;
}

// Get auth code from params
var getAuthCode = function() {
    return window.location.search.substring(6);
}

// Get authentication token
// cb(accessToken, refreshToken)
var getAuthToken = function(authCode, cb) {
    var xhr = new XMLHttpRequest();
    var url = "https://accounts.spotify.com/api/token?"
              + "code=" + authCode
              + "&redirect_uri=" + redirect_uri
              + "&grant_type=authorization_code"
              + "&client_id=295da56c9fb14e10a173a5fac6a3ba4f"
              + "&code_verifier=" + verifier // TODO: get verifier from localStorage
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", "Basic Mjk1ZGE1NmM5ZmIxNGUxMGExNzNhNWZhYzZhM2JhNGY6YWMwZWMxYmI0M2U4NDMzNTg1NjM2YWIzNGFiNDdlMGM=");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        console.log(xhr.responseText);
        var responseObj = JSON.parse(xhr.responseText);
        cb(responseObj["access_token"], responseObj["refresh_token"]);
    }

    xhr.send();
}

var saveTokens = function(access, refresh) {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
}