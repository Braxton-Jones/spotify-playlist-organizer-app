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
import ErrorPage from "./ErrorPage";

// const playlistDetails = await getPlaylistDetails(id, accessToken)
export async function loader() {
  const userInfoPromise = getUserInfo(accessToken);
  const playlistsPromise = getUserPlaylists(accessToken);
  const topItemsPromise = getUserTopItems("long_term", accessToken);
  // const savedTracksPromise = getUserSavedTracks(accessToken);
  return defer({
    userInfo: userInfoPromise,
    playlists: playlistsPromise,
    topItems: topItemsPromise,
    // savedTracks: savedTracksPromise,
  });
}

export default function Home() {
  const data = useLoaderData();
  const [userID, setUserID] = useState("");
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
                        <h4>{`Welcome to setlist, ${userInfo.display_name} !`}</h4>
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
              <button disabled={true}>Your Playlists </button>
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
                            />
                          ))}
                      </div>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </section>
        <section className="stats-and-saved-tracks">
          <div className="user-stats">
            <h4>Your Stats as of {new Date().toDateString()}</h4>
            <Suspense fallback={<p>Loading...</p>}>
              <Await resolve={data.topItems} errorElement={<p>oops...</p>}>
                {(topItems) => {
                  console.log(topItems);

                  return (
                    <>
                      <section>
                        <div className="user-stats_top-artist">
                          <p>
                            Your current top artist is: {topItems.items[0].name}
                          </p>
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              backgroundImage: `url(${topItems.items[0].images[0].url})`,
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                        <div className="user-stats_other-artists">
                          <p>Honorable Mentions:</p>
                          <div>
                            {topItems.items.slice(1).map((topArtist) => (
                              <div
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  backgroundImage: `url(${topArtist.images[0].url})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "cover",
                                  borderRadius: "10px",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </section>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
          <div className="user-saved-tracks"></div>
        </section>
      </main>
    </>
  );
}
