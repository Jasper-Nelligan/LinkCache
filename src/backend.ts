import { credentialDetails, LinkGroupInfo } from "./types";
import axios from 'axios';

export async function addUser(credentials: credentialDetails) {
  try {
    await axios.post(process.env.REACT_APP_API_URL + '/register', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function loginUser(credentials: credentialDetails) {
  try {
    await axios.post(process.env.REACT_APP_API_URL + '/login', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function logoutUser() {
  try {
    await axios.post(process.env.REACT_APP_API_URL + '/logout', {}, { withCredentials: true });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export async function fetchLinkGroups() {
  try {
    const response = await axios.get(process.env.REACT_APP_API_URL + '/user_data', { withCredentials: true });
    return response.data[0].link_data;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export async function addLinkGroupToDatabase(linkGroupInfoArray: LinkGroupInfo[]) {
  const stringifiedLinkGroupInfo = JSON.stringify(linkGroupInfoArray);
  const body = { linkGroupInfo: stringifiedLinkGroupInfo };
  try {
    await axios.post(process.env.REACT_APP_API_URL + '/user_data', body, { withCredentials: true });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

export async function getUserEmail(): Promise<string> {
  try {
    const response = await axios.get(process.env.REACT_APP_API_URL + '/user_email', { withCredentials: true });
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