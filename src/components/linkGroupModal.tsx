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
import ColorOptions from "./colorOptions";
import { LinkGroupInfo } from "@/types";
import { useEffect } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function LinkGroupModal(
  { linkGroupInfo, onClose, isModalOpen, onFormSubmit }:
    {
      linkGroupInfo: LinkGroupInfo;
      onClose: () => void;
      isModalOpen: boolean;
      onFormSubmit: (linkGroupInfo: LinkGroupInfo) => void
    }
) {
  useEffect(() => {
    form.setValue("linkGroupName", linkGroupInfo.linkGroupName);
    form.setValue("color", linkGroupInfo.color);
    form.setValue("linkPairs", linkGroupInfo.linkPairs);
  }, [linkGroupInfo]);

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

  const onColorChange = (color: string) => {
    form.setValue("color", color);
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
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Link URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={() => {
          remove(index);
        }} variant="ghost" className="self-end">
          <img src="/trash_icon.png" alt="Delete link" className="h-5 w-5" />
        </Button>
      </div>
    ))
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>
          {linkGroupInfo.linkGroupName ? "Edit Link Group" : "Add Link Group"}
        </DialogTitle>
        <DialogDescription>
          <VisuallyHidden.Root>
            {linkGroupInfo.linkGroupName ? "Edit Link Group" : "Add Link Group"}
          </VisuallyHidden.Root>
        </DialogDescription>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-between items-center space-x-4">
                <FormField
                  control={form.control}
                  name="linkGroupName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
              <Button className="mb-4" type="button" onClick={() => append({ name: "", url: "" })}>
                Add Link
              </Button>
              <DialogFooter>
                <Button type="submit" className="w-[100%]">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}