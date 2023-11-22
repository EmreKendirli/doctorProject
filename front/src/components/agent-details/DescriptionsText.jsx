import React from "react";

const DescriptionsText = ({ officeDataDetail }) => {
  const descriptionHTML = officeDataDetail?.officeDetail?.aboutUs?.value;

  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <>
      <h3 className="title mb-3">Açıklama Başlığı</h3>
      <div
        className="mb25"
        dangerouslySetInnerHTML={renderHTML(descriptionHTML)}
      />
    </>
  );
};

export default DescriptionsText;
