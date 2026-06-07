import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import AuthShell from "../components/AuthShell";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ShopContext } from "../context/ShopContext";
import { useRegister } from "../hooks/useApi";

const Register = () => {
  const { t } = useTranslation();
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ mode: "onBlur" });

  const password = watch("password");

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    switch (error) {
      case "oauth_failed":
        toast.error(t("auth.errors.oauthFailed"));
        break;
      case "no_code":
        toast.error(t("auth.errors.noCode"));
        break;
      case "no_email":
        toast.error(t("auth.errors.noEmail"));
        break;
      case "auth_failed":
        toast.error(t("auth.errors.authFailed"));
        break;
      default:
        toast.error(t("common.error"));
    }
    navigate("/register", { replace: true });
  }, [navigate, searchParams, t]);

  const registerMutation = useRegister();

  const onSubmitHandler = async (data) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
          }
        },
      },
    );
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  return (
    <>
      <SEO noindex title={t("registerPage.seoTitle")} />
      <AuthShell
        badge={t("auth.tags.createNewAccount")}
        title={t("registerPage.heroTitle")}
        description={t("registerPage.heroDescription")}
      >
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-center text-primary-900">{t("auth.registerTitle")}</CardTitle>
          <CardDescription className="text-center">{t("auth.registerDesc")}</CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            <div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("registerPage.placeholders.name")}
                  {...register("name", {
                    required: t("auth.errors.nameRequired"),
                    minLength: {
                      value: 2,
                      message: t("auth.errors.nameMinLength"),
                    },
                  })}
                  className={errors.name ? "border-red-500" : ""}
                />
              </div>
              <div className="min-h-[20px] mt-1">
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email", {
                    required: t("auth.errors.emailRequired"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("auth.errors.emailInvalid"),
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
              </div>
              <div className="min-h-[20px] mt-1">
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: t("auth.errors.passwordRequired"),
                      minLength: {
                        value: 6,
                        message: t("auth.errors.passwordMinLength"),
                      },
                    })}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="min-h-[20px] mt-1">
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: t("auth.errors.confirmPasswordRequired"),
                      validate: (value) => value === password || t("auth.errors.passwordNotMatch"),
                    })}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="min-h-[20px] mt-1">
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2 text-center text-sm">
              <span className="text-gray-600">{t("auth.hasAccount")} </span>
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
                className="h-auto p-0"
              >
                {t("auth.loginNow")}
              </Button>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? t("auth.processing") : t("auth.registerTitle")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">{t("auth.or")}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.location.href = `${backendUrl}/api/user/auth/google`;
              }}
              className="w-full"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t("auth.registerWithGoogle")}
            </Button>
          </div>
        </CardContent>
      </AuthShell>
    </>
  );
};

export default Register;
