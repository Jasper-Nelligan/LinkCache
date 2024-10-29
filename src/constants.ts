import { LinkGroupInfo } from "./types";

export const initialLinkGroupInfo: LinkGroupInfo = {
  id: 0,
  linkGroupName: "Social Media",
  color: "#ff5733",
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

export const emptyLinkGroupInfo: LinkGroupInfo = {
  id: -1,
  linkGroupName: "",
  color: "#ff5733",
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