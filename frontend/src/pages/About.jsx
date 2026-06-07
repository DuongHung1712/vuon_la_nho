import React from "react";
import { Sprout, ShieldCheck, HeartHandshake } from "lucide-react";
import { useTranslation } from "react-i18next";

import { assets } from "../assets/assets";
import PageIntro from "../components/PageIntro";
import SEO from "../components/SEO";

const About = () => {
  const { t } = useTranslation();

  const highlights = [
    {
      icon: <Sprout className="h-5 w-5" />,
      title: t("aboutPage.highlights.curatedTitle"),
      description: t("aboutPage.highlights.curatedDesc"),
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: t("aboutPage.highlights.careTitle"),
      description: t("aboutPage.highlights.careDesc"),
    },
    {
      icon: <HeartHandshake className="h-5 w-5" />,
      title: t("aboutPage.highlights.serviceTitle"),
      description: t("aboutPage.highlights.serviceDesc"),
    },
  ];

  return (
    <div className="page-content-shell py-8 md:py-10">
      <SEO
        title={t("aboutPage.seoTitle")}
        description={t("aboutPage.seoDescription")}
        keywords={t("aboutPage.seoKeywords")}
        ogUrl="https://vuonlanho.store/about"
      />

      <section className="page-section">
        <div className="page-section-inner space-y-10">
          <PageIntro
            eyebrow={t("aboutPage.eyebrow")}
            title1={t("aboutPage.title1")}
            title2={t("aboutPage.title2")}
            description={t("aboutPage.description")}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="overflow-hidden rounded-[24px] border border-primary-100/80 bg-white shadow-[0_18px_60px_-42px_rgba(66,88,62,0.45)]">
              <img
                className="h-full min-h-[280px] w-full object-cover"
                src={assets.about_img}
                alt={t("aboutPage.imageAlt")}
              />
            </div>

            <div className="space-y-5">
              <div className="page-surface-card">
                <p className="text-sm leading-7 text-gray-600 sm:text-base">
                  {t("aboutPage.story")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {highlights.map(({ icon, title, description }) => (
                  <div key={title} className="page-surface-card">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-700">
                      {icon}
                    </div>
                    <h3 className="text-base font-semibold text-primary-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
                  </div>
                ))}
              </div>

              <div className="page-surface-card bg-primary-900 text-primary-50">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">
                  {t("aboutPage.contactLabel")}
                </p>
                <p className="mt-3 text-base font-semibold">{t("aboutPage.contactName")}</p>
                <p className="mt-1 break-all text-sm text-primary-100">
                  {t("aboutPage.contactEmail")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
