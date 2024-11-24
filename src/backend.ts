import { credentialDetails, LinkGroupInfo } from "./types";
import axios from 'axios';

export async function addUser(credentials: credentialDetails) {
  try {
    await axios.post('http://localhost:3000/register', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function loginUser(credentials: credentialDetails) {
  console.log("Logging in with credentials:", credentials);
  try {
    await axios.post('http://localhost:3000/login', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function logoutUser() {
  try {
    await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

export async function fetchLinkGroups() {
  try {
    const response = await axios.get('http://localhost:3000/user_data', { withCredentials: true });
    return response.data[0].link_data;
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

export async function addLinkGroupToDatabase(linkGroupInfoArray: LinkGroupInfo[]) {
  const stringifiedLinkGroupInfo = JSON.stringify(linkGroupInfoArray);
  const body = { linkGroupInfo: stringifiedLinkGroupInfo };
  try {
    await axios.post('http://localhost:3000/user_data', body, { withCredentials: true });
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

export async function getUserEmail(): Promise<string> {
  try {
    const response = await axios.get('http://localhost:3000/user_email', { withCredentials: true });
    return response.data.email;
  } catch (error) {
    console.log('An error occurred:', error);
    throw new Error('Failed to fetch user email');
  }
}

function handleError(error: any) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status) {
      return error.response.status;
    } else {
      console.error('An unknown error occurred', error);
      return 500;
    }
  } else {
    console.error('An unknown error occurred', error);
    return 500;
  }
}