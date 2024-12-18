import { LinkGroupInfo } from "./types";

/**
 * Adds a link group to local storage. If the link group already exists,
 * this function will update the existing link group.
 * @param linkGroupInfo 
 */
export function addLinkGroupToLocalStorage(linkGroupInfo: LinkGroupInfo) {
  const linkGroupDataLocalStorage = JSON.parse(localStorage.getItem("linkGroups") || '[]');

  const existingIndex = linkGroupDataLocalStorage.findIndex((group: LinkGroupInfo) => group.id === linkGroupInfo.id);
  if (existingIndex !== -1) {
    linkGroupDataLocalStorage[existingIndex] = linkGroupInfo;
  } else {
    linkGroupDataLocalStorage.push(linkGroupInfo);
  }

  localStorage.setItem("linkGroups", JSON.stringify(linkGroupDataLocalStorage));
}

export function removeLinkGroupFromLocalStorage(linkGroupId: number) {
  const linkGroupDataLocalStorage = JSON.parse(localStorage.getItem("linkGroups") || '[]');

  const existingIndex = linkGroupDataLocalStorage.findIndex((group: LinkGroupInfo) => group.id === linkGroupId);
  if (existingIndex !== -1) {
    linkGroupDataLocalStorage.splice(existingIndex, 1);
  }

  localStorage.setItem("linkGroups", JSON.stringify(linkGroupDataLocalStorage));
}

export function getNextID(linkGroupInfoArray: LinkGroupInfo[]): number {
  const maxId = linkGroupInfoArray.reduce((max: number, group: { id: number; }) => {
    return group.id > max ? group.id : max;
  }, 0);
  return maxId + 1;
}

export function getURLIconSrc(url: string): string {
  // Remove http:// or https://, as well as everything after the domain
  const strippedURL = url.replace(/^https?:\/\/([^\/]+).*/, '$1');
  return `https://icons.duckduckgo.com/ip2/${strippedURL}.ico`;
}