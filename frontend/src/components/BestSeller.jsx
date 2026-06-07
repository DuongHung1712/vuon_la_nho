import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useTranslation } from "react-i18next";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-xl animate-hero-reveal">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          {t("bestseller.title1", "Sản phẩm")}{" "}
          <span className="font-display italic text-primary-600">
            {t("bestseller.title2", "Bán chạy nhất")}
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
          {t(
            "bestseller.description",
            "Khám phá những sản phẩm bán chạy của chúng tôi nha khách yêu",
          )}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
            rating={item.rating}
            reviewCount={item.reviewCount}
            sizes={item.sizes}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
