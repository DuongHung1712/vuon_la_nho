import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import AuthShell from "../components/AuthShell";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useForgotPassword } from "../hooks/useApi";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({ mode: "onBlur" });

  const forgotPasswordMutation = useForgotPassword();
  const email = watch("email");

  const onSubmitHandler = async (data) => {
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: (response) => {
        if (response.data.success) {
          setEmailSent(true);
        }
      },
    });
  };

  return (
    <>
      <SEO noindex title={t("forgotPasswordPage.seoTitle")} />
      <AuthShell
        badge={t("auth.tags.forgotPasswordTitle")}
        title={t("forgotPasswordPage.heroTitle")}
        description={t("forgotPasswordPage.heroDescription")}
      >
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-center text-primary-900">
            {t("passwordReset.forgotTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {emailSent ? t("passwordReset.emailSentTitle") : t("passwordReset.forgotDesc")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          {!emailSent ? (
            <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
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
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t("forgotPasswordPage.sending") : t("passwordReset.sendEmail")}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("passwordReset.backToLogin")}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary-100 bg-primary-50/80 p-5 text-center">
                <Mail className="mx-auto mb-3 h-12 w-12 text-primary-600" />
                <h3 className="text-lg font-semibold text-primary-900">
                  {t("passwordReset.emailSentTitle")}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{t("passwordReset.emailSentDesc")}</p>
                <p className="mt-2 break-all font-medium text-primary-900">{email}</p>
                <p className="mt-3 text-xs text-gray-500">{t("passwordReset.linkExpires")}</p>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>{t("passwordReset.didNotReceive")}</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setEmailSent(false)}
                  className="h-auto p-0"
                >
                  {t("passwordReset.sendAgain")}
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("passwordReset.backToLogin")}
              </Button>
            </div>
          )}
        </CardContent>
      </AuthShell>
    </>
  );
};

export default ForgotPassword;
