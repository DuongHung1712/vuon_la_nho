import React from "react";
import { Leaf } from "lucide-react";
import { assets } from "../assets/assets";

const AuthShell = ({
  badge,
  children,
  align = "center",
}) => {
  return (
    <div className="page-auth-shell min-h-screen flex items-center justify-center">
      <div className={`page-auth-inner ${align === "left" ? "page-auth-left" : "page-auth-left"}`}>
        <div className="page-auth-header flex flex-col justify-between h-full">
          <div>
            {badge ? <p className="page-auth-badge">{badge}</p> : null}
          </div>
          
          <div className="mt-8 flex-1 hidden lg:flex flex-col items-center justify-end overflow-hidden rounded-2xl relative">
             <div className="absolute inset-0 bg-primary-50/30 rounded-2xl mix-blend-multiply pointer-events-none z-10" />
            <img 
              src={assets.hero_img} 
              alt="Vuon La Nho" 
              className="w-full h-full object-cover rounded-2xl"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
        </div>

        <div className="page-auth-card flex flex-col justify-center h-full">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
