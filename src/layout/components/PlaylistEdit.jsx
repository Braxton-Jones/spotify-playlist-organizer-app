import { Suspense } from "react";
import { Await } from "react-router-dom";
import { getPlaylistDetails } from "../../utility/api_endpoints";
import { accessToken } from "../../utility/api_auth";
import { motion } from "framer-motion";
import { removeSongFromPlaylist } from "../../utility/edit_utility";
import { useRevalidator } from "react-router-dom";

export default function PlaylistEdit(props) {
  console.log("deatils", props.details);
  let revalidator = useRevalidator()
  const playlistTracks = getPlaylistDetails(props.details.id, accessToken);
 
  return (
    <section className="playlist-edit">
      <section className="playlist-edit_info">
        <h1>Playlist Name: {props.details.name}</h1>
        <motion.button
          onClick={props.resetPlaylistDetails}
          whileTap={{ scale: 0.99, opacity: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          {`<- Go back to Playlists`}
        </motion.button>
      </section>
      <Suspense
        fallback={
          <>
            <p>Loading...</p>
          </>
        }
      >
        <Await resolve={playlistTracks} errorElement={<p>Error!</p>}>
          {(tracksInfo) => {
            console.log(tracksInfo);
            if(tracksInfo){
              props.setPlaylistTracks(tracksInfo)
            }
            
            return (
              <>
                <div className="track-wrapper">
                  {tracksInfo.map((data) => (
                    <div className="playlist-track">
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundImage: `url(${data.track.album.images[0].url})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          borderRadius: "10px",
                        }}
                      />
                      <div className="playlist-track_details">
                        <p>{data.track.name}</p>
                        <p>{data.track.artists[0].name}</p>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => {
                          removeSongFromPlaylist(
                              props.details.id, 
                              accessToken, 
                              data.track.uri, 
                              props.details.snapshot_id)
                          revalidator.revalidate()
                            }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}
