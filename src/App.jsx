import LandingPage from "./layout/pages/LandingPage"
import Home from "./layout/pages/Home"


export default function App() {
  {/*
    Client ID: f55bd7526e754892a1364f9a5b389dc5

*/}
{/* Connecting to Spotify's API*/}

// Create a Code Verifier
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier  = generateRandomString(64);
  
// Generate the Value from SHA
const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

// Convert that code into base64
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const hashed = sha256(codeVerifier)
const codeChallenge = base64encode(hashed);

{/*-------------------------------------*/}

// Requesting an acess token
const clientId = 'f55bd7526e754892a1364f9a5b389dc5';
const redirectUri = 'http://localhost:5173/callback';

const scope = 'user-read-private user-read-email'; // scopes that you'll need
const authUrl = new URL("https://accounts.spotify.com/authorize")

// generated in the previous step
window.localStorage.setItem('code_verifier', codeVerifier);

const params =  {
  response_type: 'code',
  client_id: clientId,
  scope,
  code_challenge_method: 'S256',
  code_challenge: codeChallenge,
  redirect_uri: redirectUri,
}

// Appends the Query part of the URL and adds new ones
authUrl.search = new URLSearchParams(params).toString();
// Sends user to the Spotify login page with the needed info
const handleLogin = ()=>{
  window.location.href = authUrl.toString();
}
const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');







  return (<>
  <button onClick={handleLogin}>Login!!</button>
  <Home code={code}/></>

      
  )
}


