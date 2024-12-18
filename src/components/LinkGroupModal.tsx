import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ColorOptions from "./ColorOptions";
import { LinkGroupInfo } from "@/types";
import { useEffect } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Trash2 } from "lucide-react";

// TODO rename this to LinkGroupFormModal
export default function LinkGroupModal(
  { linkGroupInfo, onClose, isModalOpen, onFormSubmit, onDeleteGroup }:
    {
      linkGroupInfo: LinkGroupInfo;
      onClose: () => void;
      isModalOpen: boolean;
      onFormSubmit: (linkGroupInfo: LinkGroupInfo) => void
      onDeleteGroup: (linkGroupId: number) => void
    }
) {
  const isEditForm = linkGroupInfo.linkGroupName ? true : false;

  // Populate with empty link pairs to ensure there are always 4 pairs
  const populateEmptyLinkPairs = (linkPairs: { name: string, url: string }[]) => {
    while (linkPairs.length < 4) {
      linkPairs.push({ name: "", url: "" });
    }

    return linkPairs;
  }

  useEffect(() => {
    form.reset({
      linkGroupName: linkGroupInfo.linkGroupName,
      color: linkGroupInfo.color,
      linkPairs: populateEmptyLinkPairs(linkGroupInfo.linkPairs)
    });
  }, [linkGroupInfo])

  const linkPairSchema = z.object({
    name: z.string(),
    url: z.string(),
  });

  const formSchema = z.object({
    linkGroupName: z.string().min(1, { message: "Group name cannot be empty" }).max(50, { message: "Group name must be less than 50 characters" }),
    color: z.string(),
    linkPairs: z.array(linkPairSchema),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkGroupName: "",
      color: "",
      linkPairs: Array(4).fill({ name: "", url: "" }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "linkPairs",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onFormSubmit({ ...data, id: linkGroupInfo.id });
    onClose();
  }

  const onCancel = () => {
    
    form.reset({
      linkGroupName: linkGroupInfo.linkGroupName,
      color: linkGroupInfo.color,
      linkPairs: populateEmptyLinkPairs(linkGroupInfo.linkPairs)
    });
    onClose();
  }

  const onColorChange = (color: string) => {
    form.setValue("color", color);
  }

  const onDeleteGroupPressed = () => {
    onDeleteGroup(linkGroupInfo.id);
    onClose();
  }

  const renderLinkPairs = () => {
    return fields.map((field, index) => (
      <div key={`${field.id}-${index}`} className="flex space-x-4 mt-2 justify-between items-center">
        <Controller
          name={`linkPairs.${index}.name`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Link Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          name={`linkPairs.${index}.url`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={() => { remove(index) }} variant="ghost" className="self-end">
          <Trash2 color="red" />
        </Button>
      </div>
    ))
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>
          {isEditForm ? "Edit Group" : "Add New Group"}
        </DialogTitle>
        <VisuallyHidden.Root>
          <DialogDescription>
            {isEditForm ? "Edit Group" : "Add New Group"}
          </DialogDescription>
        </VisuallyHidden.Root>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} data-testid="form">
              <div className="flex flex-col md:flex-row justify-between md:items-center md:space-x-4">
                <FormField
                  control={form.control}
                  name="linkGroupName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="group-name-input" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorOptions onColorChange={onColorChange} initialSelectedColor={linkGroupInfo.color} />
                  </FormControl>
                </FormItem>
              </div>
              <FormField
                control={form.control}
                name="linkGroupName"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 mb-4">
                {renderLinkPairs()}
              </div>
              <Button className="mb-4 bg-green-500 hover:bg-green-500/90 dark:bg-green-600 dark:hover:bg-green-600/90" type="button" onClick={() => append({ name: "", url: "" })}>
                Add Link
              </Button>
              <DialogFooter className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <Button type="submit" className="w-full md:w-[100%]">
                  {isEditForm ? "Save Changes" : "Add Group"}
                </Button>
                {isEditForm && (
                  <Button type="button" variant="destructive" onClick={onDeleteGroupPressed} className="w-full md:w-[30%]">
                    Delete Group
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}