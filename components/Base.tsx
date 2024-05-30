import React, { useState } from "react";
import "../output.css";

interface OpenMintProps {
  contractAddress: string;
}

const OpenMint = ({ contractAddress }: OpenMintProps) => {
  return (
    <div id="OpenMint-Container" className="w-full h-full text-xl">
      {contractAddress}
    </div>
  );
};

export default OpenMint;
