import { useLoaderData} from "react-router-dom"
import { getPlaylistDetails, getUserSavedTracks } from "../../api_endpoints.jsx"
import { accessToken } from "../../api_auth"
import { useContext } from "react"

export async function loader({params}){
    const {id, name} = params
    const data = await getPlaylistDetails(id, accessToken)
    // const savedTracks = await getUserSavedTracks(accessToken)
    return {name, data}
    
}
export default function PlaylistDetails(){
    const playlistDetails = useLoaderData()
    const {name, data} = playlistDetails
    console.log(data.items)
    return(
        <div>
            <h3>{`Playlist Name: ${name}`}</h3>
            <div className="playlist-tracks">
                {data.items.map(song =>{
                    return(
                        <section className="track" key={song.track.id}>
                            <img 
                                src={`${song.track.album.images[0].url}`}
                                style={{width:"80px"}}/>
                            <p>{`Added At: ${song.added_at}` }</p>
                            <p>{`Artist: ${song.track.album.artists[0].name}`}</p>
                            <p>{`Song: ${song.track.name}`}</p>
                            <p>{`Album Name: ${song.track.album.name}`}</p>

                        </section>
                    )
                })}
            </div>
        </div>
    )
}