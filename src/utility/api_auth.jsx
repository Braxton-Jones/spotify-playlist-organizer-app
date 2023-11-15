import axios from "axios";

// Define keys for storing and retrieving values in local storage
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token", // Key for the Spotify access token
  refreshToken: "spotify_refresh_token", // Key for the Spotify refresh token
  expireTime: "spotify_token_expire_time", // Key for the token expiration time
  timestamp: "spotify_token_timestamp", // Key for the timestamp of the last token update
};

// Retrieve values from local storage using the keys defined above
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken), // Get the access token from local storage
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken), // Get the refresh token from local storage
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime), // Get the token expiration time from local storage
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp), // Get the timestamp of the last token update from local storage
};

/**
 * Function to clear all stored items in local storage and reload the page
 * @returns {void}
 */
export const logout = () => {
  // Clear all items in local storage using the keys defined in LOCALSTORAGE_KEYS
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // Navigate to the homepage
  window.location = window.location.origin;
};

/**
 * Use the refresh token in localStorage to hit the /refresh_token endpoint
 * in our Node app, then update values in localStorage with data from response.
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
    }
    console.log("Refresh_Token", LOCALSTORAGE_VALUES.refreshToken);
    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get(
      `http://localhost:8888/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`,
    );
    console.log("New Token", data);

    // Update localStorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token,
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Function to check if the access token in local storage has expired
 * @returns {boolean} Whether the access token has expired
 */
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  const isExpired = millisecondsElapsed / 1000 > Number(expireTime);
  console.log("Token is expired:", isExpired);
  return isExpired;
};

/**
 * Handles logic for retrieving the Spotify access token from localStorage
 * or URL query params
 * @returns {string} A Spotify access token
 */
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };
  const hasError = urlParams.get("error");

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  // We should never get here!
  return false;
};

// Export the access token value obtained from the getAccessToken function
export const accessToken = getAccessToken();
