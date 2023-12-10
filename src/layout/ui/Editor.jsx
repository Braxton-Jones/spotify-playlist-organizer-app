import { accessToken } from "../../utility/api_auth";
import styles from "./editor.module.scss";
import { generateAggregatedTracksList } from "../../utility/edit_utility";
import { Suspense } from "react";
import { Await } from "react-router-dom";
import { getPlaylist } from "../../utility/api_endpoints";
import {
  getPlaylistDetails,
  getPlaylistCover,
} from "../../utility/api_endpoints";
import { useState, useEffect } from "react";

export default function Editor(props) {
  const selectedIDs = props.selectedPlaylists;
  const [playlistSelect, setPlaylistSelect] = useState([]);
  const aggregatePlaylistsTracks = async (playlistIDs) => {
    const playlistDetailsPromises = playlistIDs.map((playlistID) =>
      getPlaylistDetails(playlistID, accessToken),
    );

    const playlistCoverPromises = playlistIDs.map((playlistID) =>
    getPlaylistCover(playlistID, accessToken),
  );

    const playlistDataPromises = playlistIDs.map((playlistID) =>
      getPlaylist(playlistID, accessToken),
    );
    try {
      const playlistDetails = await Promise.all(playlistDetailsPromises);
      const playlistCovers = await Promise.all(playlistCoverPromises)
      const playlistData = await Promise.all(playlistDataPromises);

      // Combine playlistDetails and playlistCovers into an array of objects
      const aggregatedPlaylists = playlistDetails.map((details, i) => ({
        details,
        data: playlistData[i],
        playlistCovers
      }));

      return aggregatedPlaylists;
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const PlaylistTracks = await aggregatePlaylistsTracks(selectedIDs);
        setPlaylistSelect(PlaylistTracks);
      } catch (error) {
        console.error("Error fetching playlist tracks:", error);
      }
    };

    fetchData();
  }, [props.selectedPlaylists]);
  const Tracklist = generateAggregatedTracksList(
    props.savedTracks,
    playlistSelect,
  );
  console.log("Tracklist", Tracklist);
  console.log("PlaylistSelected", playlistSelect);

  return (
    <section className={styles.editor}>
      <div className={styles.editor_header}>
        <h2>Your Song Library</h2>
      </div>
      <div className={styles.editor_grid}>
        {Tracklist.flat().map((data) => (
          <section className={styles.track_section} key={data.track.id}>
            <div
              className={styles.track_image}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "10px",
                backgroundImage: `url(${data.track.album.images[0].url}`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
            <div className={styles.track_details}>
              <h1 className="song-title">{data.track.name}</h1>
              <p className="song-artist">{data.track.album.artists[0].name}</p>
            </div>
            <div className={styles.track_matches}>
              {data.matches && data.matches.length > 0 && (
                <div className={styles.matches_container}>
                  {data.matches.map((match, index) => (
                    <div key={index} className={styles.match_item}>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "10px",
                          backgroundImage: `url(${match.matchedPlaylistCover}`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
