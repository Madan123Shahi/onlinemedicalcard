import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerSchema } from "@/validations/auth.validation";
import { useRegister } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  // zodResolver wires react-hook-form's validation engine to our Zod schema.
  // RHF calls schema.safeParse on submit and maps any errors back to the fields automatically.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Consolidate loading tracking state to the asynchronous mutation lifecycle hook
  const isLoading = registerMutation.isPending;

  const onSubmit = (values) => {
    registerMutation.mutate(values, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start your medical card evaluation today.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Full Name Input Block */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                placeholder="Jane Doe"
                disabled={isLoading}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm font-medium text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Input Block */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input Block */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button Controls */}
            <Button type="submit" className="mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Corrected & Repaired Layout Link Syntax */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
