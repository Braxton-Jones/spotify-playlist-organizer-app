import placeholder from "../../assets/placeholder.png"
export default function Playlist(){
 {/* We need Playlist Information here */}
 return (<>
    <section className="playlist">
        <div>
            <img src={placeholder} className="playlist-cover"/>
        </div>
        <div className="playlist-info-wrapper">
            <div className="playlist-name-wrapper">
                <p className="playlist-name">Playlist Name</p>
                <p className="playlist-track-count">289 Tracks</p>
            </div>
            <p className="playlist-desc">
                {/* Get only 100 chars then "..." 
                truncatedText = text.slice(0, 100) + '...'; */}
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </p>
        </div>
        
    </section>
    
    </>)
}