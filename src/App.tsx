import { useEffect, useState } from 'react';
import "../index.css";
import Header from "./Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { emptyLinkGroupInfo, initialLinkGroupInfo } from "./constants"
import { addLinkGroupToLocalStorage, removeLinkGroupFromLocalStorage } from './utils';
import { LinkGroupInfo, credentialDetails } from './types';
import LoginRegister from './components/LoginRegister';

export default function App() {
  const [isLinkGroupFormOpen, setIsLinkGroupFormOpen] = useState(false);
  const [linkGroupInfoArray, setLinkGroupInfoArray] = useState<LinkGroupInfo[]>([]);
  const [selectedLinkGroupId, setSelectedLinkGroupId] = useState<number>(-1);
  const [nextId, setNextId] = useState<number>(-1);
  const [showLoginRegistrationDialog, setShowLoginRegistrationDialog] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const linkGroupsInfo = JSON.parse(localStorage.getItem("linkGroups") || '[]');
    if (linkGroupsInfo.length === 0) {
      linkGroupsInfo.push(initialLinkGroupInfo);
      addLinkGroupToLocalStorage(initialLinkGroupInfo);
    }

    // Find the maximum ID
    const maxId = linkGroupsInfo.reduce((max: number, group: { id: number; }) => {
      return group.id > max ? group.id : max;
    }, 0);
    setNextId(maxId + 1);

    setLinkGroupInfoArray(linkGroupsInfo);
  }, []);

  const handleOpenLinkGroupForm = (linkGroupId: number) => {
    setSelectedLinkGroupId(linkGroupId);
    setIsLinkGroupFormOpen(true);
  };

  const handleCloseLinkGroupForm = () => {
    setIsLinkGroupFormOpen(false);
  };
  
  const handleDeleteGroup = (linkGroupId: number) => {
    removeLinkGroupFromLocalStorage(linkGroupId);
    setLinkGroupInfoArray(linkGroupInfoArray.filter((group: LinkGroupInfo) => group.id !== linkGroupId));
  }

  const onLinkGroupFormSubmit = (linkGroupInfo: LinkGroupInfo) => {
    if (linkGroupInfo.id === -1) {
      linkGroupInfo.id = nextId;
    }

    addLinkGroupToLocalStorage(linkGroupInfo);

    // Check if the group already exists
    const existingIndex = linkGroupInfoArray.findIndex((group: LinkGroupInfo) => group.id === linkGroupInfo.id);
    // If it exists, update it, otherwise add it
    if (existingIndex !== -1) {
      setLinkGroupInfoArray(linkGroupInfoArray.map((group: LinkGroupInfo) => group.id === linkGroupInfo.id ? linkGroupInfo : group));
    } else {
      setLinkGroupInfoArray([...linkGroupInfoArray, linkGroupInfo]);
    }
  }

  const onCloseLoginRegistration = () => {
    setShowLoginRegistrationDialog(false);
  }
  
  const onLoginClicked = () => {
    setShowLoginForm(true);
    setShowLoginRegistrationDialog(true);
  }
  
  const onRegisterClicked = () => {
    setShowLoginForm(false);
    setShowLoginRegistrationDialog(true);
  }

  const onLoginRegisterFormSubmit = (credentials: credentialDetails) => {
    console.log(credentials);
    if (credentials.type === "login") {
      console.log("Login");
    }
    else {
      console.log("Register");
    }
  }

  return (
    <>
      <Header onLoginClicked={onLoginClicked} onRegisterClicked={onRegisterClicked}/>
      <LinkGroups linkGroupInfoArray={linkGroupInfoArray} onOpenModal={handleOpenLinkGroupForm} />
      <LinkGroupModal
        linkGroupInfo={linkGroupInfoArray.find(group => group.id === selectedLinkGroupId) ?? emptyLinkGroupInfo}
        onClose={handleCloseLinkGroupForm}
        isModalOpen={isLinkGroupFormOpen}
        onFormSubmit={onLinkGroupFormSubmit}
        onDeleteGroup={handleDeleteGroup}
      />
      <LoginRegister
        isOpen={showLoginRegistrationDialog}
        onClose={onCloseLoginRegistration}
        showLoginForm={showLoginForm}
        setShowLoginForm={setShowLoginForm}
        onSubmitForm={onLoginRegisterFormSubmit}
      />
    </>
  );
}