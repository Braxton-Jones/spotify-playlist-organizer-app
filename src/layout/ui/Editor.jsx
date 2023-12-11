import { accessToken } from "../../utility/api_auth";
import styles from "./editor.module.scss";
import { addSongToPlaylist, generateAggregatedTracksList } from "../../utility/edit_utility";
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
  const [playlistCovers, setPlaylistCovers] = useState([]);
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
      const playlistCovers = await Promise.all(playlistCoverPromises);
      const playlistData = await Promise.all(playlistDataPromises);

      // Combine playlistDetails and playlistCovers into an array of objects
      const aggregatedPlaylists = playlistDetails.map((details, i) => ({
        details,
        data: playlistData[i],
        playlistCovers,
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
        console.log("1", PlaylistTracks);
        if (PlaylistTracks.length > 0) {
          setPlaylistCovers(PlaylistTracks[0].playlistCovers);
        } else {
          setPlaylistCovers([]);
        }
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
  console.log("PlaylistCovers", playlistCovers);

  const handleButtonClick = (data, cover) => {
    console.log("data", data);
    console.log("cover", cover);
    if (data && data.matches) {
      data.matches.forEach((match, index) => {
        const matchingId = selectedIDs[index];
        console.log("ID:", matchingId);
        if (match.matchedPlaylistCover === cover.url) {
          console.log("remove song from playlist");
        } else {
          console.log("add song to playlist");
        }
      });
    }
  };


  return (
    <section className={styles.editor}>
      <div className={styles.editor_header}>
        <h2>Your Song Library</h2>
      </div>
      <div className={styles.editor_grid}>
        {Tracklist.map((data) => {
   
          return(
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
                {playlistCovers.map((coversArray, index) => (
                  <div key={index}>
                    {coversArray[0] && (
                      <button
                        key={coversArray[0].url}
                        className={
                          coversArray.filter(cover => 
                            data.matches && data.matches.some(match => match.matchedPlaylistCover === cover.url)
                          ).length > 0
                            ? styles.matched_playlist
                            : styles.unmatched_playlist
                        }
                        style={{
                          backgroundImage: `url(${coversArray[0].url})`,
                          borderRadius: "10px",
                          width: "50px",
                          height: "50px",
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          border: "none",
                        }}
                        onClick={() => handleButtonClick(data, coversArray[0])}
                      >
                        {/* Additional content or styling if needed */}
                      </button>
                    )}
                  </div>
                ))}
             

              {/* {data.matches && data.matches.length > 0 && (
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
              )} */}
            </div>
          </section>
)})}
      </div>
    </section>
  );
}
