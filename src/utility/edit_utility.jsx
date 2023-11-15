export const getMatchingSongs = (playlistSongs, likedSongs) => {
    const originalLikedSongs = likedSongs;
    
    const playlistSongIDs = playlistSongs.map(playlistSong => playlistSong.track.id);

    const matchingSongs = originalLikedSongs.map(likedSong => {
        if (playlistSongIDs.includes(likedSong.track.id)) {
            likedSong.inPlaylist = true; 
        }
        return likedSong; 
    });

    return matchingSongs;
};
