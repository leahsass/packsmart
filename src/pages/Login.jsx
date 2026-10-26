import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LogIn, Facebook, Apple } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", icon: <GoogleIcon className="w-5 h-5 mr-2" />, variant: "default" },
  { id: "apple", label: "Continue with Apple", icon: <Apple className="w-5 h-5 mr-2" />, variant: "outline" },
  { id: "facebook", label: "Continue with Facebook", icon: <Facebook className="w-5 h-5 mr-2 text-[#1877F2]" />, variant: "outline" },
];

export default function Login() {
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in with a social account — no passwords, ever"
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      {PROVIDERS.map((p, i) => (
        <Button
          key={p.id}
          variant={p.variant}
          className={`w-full h-12 text-sm font-semibold ${i < PROVIDERS.length - 1 ? "mb-2" : ""}`}
          onClick={() => base44.auth.loginWithProvider(p.id, returnTo)}
        >
          {p.icon}
          {p.label}
        </Button>
      ))}
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-4">
        Your account is created automatically the first time you sign in.
      </p>
    </AuthLayout>
  );
}