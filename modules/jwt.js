import { errorLogin } from "./utils.js";

/**
 * Obtaining initial JWT
 * @param {string} loginName - either an email or username
 * @param {string} password - password
 */
const obtainJWT = async (loginName, password) => {
  // Encoding header
  const credentialsParsed = `${loginName}:${password}`;
  const encodedCredentials = btoa(credentialsParsed);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${encodedCredentials}`,
  };
  try {
    const response = await fetch("https://01.kood.tech/api/auth/signin", {
      headers,
      method: "POST",
    });
    if (!response.ok) {
      errorLogin("User does not exist or password incorrect");
    }
    let data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export { obtainJWT };
