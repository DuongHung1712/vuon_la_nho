import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, MapPin, Save, X, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";

import Loading from "../components/Loading";
import PageIntro from "../components/PageIntro";
import SEO from "../components/SEO";
import { useProfile, useUpdateProfile } from "../hooks/useApi";

const ProfileEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { data, isLoading: loading } = useProfile(token);
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });
      setAvatarPreview(data.user.avatar || "");
    }
  }, [data]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("phone", formData.phone);
    submitData.append("address", formData.address);
    if (avatar) {
      submitData.append("avatar", avatar);
    }
    updateProfileMutation.mutate(submitData, {
      onSuccess: () => {
        navigate("/profile");
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-content-shell py-8 md:py-10">
      <SEO noindex title={t("profileEditPage.seoTitle")} />

      <section className="page-section">
        <div className="page-section-inner space-y-8">
          <PageIntro
            eyebrow={t("profile.editTitle")}
            title1={t("profileEditPage.title1")}
            title2={t("profileEditPage.title2")}
            description={t("profileEditPage.description")}
            align="left"
          />

          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] border border-primary-100/80 bg-white p-5 shadow-[0_18px_60px_-42px_rgba(66,88,62,0.45)] sm:p-8"
          >
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary-200 bg-primary-50">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-16 w-16 text-primary-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-primary-500 p-2 text-white shadow-md transition hover:bg-primary-600"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500">{t("profile.changeAvatar")}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4" />
                    {t("profile.email")}
                  </label>
                  <input
                    type="email"
                    value={data?.user?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                  />
                  <p className="mt-2 text-xs text-gray-500">{t("profile.emailCannotChange")}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    {t("profile.fullName")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-primary-100 px-4 py-3 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder={t("profileEditPage.placeholders.name")}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4" />
                    {t("profile.phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-primary-100 px-4 py-3 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder={t("profileEditPage.placeholders.phone")}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4" />
                    {t("profile.address")}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="5"
                    className="w-full rounded-xl border border-primary-100 px-4 py-3 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder={t("profileEditPage.placeholders.address")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <span className="inline-flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {updateProfileMutation.isPending ? t("profile.saving") : t("profile.saveChanges")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 rounded-xl bg-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-300"
              >
                <span className="inline-flex items-center gap-2">
                  <X className="h-5 w-5" />
                  {t("profile.cancel")}
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ProfileEdit;
