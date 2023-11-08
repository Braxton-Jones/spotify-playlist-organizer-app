import placeholder from "../../assets/placeholder.png"
import { motion } from "framer-motion"
import Playlist from "../components/Playlist"
import axios from 'axios';
export default function Home(props){
    console.log(props.code)

const url = 'https://api.spotify.com/v1/me';
const accessToken = props.code

const config = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
};

axios.get(url, config)
  .then(response => {
    console.log('User Profile:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
    return(<>
    <section className="home-page">
        <motion.section 
            className="relevant-info-section"
            initial={{height: "150px",
                      borderRadius: "0px 0px 25px 25%"}}>
            {/* Section for Username and user data / Playlist data */}
            <div className="username-wrapper">
                {/*User Image */} <img src={placeholder} className="display-picture"/>
                {/* User Display Name */} <p className="display-name">Signed in as: brx</p>
                {/* TODO: Add TypeWriter to the display name */}
            </div>
            <h2 className="info-title">Your Playlists</h2>
        </motion.section>

        <section className="playlists-wrapper">
            <Playlist/>
            
        </section>
    </section>
    </>)
}

