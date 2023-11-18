import placeholder from "../../assets/placeholder.png";
import he from "he";
export default function Playlist(props) {
  return (
    <>
      <section
        className={`playlist ${
          props.description.length > 70 ? "descriptive_playlist" : ""
        }`}
        onClick={props.openModal}
      >
        <div className="playlist-top-wrapper">
          <img
            src={props.images[0]?.url || placeholder}
            className="playlist-cover"
          />
          <div className="playlist-wrapper">
            <p className="playlist-name">{props.name}</p>
            <p className="playlist-track-count">{props.trackTotal} Tracks</p>
          </div>
        </div>
        <div className="playlist-bottom-wrapper">
          <p className="playlist-desc">
            {props.description
              ? he.decode(props.description.slice(0, 200)) +
                (props.description.length > 200 ? " ..." : "")
              : "no playlist description ~~~ "}
          </p>
        </div>
      </section>
    </>
  );
}
