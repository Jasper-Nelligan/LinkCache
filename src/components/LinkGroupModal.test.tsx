import { emptyLinkGroupInfo } from "@/constants";
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

// TODO rename describe and file name to LinkGroupFormModal
describe("LinkGroupModal", () => {
  it('displays error on submit when no group name is present', () => {
    const { getByText, getByTestId } = render(<LinkGroupModal linkGroupInfo={emptyLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);

    const form = getByTestId('form');
    fireEvent.submit(form);

    waitFor(() => {
      expect(getByText("Group name cannot be empty")).toBeTruthy();
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

  // TODO add assertions for links
  it("form resets and onClose is called when cancel button is clicked", () => {
    const onClose = vi.fn();
    const { getByText, getByTestId } = render(<LinkGroupModal linkGroupInfo={fakeLinkGroupInfo} onClose={onClose} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);
    const closeBtn = getByText("Close");
    const groupNameInput = getByTestId("group-name-input") as HTMLInputElement;
    fireEvent.change(groupNameInput, { target: { value: "New name" } });

    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
    expect(groupNameInput.value).toBe("Group 1");
  });
})