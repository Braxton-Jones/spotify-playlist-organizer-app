import React from "react";
import styles from "./playlistSelect.module.scss";
import Playlist from "../components/Playlist";

export default function PlaylistSelect(props) {
  const addPlaylistToEditor = (id) => {
    props.setSelectedPlaylists((prevSelectedPlaylists) => {
      if (prevSelectedPlaylists.includes(id)) {
        // If the id is already in the array, remove it
        return prevSelectedPlaylists.filter((playlistId) => playlistId !== id);
      } else {
        // If the id is not in the array, add it
        return [...prevSelectedPlaylists, id];
      }
    });
  };

  return (
    <section className={styles.playlist_select}>
      <div className={styles.playlist_header}>
        <h2>Your Playlists </h2>
        {/* Make Color Change when max selection */}
        <p>Playlists Selected: {props.selectedPlaylists.length} / 5</p>
      </div>
      <section className={styles.playlist_grid}>
        {props.playlists.items
          .filter(
            (playlist) => playlist.owner.display_name === props.displayName,
          )
          .map((playlist) => (
            <Playlist
              key={playlist.id}
              playlist={playlist}
              handleSelectToggle={() => addPlaylistToEditor(playlist.id)}
              selectedPlaylists={props.selectedPlaylists}
            />
          ))}
      </section>
    </section>
  );
}
