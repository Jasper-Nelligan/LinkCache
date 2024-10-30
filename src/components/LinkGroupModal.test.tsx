import { emptyLinkGroupInfo } from "@/constants";
import { describe, expect, it, vi } from "vitest";
import LinkGroupModal from "./LinkGroupModal";
import { render } from '@testing-library/react';

describe("LinkGroupModal", () => {
  it('renders LinkGroupModal for new group', () => {
    const { getByText, getAllByText } = render(<LinkGroupModal linkGroupInfo={emptyLinkGroupInfo} onClose={vi.fn()} isModalOpen={true} onFormSubmit={vi.fn()} onDeleteGroup={vi.fn()} />);
    
    expect(getAllByText("Add New Group")).toHaveLength(2);
    expect(getByText("Group Name")).toBeTruthy();
    expect(getByText("Color")).toBeTruthy();
    expect(getAllByText("Link Name")).toHaveLength(4);
    expect(getAllByText("URL")).toHaveLength(4);
  })
})