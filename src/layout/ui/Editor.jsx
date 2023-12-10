import { accessToken } from "../../utility/api_auth";
import styles from "./editor.module.scss";
import {
  generateAggregatedTracksList,
} from "../../utility/edit_utility";
import { Suspense } from "react";
import { Await } from "react-router-dom";
import { getPlaylist } from "../../utility/api_endpoints";
import { getPlaylistDetails, getPlaylistCover } from "../../utility/api_endpoints";
import { useState } from "react";

export default function Editor(props) {
  const selectedIDs = props.selectedPlaylists;
  const [playlistSelect, setPlaylistSelect] = useState()
  const aggregatePlaylistsTracks = async (playlistIDs) => {
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

      console.log("aggie", aggregatedPlaylists)
  
      return aggregatedPlaylists;
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      throw error;
    }
  };

  const getPlaylistTracks = async () => {
    const PlaylistTracks = await aggregatePlaylistsTracks(selectedIDs);
    return PlaylistTracks
   };

   getPlaylistTracks().then((PlaylistTracks) => {
    setPlaylistSelect(PlaylistTracks)
  }).catch((error) => {
    console.error("Error fetching playlist tracks:", error);
  });
  
  console.log(playlistSelect)



  

  return (
    <section className={styles.editor}>
      <div className={styles.editor_header}>
        <h2>Your Song Library</h2>
      </div>
      <div className={styles.editor_grid}>
      </div>
    </section>
  );
}
