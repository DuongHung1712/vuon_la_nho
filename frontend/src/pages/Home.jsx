import React from "react";
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
  return (
    <div>
      <SEO
        title="Vườn Lá Nhỏ - Cây Cảnh Chất Lượng Cao | Giao Hàng Toàn Quốc"
        description="Vườn Lá Nhỏ chuyên cung cấp cây cảnh trong nhà, cây ngoài trời chất lượng cao. Đa dạng loại cây, giá cả hợp lý, giao hàng tận nơi, tư vấn chăm sóc tận tình."
        keywords="cây cảnh, cây trong nhà, cây ngoài trời, mua cây online, vườn lá nhỏ, cây trang trí, sen đá, xương rồng"
        ogUrl="https://vuonlanho.store/"
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <Hero />
      <LatestCollection />
      <BestSeller />
      <AiSuggest />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
