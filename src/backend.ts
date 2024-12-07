import { credentialDetails, LinkGroupInfo } from "./types";
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export async function addUser(credentials: credentialDetails) {
  try {
    await axios.post(baseURL + '/register', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function loginUser(credentials: credentialDetails) {
  try {
    await axios.post(baseURL + '/login', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function logoutUser() {
  try {
    await axios.post(baseURL + '/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export async function fetchLinkGroups() {
  try {
    const response = await axios.get(baseURL + '/user_data', { withCredentials: true });
    return response.data[0].link_data;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export async function addLinkGroupToDatabase(linkGroupInfoArray: LinkGroupInfo[]) {
  const stringifiedLinkGroupInfo = JSON.stringify(linkGroupInfoArray);
  const body = { linkGroupInfo: stringifiedLinkGroupInfo };
  try {
    await axios.post(baseURL + '/user_data', body, { withCredentials: true });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export async function getUserEmail(): Promise<string> {
  try {
    const response = await axios.get(baseURL + '/user_email', { withCredentials: true });
    return response.data.email;
  } catch (error) {
    console.error('An error occurred:', error);
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