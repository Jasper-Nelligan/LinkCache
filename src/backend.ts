import { credentialDetails, LinkGroupInfo } from "./types";
import axios from 'axios';

export async function addUser(credentials: credentialDetails) {
  try {
    await axios.post('http://localhost:3000/register', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return error.response.status;
      } else if (error.response?.status === 500) {
        console.log('Internal server error');
      } else {
        console.log('An unexpected error occurred:', error.message);
      }
    } else {
      console.log('An unknown error occurred');
    }
  }
}

export async function loginUser(credentials: credentialDetails) {
  try {
    await axios.post('http://localhost:3000/login', { email: credentials.email, password: credentials.password }, { withCredentials: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return error.response.status;
      } else if (error.response?.status === 500) {
        console.log('Internal server error');
      } else {
        console.log('An unexpected error occurred:', error.message);
      }
    } else {
      console.log('An unknown error occurred');
    }
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