import { colors, emptyLinkGroupInfo } from "@/constants";
import { describe, expect, it, vi } from "vitest";
import LinkGroupModal from "./LinkGroupModal";
import { fireEvent, render, waitFor } from '@testing-library/react';
import { LinkGroupInfo } from "@/types";

const fakeLinkGroupInfo: LinkGroupInfo = {
  id: 1,
  linkGroupName: "Group 1",
  color: "#000000",
  linkPairs: [
    { name: "Link 1", url: "https://www.link1.com" },
    { name: "Link 2", url: "https://www.link2.com" },
  ]
}

describe("LinkGroupModal", () => {
  it('renders LinkGroupModal for new group', () => {
    const { getByText, getAllByText, queryByText } = render(<LinkGroupModal linkGroupInfo={emptyLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);

    expect(getAllByText("Add New Group")).toHaveLength(2);
    expect(getByText("Group Name")).toBeTruthy();
    expect(getByText("Color")).toBeTruthy();
    expect(getAllByText("Link Name")).toHaveLength(4);
    expect(getAllByText("URL")).toHaveLength(4);
    expect(getByText("Add Group")).toBeTruthy();
    expect(queryByText("Delete Group")).toBeFalsy();
  })

  it('renders LinkGroupModal for existing group', () => {
    const { getByText, getAllByText, queryByText } = render(<LinkGroupModal linkGroupInfo={fakeLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);

    waitFor(() => {
      expect(getAllByText("Edit Group")).toHaveLength(2);
      expect(getByText("Group Name")).toBeTruthy();
      expect(getByText("Color")).toBeTruthy();
      expect(getAllByText("Link Name")).toHaveLength(2);
      expect(getAllByText("URL")).toHaveLength(2);
      expect(getByText("Link 1")).toBeTruthy();
      expect(getByText("Link 2")).toBeTruthy();
      expect(getAllByText("https://www.google.com")).toHaveLength(2);
      expect(getByText("Save Changes")).toBeTruthy();
      expect(queryByText("Delete Group")).toBeTruthy();
    }, { timeout: 1000 });
  })

  it('displays error on submit when no group name is present', () => {
    const { getByText, getByTestId } = render(<LinkGroupModal linkGroupInfo={emptyLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);

    const form = getByTestId('form');
    fireEvent.submit(form);

    waitFor(() => {
      expect(getByText("Group name cannot be empty")).toBeTruthy();
    });
  })

  // TODO remove this test and functionality. Use ellipsis instead for long group names
  it("displays error on submit when group name is too long", () => {
    const { getByText, getByTestId } = render(<LinkGroupModal linkGroupInfo={emptyLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);

    const form = getByTestId('form');
    fireEvent.change(getByTestId("group-name-input"), { target: { value: "a".repeat(51) } });
    fireEvent.submit(form);

    waitFor(() => {
      expect(getByText("Group name must be less than 50 characters")).toBeTruthy();
    });
  })

  it("add new link pair", () => {
    const { getByText, getAllByText } = render(<LinkGroupModal linkGroupInfo={emptyLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);

    waitFor(() => {
      expect(getAllByText("Link Name")).toHaveLength(2);
      expect(getAllByText("URL")).toHaveLength(2);

      fireEvent.click(getByText("Add Link"));

      expect(getAllByText("Link Name")).toHaveLength(3);
      expect(getAllByText("URL")).toHaveLength(3);
    });
  });

  it("delete link pair", () => {
    const { getByText, getAllByAltText, queryByText } = render(<LinkGroupModal linkGroupInfo={fakeLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);
    const deleteLinkBtn = getAllByAltText("Delete Link")[0];

    fireEvent.click(deleteLinkBtn);

    waitFor(() => {
      expect(queryByText("Link 1")).toBeFalsy();
      expect(getByText("Link 2")).toBeTruthy();
      expect(queryByText("https://www.link1.com")).toBeFalsy();
      expect(getByText("https://www.link2.com")).toBeTruthy();
    })
  });

  it("delete group calls delete function", () => {
    const onDeleteGroup = vi.fn();
    const { getByText } = render(<LinkGroupModal linkGroupInfo={fakeLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={onDeleteGroup} />);
    const deleteGroupBtn = getByText("Delete Group");

    fireEvent.click(deleteGroupBtn);

    expect(onDeleteGroup).toHaveBeenCalled();
  });

  it("onClose is called when cancel button is clicked", () => {
    const onClose = vi.fn();
    const { getByText } = render(<LinkGroupModal linkGroupInfo={fakeLinkGroupInfo} onClose={onClose} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);
    const closeBtn = getByText("Close");

    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it("onFormSubmit is called with correct arguments when form is submitted", () => {
    const onFormSubmit = vi.fn();
    const { getAllByPlaceholderText, getByTestId } = render(<LinkGroupModal linkGroupInfo={emptyLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={onFormSubmit} onDeleteGroup={vi.fn()} />);

    const groupNameInput = getByTestId("group-name-input");
    fireEvent.change(groupNameInput, { target: { value: "Group Name 1" } });

    // Simulate 2 Tab key presses and Enter to navigate and change color of the group
    fireEvent.keyDown(document.activeElement || groupNameInput, { key: 'Tab', code: 'Tab', keyCode: 9, charCode: 9 });
    fireEvent.keyUp(document.activeElement || groupNameInput, { key: 'Tab', code: 'Tab', keyCode: 9, charCode: 9 });
    fireEvent.keyDown(document.activeElement || groupNameInput, { key: 'Tab', code: 'Tab', keyCode: 9, charCode: 9 });
    fireEvent.keyUp(document.activeElement || groupNameInput, { key: 'Tab', code: 'Tab', keyCode: 9, charCode: 9 });
    fireEvent.keyDown(document.activeElement || groupNameInput, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 });
    fireEvent.keyUp(document.activeElement || groupNameInput, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 });

    const linkNameInput = getAllByPlaceholderText("Link Name")[0];
    fireEvent.change(linkNameInput, { target: { value: "Link 1" } });
    const urlInput = getAllByPlaceholderText("URL")[0];
    fireEvent.change(urlInput, { target: { value: "https://www.link1.com" } });

    const form = getByTestId('form');
    fireEvent.submit(form);

    const linkGroupInfo = {
      linkGroupName: "Group Name 1",
      color: colors[1],
      linkPairs: [
        { name: "Link 1", url: "https://www.link1.com" },
        { name: "", url: "", },
        { name: "", url: "", },
        { name: "", url: "", },
      ]
    };

    waitFor(() => {
      expect(onFormSubmit).toHaveBeenCalledWith(linkGroupInfo);
    });
  });
})