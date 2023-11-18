import React, { Suspense, useState } from "react";
import ReactDom from "react-dom";
import { Await } from "react-router-dom";
import { getPlaylistDetails } from "../../utility/api_endpoints";
import { accessToken } from "../../utility/api_auth";
import { addSongToPlaylist, getMatchingSongs, removeSongFromPlaylist } from "../../utility/edit_utility";
import icon from "../../assets/add-svgrepo-com.svg";

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .9)",
  zIndex: 1000,
};

export default function PlaylistModalPortal({
  open,
  children,
  onClose,
  selectedPlaylistID,
  savedTracks,
  playlistImage,
}) {
  if (!open) return null;
  const playlistSongs = getPlaylistDetails(selectedPlaylistID, accessToken);

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div className="songs-wrapper">
        <div className="top-wrapper">
          <div
            className="playlist-cover"
            style={{
              backgroundImage: `url(${playlistImage[0][0].url})`,
              width: "150px",
              height: "150px",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="playlist-filters">
            <h2>Playlist Name: {playlistImage[1]}</h2>
            <div className="filters"></div>
          </div>
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={playlistSongs}
            errorElement={<p>Error Getting Songs...</p>}
          >
            {(songs) => {
              const songsList = getMatchingSongs(songs.items, savedTracks);
              //  setPlaylistImage([song])
              console.log("heh",songsList);
              return (
                <>
                  <section className="song-container">
                    {songsList.map((song) => (
                      <div className="song">
                        <div
                          className="song-image"
                          key={song.track.id}
                          style={{
                            backgroundImage: `url(${song.track.album.images[0].url})`,
                            width: "80px",
                            height: "80px",
                            borderRadius: "10px",
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                            backgroundSize: "cover",
                          }}
                        ></div>
                        <div className="song-details">
                          <p className="song-name">{song.track.name}</p>
                          <p className="song-artists">
                            {song.track.album.artists.map((artist) => {
                              return (
                                <span key={artist.id} className="artist-name">
                                  {artist.name}{" "}
                                </span>
                              );
                            })}
                          </p>
                        </div>
                        <button
                          className={`add-button ${
                            song.inPlaylist ? "remove" : "add"
                          }`}
                        >
                          <img 
                            src={icon} 
                            style={{ width: "30px" }}
                            onClick={() => {
                              if (song.inPlaylist) {
                                removeSongFromPlaylist(selectedPlaylistID, accessToken, song.track.uri, snapshot_id);
                              } else {
                                addSongToPlaylist(selectedPlaylistID, accessToken, song.track.uri);
                              }
                            }} />
                        </button>
                      </div>
                    ))}
                  </section>
                </>
              );
            }}
          </Await>
        </Suspense>
        <div className="accent-footer"></div>
      </div>
    </>,
    document.getElementById("portal"),
  );
}
