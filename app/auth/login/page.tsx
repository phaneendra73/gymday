"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "@/app/schemas/auth";
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




export default function LoginPage() {
    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function onLoginSubmit(data: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged In Sucessfully")
                        router.push("/")
                    },
                    onError: (er) => {
                        toast.error(er.error.message)
                    }
                }
            });
        })

    }

    return (
        <>
            <Card className="border-border/60 shadow-xl bg-card/60 backdrop-blur-md transition-all hover:shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-base">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FieldGroup className="space-y-4">
                            <Controller
                                name="email"
                                control={loginForm.control}
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
                                control={loginForm.control}
                                render={({ field, fieldState }) => (
                                    <Field className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <FieldLabel>Password</FieldLabel>
                                            <Link
                                                href="/auth/forgot-password"
                                                className="text-xs font-medium text-muted-foreground hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
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
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t px-6 py-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}