import axios from 'axios';
export const getUserInfo = async (token) => {
    const url = 'https://api.spotify.com/v1/me';
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(url, config);
        return response.data; // Return the JSON data
    } catch (error) {
        console.log(error);
    }
}

export const getUserPlaylists = async (token) => {
    const url = "https://api.spotify.com/v1/me/playlists?limit=50&offset=0"
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    try {
        const response = await axios.get(url, config);
        return response.data; // Return the JSON data
    } catch (error) {
        console.log(error);
    }

  
}

export const getUserSavedTracks = async (token) => {
    const limit = 50; // Set the desired limit value
    let offset = 0; // Set the initial offset value
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      let allTracks = [];
      let hasMoreTracks = true;
  
      while (hasMoreTracks) {
        const response = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, config);
        const { items, total } = response.data;
  
        allTracks = allTracks.concat(items); // Process the response data
  
        if (allTracks.length >= total) {
          hasMoreTracks = false; // Exit the loop if all tracks have been retrieved
        } else {
          offset += limit; // Increment the offset for the next request
        }
      }
  
      return allTracks;
    } catch (error) {
      console.log(error);
    }
  };

export const getPlaylistDetails = async (playlistID, token) =>{
    const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=50&offset=0`
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    try {
        const response = await axios.get(url, config);
        return response.data; // Return the JSON data
    } catch (error) {
        console.log(error);
    }
}