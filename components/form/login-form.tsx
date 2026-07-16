"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);
  const router = useRouter();
  const googleSignIn = async () => {
    // Google OAuth is a redirect-based flow — the browser redirects to Google
    // and back. callbackURL tells Better Auth where to land after OAuth completes.
    // Better Auth returns errors as { error } instead of throwing, so we must
    // check the result explicitly; otherwise failures leave the button stuck loading.
    try {
      setGoogleSignInLoading(true);
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        toast.error("Failed to sign in: " + (result.error.message ?? "Unknown error"));
        setGoogleSignInLoading(false);
      }
      // On success the browser navigates to Google — loading stays active intentionally.
    } catch (e) {
      const error = e as Error;
      toast.error("Failed to sign in: " + error.message);
      setGoogleSignInLoading(false);
    }
  };
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // const {data:response,error} = await authClient.signIn.email(email:data.email,password:data.password);
      const { data: response, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) {
        toast(error?.message || "Failed to sign in ");
      } else {
        toast.success("Logged in successfully");
        toast.info("please check your email for verification");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay to ensure session is set
        router.push("/dashboard");
        console.log(response);
      }
    } catch (e) {
      const error = e as Error;
      toast.error("Failed to log in " + error.message);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="joe@gmail.com"
                      autoComplete="email"
                    />
                    {/* <FieldDescription>-</FieldDescription> */}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-input-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="joe@gmail.com"
                      autoComplete="current-password"
                    />
                    {/* <FieldDescription>-</FieldDescription> */}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="hover:cursor-pointer"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-2 w-2 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={googleSignIn}
                className="hover:cursor-pointer"
              >
                {googleSignInLoading ? (
                  <Loader2 className="h-2 w-2 animate-spin" />
                ) : (
                  <div className="flex gap-1 items-center">
                    Sign in with google <FcGoogle />
                  </div>
                )}
              </Button>
              <FieldDescription className="text-center">
                Create an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
