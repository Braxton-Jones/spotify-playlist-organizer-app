import React, { Suspense } from "react";
import ReactDom from "react-dom";
import { Await } from "react-router-dom";
import { getPlaylistDetails } from "../../utility/api_endpoints";
import { accessToken } from "../../utility/api_auth";
import { getMatchingSongs } from "../../utility/edit_utility";

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .8)",
  zIndex: 1000,
};

export default function PlaylistModalPortal({ open, children, onClose, selectedPlaylistID, savedTracks }) {
  if (!open) return null;
  const playlistSongs = getPlaylistDetails(selectedPlaylistID, accessToken)

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div className="songs-wrapper">
      <button onClick={onClose}>Close Modal</button>
        <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={playlistSongs}
              errorElement={<p>Error Getting Songs...</p>}
            >
              {(songs)=>{
                const songsList = getMatchingSongs(songs.items, savedTracks)
                console.log("check here", songsList)
                return(
                  songsList.map(song => (
                    <div className="available_song">
                      <div style={{
                            backgroundImage: `url(${song.track.album.images[0].url})`,
                            width: '50px',
                            height: '50px',
                            backgroundSize: "cover"
                      }}></div>
                      <p>{song.track.name}</p>
                      <p>{song.track.album.artists.map(artist => {return `${artist.name} `})}</p>
                      <button disabled={song.inPlaylist}>ADD</button>


                    </div>
                  ))
                )
              }}

            </Await>
        </Suspense>
        {children}
      </div>
    </>,
    document.getElementById("portal"),
  );
}
