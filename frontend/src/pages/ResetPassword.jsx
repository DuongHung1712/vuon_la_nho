import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

import AuthShell from "../components/AuthShell";
import { useResetPassword } from "../hooks/useApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import SEO from "../components/SEO";

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ mode: "onBlur" });

  const password = watch("password");
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [navigate, token]);

  const onSubmitHandler = async (data) => {
    resetPasswordMutation.mutate(
      { token, password: data.password },
      {
        onSuccess: (response) => {
          if (response.data.success) {
            setResetSuccess(true);
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          }
        },
      },
    );
  };

  return (
    <>
      <SEO noindex title={t("resetPasswordPage.seoTitle")} />
      <AuthShell
        badge={t("auth.tags.resetPassword")}
        title={t("resetPasswordPage.heroTitle")}
        description={t("resetPasswordPage.heroDescription")}
      >
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-center text-primary-900">
            {t("passwordReset.resetTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {resetSuccess ? t("passwordReset.successDesc") : t("passwordReset.resetDesc")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          {!resetSuccess ? (
            <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("passwordReset.newPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: t("passwordReset.errors.passwordRequired"),
                        minLength: {
                          value: 8,
                          message: t("passwordReset.errors.passwordMinLength"),
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
                  <Label htmlFor="confirmPassword">{t("passwordReset.confirmPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword", {
                        required: t("passwordReset.errors.confirmPasswordRequired"),
                        validate: (value) =>
                          value === password || t("passwordReset.errors.passwordNotMatch"),
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

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t("passwordReset.processing") : t("passwordReset.resetTitle")}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary-100 bg-primary-50/80 p-6 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary-600" />
                <h3 className="text-lg font-semibold text-primary-900">
                  {t("passwordReset.successTitle")}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{t("passwordReset.successDesc")}</p>
                <p className="mt-3 text-xs text-gray-500">{t("passwordReset.redirecting")}</p>
              </div>

              <Button type="button" onClick={() => navigate("/login")} className="w-full">
                {t("passwordReset.loginNow")}
              </Button>
            </div>
          )}
        </CardContent>
      </AuthShell>
    </>
  );
};

export default ResetPassword;
