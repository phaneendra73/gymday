"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { signUpSchema } from "@/app/schemas/auth";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SignupPage() {
    const signupform = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function onsignupSubmit(data: z.infer<typeof signUpSchema>) {
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                name: data.name,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account cretaed Sucessfully")
                        router.push("/")
                    },
                    onError: (er) => {
                        toast.error(er.error.message)
                    }
                }
            })
        })

    }

    return (
        <>
            <Card className="border-border/60 shadow-xl bg-card/60 backdrop-blur-md transition-all hover:shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
                    <CardDescription className="text-base">
                        Enter your details below to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={signupform.handleSubmit(onsignupSubmit)} className="space-y-4">
                        <FieldGroup className="space-y-1">
                            <Controller
                                name="name"
                                control={signupform.control}
                                render={({ field, fieldState }) => (
                                    <Field className="space-y-1">
                                        <FieldLabel>Name</FieldLabel>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={signupform.control}
                                render={({ field, fieldState }) => (
                                    <Field className="space-y-1">
                                        <FieldLabel>Email</FieldLabel>
                                        <Input
                                            placeholder="name@example.com"
                                            {...field}
                                            type="email"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={signupform.control}
                                render={({ field, fieldState }) => (
                                    <Field className="space-y-1">
                                        <FieldLabel>Password</FieldLabel>
                                        <Input
                                            placeholder="********"
                                            {...field}
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Button className="w-full font-semibold" size="lg" type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t px-6 py-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                            Log in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
            <p className="px-8 text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </p>
        </>
    );
}