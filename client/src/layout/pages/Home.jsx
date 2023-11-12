import placeholder from "../../assets/placeholder.png"
import { motion } from "framer-motion"
import Playlist from "../components/Playlist"
import { accessToken, logout} from "../../api_auth";
import { getUserInfo, getUserPlaylists } from "../../api_endpoints";
import { useState, useEffect} from "react";
import axios from 'axios';
import { Link, useLoaderData } from "react-router-dom";




export async function loader(){
  const token = accessToken
 const userInfo = await getUserInfo(token)
 const playlists = await getUserPlaylists(token)
 return [userInfo , playlists]
}


export default function Home(){
const [userInfo, playlists] = useLoaderData()
const [currentPlayList, setCurrentPlaylist] = useState({})

    return(
    <>
    <button onClick={() => logout()}>Logout</button>
    <section className="home-page">
        <motion.section 
            className="relevant-info-section"
            initial={{height: "150px",
                      borderRadius: "0px 0px 25px 25%"}}>
            {/* Section for Username and user data / Playlist data */}
            <div className="username-wrapper">
                <img src={userInfo.images[0].url} className="display-picture"/>
                <p className="display-name">{`Signed in as ${userInfo.display_name}`}</p>
                {/* TODO: Add TypeWriter to the display name*/}
            </div>
            <h2 className="info-title">Your Playlists</h2>
        </motion.section>

        <section className="playlists-wrapper">
            {playlists.items
              .filter(playlist => playlist.owner.id === userInfo.id)
              .map(playlist => (
                  <Playlist
                    name={playlist.name}
                    key={playlist.id}
                    id={playlist.id}
                    images={playlist.images}
                    trackTotal={playlist.tracks.total}
                    tracksHref={playlist.tracks.href}
                    snapshot_id={playlist.snapshot_id}
                    description={playlist.description}
                  />
                ))}
            
        </section>
    </section>
    </>
    )
}

