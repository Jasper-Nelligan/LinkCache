import { useEffect, useState } from 'react';
import "../index.css";
import Header from "./components/Header";
import LinkGroups from "./LinkGroups";
import LinkGroupModal from './components/LinkGroupModal';
import { emptyLinkGroupInfo, initialLinkGroupInfo } from "./constants"
import { addLinkGroupToLocalStorage, removeLinkGroupFromLocalStorage, getNextID } from './utils';
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
        await axios.get(import.meta.env.VITE_API_URL + "/authStatus", { withCredentials: true });
        login();
      } catch (error) {
        console.error("Error checking auth status: ", error);
      }
    };
    checkAuth();
  }, []);
    
  useEffect(() => {
    const fetchLinkGroupsFromBackend = async () => {
      let linkGroupsInfo = await fetchLinkGroups();
      
      // If there is no data associated with the account, upload local data to the database
      if (linkGroupsInfo === undefined || linkGroupsInfo === "" || (Array.isArray(linkGroupsInfo) && linkGroupsInfo.length === 0)) {
        addLinkGroupToDatabase(linkGroupInfoArray);
      } else {
        linkGroupsInfo = JSON.parse(linkGroupsInfo);
        setNextId(getNextID(linkGroupsInfo));
        setLinkGroupInfoArray(linkGroupsInfo);
      }
    }

    const fetchLinkGroupsFromLocalStorage = () => {
      // Load the link groups from local storage
      const linkGroupsInfo = JSON.parse(localStorage.getItem("linkGroups") || '[]');
      if (linkGroupsInfo.length === 0) {
        linkGroupsInfo.push(initialLinkGroupInfo);
        addLinkGroupToLocalStorage(initialLinkGroupInfo);
      }

      setNextId(getNextID(linkGroupsInfo));
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
    if (existingIndex !== -1) {
      setLinkGroupInfoArray(linkGroupInfoArray.map((group: LinkGroupInfo) => group.id === linkGroupInfo.id ? linkGroupInfo : group));
    } else {
      setLinkGroupInfoArray([...linkGroupInfoArray, linkGroupInfo]);
    }

    if (isAuthenticated) {
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