function setCover(id, coverBlob) {
    var url = "https://api.spotify.com/v1/playlists/" + id + "/images";

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.setRequestHeader("Content-Type", "image/png");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("accessToken"));
    
    xhr.send(coverBlob);
}


fetch("/assets/tindify_album.png")
    .then(res => res.blob())
    .then(blob => {
        setCover("6do4W6GqtfADlnQPxKxTrp", blob)
    });