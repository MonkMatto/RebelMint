import React, { useState } from "react";

interface OpenMintProps {
  buttonText: string;
}

const OpenMintButton = ({ buttonText }: OpenMintProps) => {
  return (
    <div className="w-full h-full text-xl">
      {buttonText ? buttonText : "MINT"}
    </div>
  );
};

export default OpenMintButton;
