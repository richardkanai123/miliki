"use client";
import z from "zod";
import { signUpSchema } from "@/lib/schemas/signUpSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: signUpSchema.shape.username,
  email: signUpSchema.shape.email,
  name: signUpSchema.shape.name,
});

const UpdateUserForm = ({
  email,
  name,
  username,
  emailVerified,
  setClose,
}: {
  email: string;
  name: string;
  username: string;
  emailVerified: boolean;
  setClose: (value: boolean) => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const Router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      name,
      username,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name } = values;
    try {
      if (!name) {
        throw new Error("Name is required");
      }

      await updateUser(
        {
          name,
        },
        {
          onRequest: () => {
            setIsUpdating(true);
          },
          onSuccess: () => {
            form.reset();
            toast.success("Profile updated successfully");
            setIsUpdating(false);
            Router.refresh();
            setClose(false);
          },
          onError: ({ error }) => {
            throw new Error(error.message);
          },
        }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`Failed to update profile: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="shadcn"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your username is unique and cannot be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              {emailVerified ? (
                <FormDescription className="text-green-500">
                  Email is verified
                </FormDescription>
              ) : (
                <FormDescription className="text-red-500">
                  Email is not verified, verify your email on profile page
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isSubmitting || isUpdating ? (
          <Button
            type="submit"
            disabled
            variant="outline">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            variant="default">
            Update
          </Button>
        )}
      </form>
    </Form>
  );
};

export default UpdateUserForm;
