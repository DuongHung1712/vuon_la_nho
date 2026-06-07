import React from "react";
import { MapPin, Phone, Mail, Clock4 } from "lucide-react";
import { useTranslation } from "react-i18next";

import PageIntro from "../components/PageIntro";
import SEO from "../components/SEO";

const Contact = () => {
  const { t } = useTranslation();

  const contactCards = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: t("contactPage.cards.addressTitle"),
      content: t("contactPage.cards.addressContent"),
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: t("contactPage.cards.phoneTitle"),
      content: t("contactPage.cards.phoneContent"),
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: t("contactPage.cards.emailTitle"),
      content: t("contactPage.cards.emailContent"),
    },
    {
      icon: <Clock4 className="h-5 w-5" />,
      title: t("contactPage.cards.hoursTitle"),
      content: t("contactPage.cards.hoursContent"),
    },
  ];

  return (
    <div className="page-content-shell py-8 md:py-10">
      <SEO
        title={t("contactPage.seoTitle")}
        description={t("contactPage.seoDescription")}
        keywords={t("contactPage.seoKeywords")}
        ogUrl="https://vuonlanho.store/contact"
      />

      <section className="page-section">
        <div className="page-section-inner space-y-10">
          <PageIntro
            eyebrow={t("contactPage.eyebrow")}
            title1={t("contactPage.title1")}
            title2={t("contactPage.title2")}
            description={t("contactPage.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {contactCards.map(({ icon, title, content }) => (
              <div key={title} className="page-surface-card">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-700">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-primary-900">{title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                  {content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
