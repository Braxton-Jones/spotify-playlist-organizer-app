export default async function generateCodeChallenge(length){
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    // Generate the code verifier
    const codeVerifier = Array.from({ length }, () => possible[Math.floor(Math.random() * possible.length)]).join('');
  
    // Hash the code verifier using SHA256
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashed = await window.crypto.subtle.digest('SHA-256', data);
  
    // Convert the hash into base64
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  
    return codeChallenge;
  };