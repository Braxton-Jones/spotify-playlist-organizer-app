import axios from "axios";
import { getPlaylist, getPlaylistDetails } from "./api_endpoints";
import { getPlaylistCover } from "./api_endpoints";
import { accessToken } from "./api_auth";
export const getMatchingSongs = (playlistSongs, likedSongs) => {
  const originalLikedSongs = likedSongs.map((song) => ({ ...song }));

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

export const addSongToPlaylist = (id, uri) => {
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

  return new Promise((resolve, reject) => {
    axios
      .post(url, data, { headers })
      .then((response) => {
        console.log("Response from Adding:", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        reject(error);
      });
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
      console.log("Response from removing:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const aggregatePlaylistsTracks = async (playlistIDs) => {
  const playlistDetailsPromises = playlistIDs.map((playlistID) =>
    getPlaylistDetails(playlistID, accessToken),
  );
  const playlistCoversPromises = playlistIDs.map((playlistID) =>
    getPlaylistCover(playlistID, accessToken),
  );
  const playlistDataPromises = playlistIDs.map((playlistID) =>
    getPlaylist(playlistID, accessToken),
  );
  try {
    const playlistDetails = await Promise.all(playlistDetailsPromises);
    const playlistCovers = await Promise.all(playlistCoversPromises);
    const playlistData = await Promise.all(playlistDataPromises);

    // Combine playlistDetails and playlistCovers into an array of objects
    const aggregatedPlaylists = playlistDetails.map((details, i) => ({
      details,
      coverURL: playlistCovers[i],
      data: playlistData[i],
    }));

    return aggregatedPlaylists;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};

export const generateAggregatedTracksList = (savedTracks, Playlists) => {
  const TrackList = [];
  TrackList.push(savedTracks)
  console.log("in function", Playlists)
  return TrackList;
};
