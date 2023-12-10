import placeholder from "../../assets/placeholder.png";
import { motion } from "framer-motion";
export default function Playlist(props) {
  return (
    <>
      <motion.section
        whileTap={{ scale: 0.99, opacity: 0.8 }}
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          backgroundImage: `url(${props.playlist.images[0].url}`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        onClick={() => {
          props.handleSelectToggle();
        }}
      >
        <div
          className={`overlay ${
            props.selectedPlaylists.includes(props.playlist.id) ? "" : "toggled"
          }`}
        >
          <div className="playlist-details">
            <h3>{props.playlist.name}</h3>
            <p>{props.playlist.tracks.total} tracks</p>
          </div>
        </div>
      </motion.section>
    </>
  );
}
