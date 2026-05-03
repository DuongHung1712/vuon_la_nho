import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Edit, LogOut, User, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

import Loading from "../components/Loading";
import PageIntro from "../components/PageIntro";
import SEO from "../components/SEO";
import { useProfile } from "../hooks/useApi";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { data, isLoading: loading, error } = useProfile(token);

  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  React.useEffect(() => {
    if (error?.response?.status === 401) {
      navigate("/login");
    }
  }, [error, navigate]);

  const user = data?.user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="page-content-shell py-10">
        <p className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-center text-red-600">
          {t("profile.errors.loadFailed")}
        </p>
      </div>
    );
  }

  return (
    <div className="page-content-shell py-8 md:py-10">
      <SEO noindex title={t("profilePage.seoTitle")} />

      <section className="page-section">
        <div className="page-section-inner space-y-8">
          <PageIntro
            eyebrow={t("profile.title")}
            title1={t("profilePage.title1")}
            title2={t("profilePage.title2")}
            description={t("profilePage.description")}
            align="left"
          />

          <div className="overflow-hidden rounded-[24px] border border-primary-100/80 bg-white shadow-[0_18px_60px_-42px_rgba(66,88,62,0.45)]">
            <div className="relative h-28 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-400 sm:h-36">
              <div className="absolute -bottom-14 left-5 sm:left-8">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary-100 shadow-lg sm:h-32 sm:w-32">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-14 w-14 text-primary-600 sm:h-16 sm:w-16" />
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 pb-6 pt-20 sm:px-8 sm:pb-8 sm:pt-24">
              <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-primary-900 sm:text-3xl">
                    {user?.name}
                  </h1>
                  <Leaf className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-sm text-gray-500">{t("profilePage.memberSince")}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="page-surface-card">
                  <div className="mb-2 flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <p className="text-sm font-semibold">{t("profile.email")}</p>
                  </div>
                  <p className="break-all text-gray-800">{user?.email}</p>
                </div>

                <div className="page-surface-card">
                  <div className="mb-2 flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <p className="text-sm font-semibold">{t("profile.phone")}</p>
                  </div>
                  <p className="text-gray-800">{user?.phone || t("profile.notUpdated")}</p>
                </div>

                <div className="page-surface-card">
                  <div className="mb-2 flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm font-semibold">{t("profile.address")}</p>
                  </div>
                  <p className="text-gray-800">{user?.address || t("profile.notUpdated")}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="flex-1 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white transition hover:bg-primary-600"
                >
                  <span className="inline-flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    {t("profile.editButton")}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-secondary-600 px-6 py-3 font-medium text-white transition hover:bg-secondary-700"
                >
                  <span className="inline-flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    {t("profile.logoutButton")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
