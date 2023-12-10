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
import Header from "../ui/header";
import PlaylistSelect from "../ui/PlaylistSelect";
import Editor from "../ui/Editor";

// const playlistDetails = await getPlaylistDetails(id, accessToken)
export async function loader() {
  return defer({
    values: Promise.all([
      getUserInfo(accessToken),
      getUserPlaylists(accessToken),
      getUserSavedTracks(accessToken),
    ]),
  });
}

export default function Home() {
  const { values } = useLoaderData();
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={values}>
          {([userInfo, playlists, savedTracks]) => {
            return (
              <>
                <Header userInfo={userInfo} />
                <section className="app_wrapper">
                  <PlaylistSelect
                    playlists={playlists}
                    selectedPlaylists={selectedPlaylists}
                    setSelectedPlaylists={setSelectedPlaylists}
                    displayName={userInfo.display_name}
                  />
                  <Editor
                    selectedPlaylists={selectedPlaylists}
                    savedTracks={savedTracks}
                  />
                </section>
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
