import React from "react";

import Title from "./Title";

const PageIntro = ({ eyebrow, title1, title2, description, align = "center" }) => {
  return (
    <div className={`page-intro ${align === "left" ? "page-intro-left" : ""}`}>
      {eyebrow ? <p className="page-intro-eyebrow">{eyebrow}</p> : null}
      <div className="page-intro-title">
        <Title text1={title1} text2={title2} />
      </div>
      {description ? <p className="page-intro-description">{description}</p> : null}
    </div>
  );
};

export default PageIntro;
