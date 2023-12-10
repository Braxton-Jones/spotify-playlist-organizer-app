import axios from "axios";
import { accessToken } from "./api_auth";

export const getUserInfo = async (token) => {
  const url = "https://api.spotify.com/v1/me";
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
};

export const getUserPlaylists = async (token) => {
  const url = "https://api.spotify.com/v1/me/playlists?limit=50&offset=0";
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
};

export const getUserSavedTracks = async (token) => {
  const limit = 50;
  let offset = 0;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    let allTracks = [];
    let hasMoreTracks = true;

    while (hasMoreTracks) {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        config,
      );
      const { items, total } = response.data;

      allTracks = allTracks.concat(items);

      if (allTracks.length >= total) {
        hasMoreTracks = false;
      } else {
        offset += limit;
      }
    }

    return allTracks;
  } catch (error) {
    console.log(error);
  }
};

export const getPlaylistDetails = async (playlistID, token) => {
  const limit = 50;
  let offset = 0;
  try {
    let allTracks = [];
    let hasMoreTracks = true;
    while (hasMoreTracks) {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const { items, total } = response.data;
      allTracks = allTracks.concat(items);
      if (allTracks.length >= total) {
        hasMoreTracks = false;
      } else {
        offset += limit;
      }
    }
    return allTracks;
  } catch (error) {
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received. Request:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    console.error("Error config:", error.config);
  }
};

export const getUserTopItems = async (timeRange, token) => {
  const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=10`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPlaylistCover = async (playlistID, token) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistID}/images`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPlaylist = async (playlistID, token) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistID}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
