import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "../ui/form";
import { Icons } from "../ui/icons";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/user.action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import ImageUpload from "@/app/(dashboard)/account/edit/components/ImageUpload";
import { Card } from "../ui/card";

// Define validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(6, {
    message: "Phone number must be at least 6 characters.",
  }),
  image: z.string().url(),
});

const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      image: "",
    },
  });
  // console.log(form.getValues(), "values");
  // Fetch user data and set form values
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (currentUser) {
          form.reset({
            name: currentUser.name || "",
            phone: currentUser.phone || "",
            image: currentUser.image || "",
          });
        }
        setInitialLoad(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setInitialLoad(false);
      }
    };

    fetchUserData();
  }, [form]);

  // Handle form submission
  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await updateUserProfile(values);
      if (response?.success) {
        toast.success("تم تحديث الملف الشخصي بنجاح");
      }
    } catch (error) {
      console.error("حدث خطا اثناء تحديث الملف الشخصي:", error);
      toast.error("حصل خطا اثناء تحديث الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 w-full pt-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="lg:w-2/3 w-full">
          <FormItem className="flex w-full flex-col gap-1.5">
            <FormLabel>الصورة الشخصية</FormLabel>
            <FormControl>
              <ImageUpload
                value={form.getValues("image") || ""}
                onChange={(value) => form.setValue("image", value)}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.image?.message}
            />
          </FormItem>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          تحديث الملف الشخصي
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
