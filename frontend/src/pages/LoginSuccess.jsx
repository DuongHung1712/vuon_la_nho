import { useEffect, useContext, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import AuthShell from "../components/AuthShell";
import SEO from "../components/SEO";
import { ShopContext } from "../context/ShopContext";

export default function LoginSuccess() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setToken, refetchCart, backendUrl } = useContext(ShopContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processLogin = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/session`, {
          withCredentials: true,
        });

        if (!response.data.success) {
          navigate("/login");
          return;
        }

        const token = response.data.token;
        localStorage.setItem("token", token);
        setToken(token);

        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        await refetchCart();

        navigate("/");
      } catch (requestError) {
        console.error("Login processing error:", requestError);
        setError(t("loginSuccessPage.error"));
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    processLogin();
  }, [backendUrl, navigate, queryClient, refetchCart, setToken, t, searchParams]);

  return (
    <>
      <SEO noindex title={t("loginSuccessPage.seoTitle")} />
      <AuthShell
        badge={t("loginSuccessPage.badge")}
        title={error ? t("loginSuccessPage.errorTitle") : t("loginSuccessPage.processingTitle")}
        description={
          error ? t("loginSuccessPage.redirectDescription") : t("loginSuccessPage.processingDescription")
        }
      >
        <div className="py-6 text-center">
          {error ? (
            <div className="space-y-4 rounded-2xl border border-red-100 bg-red-50 p-6">
              <TriangleAlert className="mx-auto h-14 w-14 text-red-500" />
              <p className="text-base font-medium text-red-700">{error}</p>
              <p className="text-sm text-red-600">{t("loginSuccessPage.redirectDescription")}</p>
            </div>
          ) : (
            <div className="space-y-4 rounded-2xl border border-primary-100 bg-primary-50/80 p-6">
              <div className="relative mx-auto h-16 w-16">
                <Loader2 className="h-16 w-16 animate-spin text-primary-500" />
                <ShieldCheck className="absolute inset-0 m-auto h-7 w-7 text-secondary-600" />
              </div>
              <p className="text-lg font-medium text-primary-900">
                {t("loginSuccessPage.processingTitle")}
              </p>
              <p className="text-sm text-gray-600">
                {t("loginSuccessPage.processingDescription")}
              </p>
            </div>
          )}
        </div>
      </AuthShell>
    </>
  );
}
