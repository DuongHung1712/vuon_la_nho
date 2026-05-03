import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import SEO from "../components/SEO";
import { Truck, CreditCard, Check, Loader2 } from "lucide-react";

const PlaceOrder = () => {
  const { t } = useTranslation();
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    refetchCart,
    getCartAmount,
    delivery_fee,
    products,
    currency,
  } = useContext(ShopContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id == items),
            );
            if (itemInfo) {
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } },
          );
          if (response.data.success) {
            await refetchCart();
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <SEO noindex={true} title={`${t("placeOrder.paymentMethod")} - Vườn Lá Nhỏ`} />
      <div className="py-8 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-[80vh]">
        {/* Header */}
        <div className="mb-8">
          <Title text1={t("placeOrder.title1")} text2={t("placeOrder.title2")} />
          <p className="text-sm text-gray-500 mt-1">
            {t("placeOrder.paymentMethod")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Delivery Information */}
            <div className="lg:col-span-2">
              {/* Delivery Form Card */}
              <div className="bg-white rounded-xl border border-primary-100 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("placeOrder.title1")} {t("placeOrder.title2")}
                  </h2>
                </div>

                {/* Form Fields Grid */}
                <div className="space-y-4">
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        {t("placeOrder.firstName")}
                      </Label>
                      <Input
                        id="firstName"
                        {...register("firstName", {
                          required: t("placeOrder.errors.firstNameRequired"),
                          minLength: {
                            value: 2,
                            message: t("placeOrder.errors.firstNameMinLength"),
                          },
                        })}
                        placeholder={t("placeOrder.firstName")}
                        className="mt-1"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        {t("placeOrder.lastName")}
                      </Label>
                      <Input
                        id="lastName"
                        {...register("lastName", {
                          required: t("placeOrder.errors.lastNameRequired"),
                          minLength: {
                            value: 2,
                            message: t("placeOrder.errors.lastNameMinLength"),
                          },
                        })}
                        placeholder={t("placeOrder.lastName")}
                        className="mt-1"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      {t("placeOrder.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: t("placeOrder.errors.emailRequired"),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t("placeOrder.errors.emailInvalid"),
                        },
                      })}
                      placeholder={t("placeOrder.email")}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                      {t("placeOrder.address")}
                    </Label>
                    <Input
                      id="street"
                      {...register("street", {
                        required: t("placeOrder.errors.addressRequired"),
                        minLength: {
                          value: 5,
                          message: t("placeOrder.errors.addressMinLength"),
                        },
                      })}
                      placeholder={t("placeOrder.address")}
                      className="mt-1"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        {t("placeOrder.city")}
                      </Label>
                      <Input
                        id="city"
                        {...register("city", {
                          required: t("placeOrder.errors.cityRequired"),
                        })}
                        placeholder={t("placeOrder.city")}
                        className="mt-1"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        {t("placeOrder.state")}
                      </Label>
                      <Input
                        id="state"
                        {...register("state", {
                          required: t("placeOrder.errors.stateRequired"),
                        })}
                        placeholder={t("placeOrder.state")}
                        className="mt-1"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      {t("placeOrder.phone")}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone", {
                        required: t("placeOrder.errors.phoneRequired"),
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: t("placeOrder.errors.phoneInvalid"),
                        },
                      })}
                      placeholder={t("placeOrder.phone")}
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-xl border border-primary-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("placeOrder.paymentMethod")}
                  </h2>
                </div>

                {/* Payment Options */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div
                    onClick={() => setMethod("cod")}
                    className="flex-1 flex items-center gap-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary-300 hover:bg-primary-50/50"
                    style={{
                      borderColor: method === "cod" ? "#6C8E68" : "#dde8db",
                      backgroundColor:
                        method === "cod" ? "rgba(108, 142, 104, 0.05)" : "transparent",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: method === "cod" ? "#6C8E68" : "#dde8db",
                      }}
                    >
                      {method === "cod" && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: "#6C8E68" }}
                        />
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {t("placeOrder.paymentMethodCOD")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-primary-100 p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {t("placeOrder.orderSummary")}
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-primary-100">
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">{t("placeOrder.subtotal")}</span>
                    <span className="text-sm font-medium">
                      {getCartAmount()} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="text-sm">{t("placeOrder.deliveryFee")}</span>
                    <span className="text-sm font-medium">
                      {delivery_fee} {currency}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-semibold text-gray-900">
                    {t("placeOrder.totalAmount")}
                  </span>
                  <span className="font-bold text-lg text-primary-700">
                    {getCartAmount() + delivery_fee} {currency}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-base font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("placeOrder.processing")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{t("placeOrder.placeOrder")}</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlaceOrder;
