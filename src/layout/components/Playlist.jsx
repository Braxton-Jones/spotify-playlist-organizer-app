import placeholder from "../../assets/placeholder.png";
import he from "he";
import { motion } from "framer-motion";
export default function Playlist(props) {
  return (
    <>
      <motion.section
        whileTap={{ scale: 0.99, opacity: 0.9 }}
        className={`playlist ${
          props.description.length > 150 ? "descriptive" : ""
        }`}
        onClick={props.onPlaylistClick}
      >
        <div className="playlist-top">
          <img
            src={props.images[0]?.url || placeholder}
            className="playlist-cover"
            alt="Playlist Cover"
          />
          <div className="playlist-details">
            <p className="playlist-name">{props.name}</p>
            <p className="playlist-track-count">
              {props.trackTotal} Track{props.trackTotal !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="playlist-bottom">
          <p className="playlist-description">
            {props.description
              ? he.decode(props.description.slice(0, 200)) +
                (props.description.length > 200 ? " ..." : "")
              : "No playlist description ~~~"}
          </p>
        </div>
      </motion.section>
    </>
  );
}
