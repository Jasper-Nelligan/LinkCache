export type LinkPair = {
  name: string;
  url: string;
}

export type LinkGroupInfo = {
  id: number;
  linkGroupName: string;
  color: string;
  linkPairs: LinkPair[];
}

export type credentialDetails = {
  email: string;
  password: string;
}

export type registrationDetails = {
  email: string;
  password: string;
  confirmPassword: string;
}
