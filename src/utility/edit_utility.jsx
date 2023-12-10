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
  const playlistDataPromises = playlistIDs.map((playlistID) =>
    getPlaylist(playlistID, accessToken),
  );
  try {
    const playlistDetails = await Promise.all(playlistDetailsPromises);
    const playlistData = await Promise.all(playlistDataPromises);

    // Combine playlistDetails and playlistCovers into an array of objects
    const aggregatedPlaylists = playlistDetails.map((details, i) => ({
      details,
      data: playlistData[i],
    }));

    return aggregatedPlaylists;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};

export const generateAggregatedTracksList = (savedTracks, Playlists, selectedPlaylists) => {
  const TrackList = [...savedTracks]; // Copy savedTracks to TrackList

  Playlists.forEach((playlist) => {
    playlist.details.forEach((track) => {
      const matchingTrack = TrackList.find(
        (savedTrack) => savedTrack.track.id === track.track.id,
      );

      if (matchingTrack) {
        // If there is a match, check if the matches property exists
        // If not, create it as an array
        if (!matchingTrack.matches) {
          matchingTrack.matches = [];
        }

        // Check if there is no duplicate match with the same playlist name
        const isDuplicate = matchingTrack.matches.some(
          (match) => match.matchedPlaylistName === playlist.data.name,
        );

        if (!isDuplicate) {
          matchingTrack.matches.push({
            matchedPlaylistName: playlist.data.name,
            matchedPlaylistCover: playlist.data.images[0].url,
          });
        }

        // Add selectedPlaylists to the track
        matchingTrack.selectedPlaylists = selectedPlaylists;
      } else {
        // If there is no match, add the new property directly to the original object
        TrackList.push({
          ...track,
          matches: [
            {
              matchedPlaylistName: playlist.data.name,
              matchedPlaylistCover: playlist.data.images[0].url,
            },
          ],
          // Add selectedPlaylists to the track
          selectedPlaylists: selectedPlaylists,
        });
      }
    });
  });

  // Remove matches that don't exist in Playlists
  TrackList.forEach((track) => {
    if (track.matches) {
      track.matches = track.matches.filter((match) =>
        Playlists.some(
          (playlist) =>
            playlist.data.name === match.matchedPlaylistName &&
            playlist.data.images[0].url === match.matchedPlaylistCover,
        ),
      );
    }
  });

  return TrackList;
};

