"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { Checkbox } from "../ui/checkbox";
import { IAddress } from "@/types";
import { useAddress } from "@/hooks/api/addresses/useAddress";

const AddressFrom = () => {
  const {
    addressForm,
    IsAddressError,
    addressLoading,
    attemptToCreateAddress,
  } = useAddress();

  return (
    <Form {...addressForm}>
      <form
        className="grid gap-6 "
        onSubmit={(...args) =>
          void addressForm.handleSubmit(attemptToCreateAddress)(...args)
        }
      >
        <FormField
          control={addressForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="Jone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={addressForm.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدولة</FormLabel>
              <FormControl>
                <Input placeholder="المملكة العربية السعودية" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={addressForm.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الشارع</FormLabel>
              <FormControl>
                <Textarea placeholder="رقم المنزل واسم الشارع" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={addressForm.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المدينة</FormLabel>
              <FormControl>
                <Input placeholder="المدينة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={addressForm.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={addressForm.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرمز البريدي</FormLabel>
              <FormControl>
                <Input placeholder="الرمز البريدي" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormItem className="w-full">
            <FormLabel>الايميل</FormLabel>
            <FormControl>
              <Input
                aria-invalid={!!addressForm.formState.errors.state}
                placeholder="example@gmail.com"
                {...addressForm.register("email")}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={addressForm.formState.errors?.state?.message}
            />
          </FormItem>
          <FormItem className="w-full">
            <FormLabel>رقم المحمول</FormLabel>
            <FormControl>
              <Input
                aria-invalid={!!addressForm.formState.errors.state}
                placeholder="+88016******"
                {...addressForm.register("phone")}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={addressForm.formState.errors?.state?.message}
            />
          </FormItem>
        </div>

        <FormField
          control={addressForm.control}
          name="default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>تعيين كعنوان افتراضي</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button disabled={addressLoading} className=" " size={"sm"}>
          {addressLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          حفظ
        </Button>
      </form>
    </Form>
  );
};

export default AddressFrom;
