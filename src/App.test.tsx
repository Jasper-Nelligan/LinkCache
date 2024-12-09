import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import App from './App';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { colors, initialLinkGroupInfo } from './constants';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('App Component', () => {
  const axiosMock = new MockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    localStorage.clear();
  });

  it('uses the initial link group info if no data is in local storage', async () => {
    render(<App />);

    await waitFor(() => {
      // Check local storage
      const linkGroups = JSON.parse(localStorage.getItem('linkGroups') || '[]');
      expect(linkGroups).toHaveLength(1);
      expect(linkGroups[0]).toStrictEqual(initialLinkGroupInfo)

      // Check the UI
      expect(screen.queryByText('Social Media')).toBeTruthy();
      expect(screen.queryByText('Facebook')).toBeTruthy();
      expect(screen.queryByText('Twitter')).toBeTruthy();
      expect(screen.queryByText('Instagram')).toBeTruthy();
      expect(screen.queryByText('Reddit')).toBeTruthy();
    });
  });

  it('renders LinkGroupModal for new group', async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('new-link-group-btn'));

    await waitFor(() => {
      expect(screen.getAllByText("Add New Group")).toHaveLength(2);
      expect(screen.queryByText("Group Name")).toBeTruthy();
      expect(screen.queryByText("Color")).toBeTruthy();
      expect(screen.getAllByText("Link Name")).toHaveLength(4);
      expect(screen.getAllByText("URL")).toHaveLength(4);
      expect(screen.queryByText("Add Link")).toBeTruthy();
      expect(screen.queryByText("Add Group")).toBeTruthy();
      expect(screen.queryByText("Delete Group")).toBeFalsy();
    });
  })

  it('renders LinkGroupModal for existing group', async () => {
    render(<App />);

    fireEvent.click(screen.getAllByTestId('edit-link-group-btn')[0]);

    await waitFor(() => {
      expect(screen.getAllByText("Edit Group")).toHaveLength(2);

      expect(screen.queryByText("Group Name")).toBeTruthy();
      expect(screen.queryByText('Social Media')).toBeTruthy();

      expect(screen.queryByText("Color")).toBeTruthy();

      expect(screen.getAllByText("Link Name")).toHaveLength(4);
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[0].name)).toBeTruthy();
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[1].name)).toBeTruthy();
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[2].name)).toBeTruthy();
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[3].name)).toBeTruthy();

      expect(screen.getAllByText("URL")).toHaveLength(4);
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[0].url)).toBeTruthy();
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[1].url)).toBeTruthy();
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[2].url)).toBeTruthy();
      expect(screen.getByDisplayValue(initialLinkGroupInfo.linkPairs[3].url)).toBeTruthy();

      expect(screen.queryByText("Add Link")).toBeTruthy();
      expect(screen.queryByText("Save Changes")).toBeTruthy();
      expect(screen.queryByText("Delete Group")).toBeTruthy();
    });
  })

  it("add new group", async () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('new-link-group-btn'));

    // TODO use getByLabelText
    const groupNameInput = screen.getByTestId("group-name-input");
    fireEvent.change(groupNameInput, { target: { value: "Group Name 1" } });

    fireEvent.click(screen.getByTestId(`${colors[1]}-btn`));

    const linkNameInput = screen.getAllByPlaceholderText("Link Name")[0];
    fireEvent.change(linkNameInput, { target: { value: "Link 1" } });
    const urlInput = screen.getAllByPlaceholderText("URL")[0];
    fireEvent.change(urlInput, { target: { value: "https://www.link1.com" } });

    fireEvent.click(screen.getByText("Add Group"));

    const linkGroupInfo = {
      linkGroupName: "Group Name 1",
      color: colors[1],
      linkPairs: [
        { name: "Link 1", url: "https://www.link1.com" },
        { name: "", url: "", },
        { name: "", url: "", },
        { name: "", url: "", },
      ],
      id: 1,
    };

    await waitFor(() => {
      // Check local storage
      const linkGroups = JSON.parse(localStorage.getItem('linkGroups') || '[]');
      expect(linkGroups).toHaveLength(2);
      expect(linkGroups[1]).toStrictEqual(linkGroupInfo)

      // Check the UI
      expect(screen.queryByText('Group Name 1')).toBeTruthy();
      expect(screen.queryByText('Link 1')).toBeTruthy();
    });
  });

  it("edit existing group", async () => {
    render(<App />);

    fireEvent.click(screen.getAllByTestId('edit-link-group-btn')[0]);

    // TODO use getByLabelText
    const groupNameInput = screen.getByTestId("group-name-input");
    fireEvent.change(groupNameInput, { target: { value: "New Group Name" } });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(screen.queryByText('New Group Name')).toBeTruthy();
      expect(screen.queryByText('Social Media')).toBeFalsy();
      expect(screen.queryByText('Facebook')).toBeTruthy();
      expect(screen.queryByText('Twitter')).toBeTruthy();
      expect(screen.queryByText('Instagram')).toBeTruthy();
      expect(screen.queryByText('Reddit')).toBeTruthy();
    });
  });

  it("delete existing group", () => {
    render(<App />);

    fireEvent.click(screen.getAllByTestId('edit-link-group-btn')[0]);
    
    const deleteGroupBtn = screen.getByText("Delete Group");
    fireEvent.click(deleteGroupBtn);

    // Check local storage
    const linkGroups = JSON.parse(localStorage.getItem('linkGroups') || '[]');
    expect(linkGroups).toHaveLength(0);

    // Check the UI
    expect(screen.queryByText('Social Media')).toBeFalsy();
  });

  it("logs on user on load, assuming cookie is present", () => {
    axiosMock.onGet("http://localhost:3000/authStatus").reply(200, {});
    vi.spyOn(auth, 'useAuth').mockResolvedValue(
      { isAuthenticated: true, login: vi.fn(), logout: vi.fn() }
    );

    render(<App />);

    waitFor(() => {
      expect(axiosMock.history.get.length).toBe(1);
      expect(axiosMock.history.get[0].url).toBe("http://localhost:3000/authStatus");
      expect(screen.getByText("Logout")).toBeTruthy();
    })
  })
});
