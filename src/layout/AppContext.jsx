import React, { createContext, useState, useEffect } from "react";
import { getUserSavedTracks } from "../api_endpoints";
import { accessToken } from "../api_auth";

const LikedSongs = createContext();

const LikedSongsContextProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getUserSavedTracks(accessToken);
      setLikedSongs(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LikedSongs.Provider value={{ likedSongs, fetchData }}>
      {children}
    </LikedSongs.Provider>
  );
};

export { LikedSongs, LikedSongsContextProvider };
