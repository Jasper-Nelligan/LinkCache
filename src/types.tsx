export type LinkInfo = {
  name: string;
  url: string;
  icon: string;
}

export type LinkGroupInfo = {
  linkGroupName: string;
  color: string;
  links: LinkInfo[];
}