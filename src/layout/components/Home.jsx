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
import { useState, Suspense } from "react";
import { useLoaderData, defer, Await, useRevalidator } from "react-router-dom";
import ErrorPage from "../../layout/pages/ErrorPage";
import PlaylistEdit from "../components/PlaylistEdit";

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
  const [userID, setUserID] = useState("");
  const [playlistDetails, setPlaylistDetails] = useState({});
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [savedTracks, setSavedTracks] = useState([])

  function handlePlaylistClick(id, name, snapshot_id) {
    setPlaylistDetails({
      name: name,
      id: id,
      snapshot_id: snapshot_id,
    });
    setPlaylistTracks([])
  }
  return (
    <>
      <main className="app-container">
        <section className="info-and-playlists">
          <div className="user-info">
            <Suspense fallback={<h2>Loading...</h2>}>
              <Await
                resolve={data.userInfo}
                errorElement={<p>Error Getting UserInfo ;c</p>}
              >
                {(userInfo) => {
                  setUserID(userInfo.id);
                  return (
                    <>
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          backgroundImage: `url(${userInfo.images[1].url})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          borderRadius: "10px",
                        }}
                      />

                      <div className="user-info_details">
                        <h4>{`Welcome to setlist, ${userInfo.display_name} ${playlistTracks.length}  !`}</h4>
                        <p>{`Followers: ${userInfo.followers.total}`}</p>
                      </div>

                      <button onClick={() => logout()} className="logout-btn">
                        Logout
                      </button>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
          <div className="user-playlists">
            <div className="user-playlists_btns">
              <button disabled={true}>Contribute</button>
              <button disabled={true}>New Playlist +</button>
            </div>
            <Suspense fallback={<h2>Loading...</h2>}>
              <Await
                resolve={data.playlists}
                errorElement={<p>Error Getting Playlists</p>}
              >
                {(userPlaylists) => {
                  console.log(userPlaylists);
                  return (
                    <>
                      {Object.keys(playlistDetails).length === 0 ? (
                        <div className="user-playlists_grid">
                          {userPlaylists.items
                            .filter((playlist) => playlist.owner.id === userID)
                            .map((playlist) => (
                              <Playlist
                                name={playlist.name}
                                key={playlist.id}
                                id={playlist.id}
                                images={playlist.images}
                                trackTotal={playlist.tracks.total}
                                snapshot_id={playlist.snapshot_id}
                                description={playlist.description}
                                onPlaylistClick={() =>
                                  handlePlaylistClick(
                                    playlist.id,
                                    playlist.name,
                                    playlist.snapshot_id,
                                  )
                                }
                              />
                            ))}
                        </div>
                      ) : (
                        <div>
                          <PlaylistEdit
                            details={playlistDetails}
                            resetPlaylistDetails={() => {
                              setPlaylistDetails({});
                            }}
                            setPlaylistTracks={()=> setPlaylistTracks}
                          />
                          
                        </div>
                        
                      )}
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </section>
        <section className="stats-and-saved-tracks">
          <div className="user-stats">
            <Suspense fallback={<p>Loading...</p>}>
              <Await resolve={data.topItems} errorElement={<p>oops...</p>}>
                {(topItems) => {
                  console.log(topItems);

                  return (
                    <>
                      <div className="user-stats_top-artist">
                        <h4>Your Stats as of {new Date().toDateString()}</h4>
                        <p>
                          Your current top artist is: <br />
                          <span className="top-artist">
                            {topItems.items[0].name}
                          </span>
                        </p>
                      </div>
                      <div className="user-stats_other-artists">
                        <p>Honorable Mentions:</p>
                        <div className="honorable-mentions">
                          {topItems.items.slice(1).map((topArtist) => (
                            <>
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  backgroundImage: `url(${topArtist.images[0].url})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                                  borderRadius: "10px",
                                }}
                              >
                                <div className="honorable-mentions_name">
                                  <p>{topArtist.name}</p>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
          <div className="user-saved-tracks">
            <Suspense fallback={<p>Loading.......</p>}>
              <Await resolve={data.savedTracks} errorElement={<p>Error?</p>}>
                {(savedTracks) => {
                  console.log(savedTracks);
                  return (
                    <>
                      {savedTracks.map((savedTrack) => (
                        <div className="saved-track">
                          <div
                            style={{
                              width: "100px",
                              height: "100px",
                              backgroundImage: `url(${savedTrack.track.album.images[1].url})`,
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              borderRadius: "10px",
                            }}
                          />
                          <div className="saved-track_details">
                            <p>
                              Track Name: <span>{savedTrack.track.name}</span>
                            </p>
                            <p>
                              Album Name:{" "}
                              <span>{savedTrack.track.album.name}</span>
                            </p>
                            <p>
                              Artist Name:{" "}
                              <span>
                                {savedTrack.track.album.artists[0].name}
                              </span>
                            </p>
                          </div>

                          <button className="addbtn" disabled={Object.keys(playlistDetails).length === 0}>Add to Playlist +</button>
                        </div>
                      ))}
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}
