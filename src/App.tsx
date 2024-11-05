import { useEffect, useState } from 'react';
import "../index.css";
import Header from "./Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { emptyLinkGroupInfo, initialLinkGroupInfo } from "./constants"
import { addLinkGroupToLocalStorage, removeLinkGroupFromLocalStorage } from './utils';
import { LinkGroupInfo } from './types';
import LoginRegister from './components/LoginRegister';
import axios from 'axios';
import { useAuth } from './providers/authProvider';
import { addLinkGroupToDatabase, fetchLinkGroups } from './backend';

// TODO make group name able to be empty?
// TODO test database value - submitting too much data
export default function App() {
  const [isLinkGroupFormOpen, setIsLinkGroupFormOpen] = useState(false);
  const [linkGroupInfoArray, setLinkGroupInfoArray] = useState<LinkGroupInfo[]>([]);
  const [selectedLinkGroupId, setSelectedLinkGroupId] = useState<number>(-1);
  const [nextId, setNextId] = useState<number>(-1);
  const [showLoginRegistrationDialog, setShowLoginRegistrationDialog] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:3000/authStatus", { withCredentials: true });
        login();
      } catch (error) {
        console.error("Error checking auth status: ", error);
      }
    };
    checkAuth();
  }, []);
    
  useEffect(() => {
    const fetchLinkGroupsFromBackend = async () => {
      const linkData = await fetchLinkGroups();
      console.log("Link data: ", linkData);
      // If there is no data associated with the account, upload local data to the database
      if (linkData === "" || (Array.isArray(linkData) && linkData.length === 0)) {
        console.log("No data found in database, uploading local data");
        addLinkGroupToDatabase(linkGroupInfoArray);
        console.log("Local data uploaded");
      } else {
        console.log("Data found in database, setting link group info array");
        setLinkGroupInfoArray(JSON.parse(linkData));
      }
    }

    const fetchLinkGroupsFromLocalStorage = () => {
      // Load the link groups from local storage
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
    }

    if (isAuthenticated) {
      fetchLinkGroupsFromBackend();
    } else {
      fetchLinkGroupsFromLocalStorage();
    }
  }, [isAuthenticated]);

  const handleOpenLinkGroupForm = (linkGroupId: number) => {
    setSelectedLinkGroupId(linkGroupId);
    setIsLinkGroupFormOpen(true);
  };

  const handleCloseLinkGroupForm = () => {
    setIsLinkGroupFormOpen(false);
  };

  const handleDeleteGroup = (linkGroupId: number) => {
    const updatedLinkGroupInfoArray = linkGroupInfoArray.filter((group: LinkGroupInfo) => group.id !== linkGroupId);
    if (isAuthenticated) {
      addLinkGroupToDatabase(updatedLinkGroupInfoArray);
    } else {
      removeLinkGroupFromLocalStorage(linkGroupId);
    }
    setLinkGroupInfoArray(updatedLinkGroupInfoArray);
  }

  const onLinkGroupFormSubmit = (linkGroupInfo: LinkGroupInfo) => {
    if (linkGroupInfo.id === -1) {
      linkGroupInfo.id = nextId;
    }

    // Check if the group already exists
    const existingIndex = linkGroupInfoArray.findIndex((group: LinkGroupInfo) => group.id === linkGroupInfo.id);
    // If it exists, update it, otherwise add it
    console.log("before", linkGroupInfoArray);
    if (existingIndex !== -1) {
      console.log(1)
      setLinkGroupInfoArray(linkGroupInfoArray.map((group: LinkGroupInfo) => group.id === linkGroupInfo.id ? linkGroupInfo : group));
    } else {
      console.log(2)
      setLinkGroupInfoArray([...linkGroupInfoArray, linkGroupInfo]);
    }
    console.log("after", linkGroupInfoArray);


    if (isAuthenticated) {
      console.log("Editing database");
      addLinkGroupToDatabase([...linkGroupInfoArray, linkGroupInfo]);
    } else {
      addLinkGroupToLocalStorage(linkGroupInfo);
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

  return (
    <>
      <Header onLoginClicked={onLoginClicked} onRegisterClicked={onRegisterClicked} />
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
      />
    </>
  );
}