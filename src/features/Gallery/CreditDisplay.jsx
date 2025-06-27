import React from 'react';
import EditActionButtons from "../../components/ui/EditActionButtons";

const CreditDisplay = ({ imageId, outputImageUrl }) => {
  return (
    <div className="bg-[#f0f0f0] rounded-2xl p-2.5 w-[554px]">
      <EditActionButtons imageId={imageId} outputImageUrl={outputImageUrl} />
    </div>
  );
};

export default CreditDisplay;
