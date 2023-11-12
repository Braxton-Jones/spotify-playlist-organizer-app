import { Link } from "react-router-dom"
import placeholder from "../../assets/placeholder.png"
export default function Playlist(props){
 return (<>
 <Link to={`/details/${props.id}/${props.name}`}>
    <section className="playlist">
        <div>
            <img src={props.images[0]?.url || placeholder} className="playlist-cover"/>
        </div>
        <div className="playlist-info-wrapper">
            <div className="playlist-name-wrapper">
                <p className="playlist-name">{props.name}</p>
                <p className="playlist-track-count">{props.trackTotal} Tracks</p>
            </div>
            <p className="playlist-desc">
                {/* Get only 100 chars then "..." 
                truncatedText = text.slice(0, 100) + '...'; */}
                {props.description.slice(0,100)+ " ..."}
                </p>
        </div>
        
    </section>
    </Link>
    
    </>)
}