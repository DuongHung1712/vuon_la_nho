import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import AuthShell from "../components/AuthShell";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useVerifyEmail } from "../hooks/useApi";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const token = searchParams.get("token");

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      return;
    }

    verifyEmailMutation.mutate(token, {
      onSuccess: (response) => {
        setVerificationStatus(response.data.success ? "success" : "error");
      },
      onError: () => {
        setVerificationStatus("error");
      },
    });
  }, [token, verifyEmailMutation]);

  const renderContent = () => {
    if (verificationStatus === "verifying") {
      return (
        <div className="py-8 text-center">
          <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-primary-600" />
          <h3 className="text-lg font-semibold text-primary-900">
            {t("passwordReset.verifying")}
          </h3>
          <p className="mt-2 text-sm text-gray-600">{t("passwordReset.verifyingDesc")}</p>
        </div>
      );
    }

    if (verificationStatus === "success") {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary-100 bg-primary-50/80 p-6 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary-600" />
            <h3 className="text-lg font-semibold text-primary-900">
              {t("passwordReset.verifySuccess")}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {t("passwordReset.verifySuccessDesc")}
            </p>
          </div>

          <Button type="button" onClick={() => navigate("/")} className="w-full">
            {t("passwordReset.goHome")}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h3 className="text-lg font-semibold text-red-700">
            {t("passwordReset.verifyFailed")}
          </h3>
          <p className="mt-2 text-sm text-red-600">{t("passwordReset.verifyFailedDesc")}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" onClick={() => navigate("/profile")} className="w-full">
            {t("passwordReset.resendEmail")}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/")} className="w-full">
            {t("passwordReset.backHome")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO noindex title={t("verifyEmailPage.seoTitle")} />
      <AuthShell
        badge={t("auth.tags.verifyEmail")}
        title={t("verifyEmailPage.heroTitle")}
        description={t("verifyEmailPage.heroDescription")}
      >
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-center text-primary-900">
            {t("verifyEmailPage.cardTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "verifying" && t("verifyEmailPage.cardStates.verifying")}
            {verificationStatus === "success" && t("verifyEmailPage.cardStates.success")}
            {verificationStatus === "error" && t("verifyEmailPage.cardStates.error")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">{renderContent()}</CardContent>
      </AuthShell>
    </>
  );
};

export default VerifyEmail;
