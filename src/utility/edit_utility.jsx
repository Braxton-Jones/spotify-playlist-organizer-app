import axios from "axios";
export const getMatchingSongs = (playlistSongs, likedSongs) => {
  const originalLikedSongs = likedSongs;

  const playlistSongIDs = playlistSongs.map(
    (playlistSong) => playlistSong.track.id,
  );

  const matchingSongs = originalLikedSongs.map((likedSong) => {
    if (playlistSongIDs.includes(likedSong.track.id)) {
      likedSong.inPlaylist = true;
    }
    return likedSong;
  });

  return matchingSongs;
};

export const addSongToPlaylist = (id, accessToken, uri) => {
  const token = accessToken;
  const url = `https://api.spotify.com/v1/playlists/${id}/tracks`;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const data = {
    uris: [uri],
    position: 0,
  };

  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const removeSongFromPlaylist = (id, accessToken, uri, snapshot_id) => {
  const url = `https://api.spotify.com/v1/playlists/${id}/tracks`;
  const token = accessToken;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const data = {
    tracks: [
      {
        uri: uri,
      },
    ],
    snapshot_id: snapshot_id,
  };

  axios
    .delete(url, { headers, data })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
