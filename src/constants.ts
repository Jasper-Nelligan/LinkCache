import { LinkGroupInfo } from "./types";

export const colors = ["#FE7B7B", "#75D073", "#74A3FF", "#FFE977", "#FBB143", "#C17ED9"];

export const emptyLinkGroupInfo: LinkGroupInfo = {
  id: -1,
  linkGroupName: "",
  color: colors[0],
  linkPairs: [
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ],
}

export const initialLinkGroupInfo: LinkGroupInfo = {
  id: 0,
  linkGroupName: "Social Media",
  color: colors[0],
  linkPairs: [
    {
      name: "Facebook",
      url: "https://facebook.com",
    },
    {
      name: "Twitter",
      url: "https://twitter.com",
    },
    {
      name: "Instagram",
      url: "https://instagram.com",
    },
    {
      name: "Reddit",
      url: "https://reddit.com",
    },
  ],
}