import placeholder from "../../assets/placeholder.png";
import { motion } from "framer-motion";
import Playlist from "../components/Playlist";
import { accessToken, logout } from "../../utility/api_auth";
import {
  getUserInfo,
  getUserPlaylists,
  getUserSavedTracks,
  getUserTopItems,
} from "../../utility/api_endpoints";
import { useState, useEffect, Suspense } from "react";
import { useLoaderData, defer, Await, useRevalidator } from "react-router-dom";
import PlaylistModalPortal from "../components/PlaylistModalPortal";

// const playlistDetails = await getPlaylistDetails(id, accessToken)
export async function loader() {
  const userInfoPromise = getUserInfo(accessToken);
  const playlistsPromise = getUserPlaylists(accessToken);
  const topItemsPromise = getUserTopItems("long_term", accessToken);
  const savedTracksPromise = getUserSavedTracks(accessToken);
  return defer({
    userInfo: userInfoPromise,
    playlists: playlistsPromise,
    topItems: topItemsPromise,
    savedTracks: savedTracksPromise,
  });
}

export default function Home() {
  const data = useLoaderData();
  const [isOpen, setIsOpen] = useState(false);
  const [savedTracks, setSavedTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const [playlistImage, setPlaylistImage] = useState([]);

  const handlePlaylistClick = (id, cover, name, snapshot_id) => {
    setSelectedPlaylist(id);
    setPlaylistImage([cover, name, snapshot_id]);
    setIsOpen(true);
  };
  let revalid = useRevalidator()
  return (
    <>
      <button onClick={() => logout()}>Logout</button>
      <Suspense fallback={<p>Loading Saved Tracks...</p>}>
        <Await resolve={data.savedTracks} errorElement={<p>Could'nt get it</p>}>
          {(savedTracks) => {
            setSavedTracks(savedTracks);
            return (
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.userInfo}
                  errorElement={<p>Error Getting UserInfo ;c</p>}
                >
                  {(userInfo) => (
                    <>
                      <section className="home-dashboard">
                        <div className="dashboard-info"></div>
                        <motion.img
                          src={userInfo.images[0].url}
                          className="dashboard-profile_img"
                        />

                        <motion.div className="dashboard-user_info">
                          <p className="dashboard-user_display_name">
                            {`Welcome to setlist, ${userInfo.display_name} !`}
                          </p>
                          {/* <div className="dashboard-top-items">
                                <h3>Your Top Artists</h3>
                                {topItems.items.map(item => (<>
                                    <p>{`Artist: ${item.name}`}</p>
                                    <p>{`Artist's Genre: ${item.genres[0]}`}</p>
                               </> ))}
                               </div> */}
                        </motion.div>
                        <section className="playlists-section">
                          <h2>Your Playlists</h2>
                          <Suspense fallback={<p>Loading...</p>}>
                            <Await
                              resolve={data.playlists}
                              errorElement={
                                <p>Error getting the playlists...</p>
                              }
                            >
                              {(playlists) => (
                                <motion.div className="playlists-grid">
                                  {playlists.items
                                    .filter(
                                      (playlist) =>
                                        playlist.owner.id === userInfo.id,
                                    )
                                    .map((playlist) => (
                                      <Playlist
                                        name={playlist.name}
                                        key={playlist.id}
                                        id={playlist.id}
                                        images={playlist.images}
                                        trackTotal={playlist.tracks.total}
                                        snapshot_id={playlist.snapshot_id}
                                        description={playlist.description}
                                        openModal={() =>
                                          handlePlaylistClick(
                                            playlist.id,
                                            playlist.images,
                                            playlist.name,
                                            playlist.snapshot_id
                                          )
                                        }
                                      />
                                    ))}
                                </motion.div>
                              )}
                            </Await>
                          </Suspense>
                        </section>
                        <PlaylistModalPortal
                          open={isOpen}
                          onClose={() => setIsOpen(false)}
                          selectedPlaylistID={selectedPlaylist}
                          savedTracks={savedTracks}
                          playlistImage={playlistImage}
                        />
                      </section>
                    </>
                  )}
                </Await>
              </Suspense>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
