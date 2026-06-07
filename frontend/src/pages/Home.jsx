import React from "react";
import { useTranslation } from "react-i18next";

import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import AiSuggest from "../components/AiSuggest";
import SEO from "../components/SEO";
import {
  OrganizationSchema,
  WebsiteSchema,
} from "../components/StructuredData";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <SEO
        title={t("homePage.seoTitle")}
        description={t("homePage.seoDescription")}
        keywords={t("homePage.seoKeywords")}
        ogUrl="https://vuonlanho.store/"
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <Hero />
      <div className="page-content-shell">
        <LatestCollection />
        <BestSeller />
        <AiSuggest />
        <OurPolicy />
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Home;
