import React, { useState } from "react";

interface OpenMintProps {
  contractAddress: string;
}

const OpenMint = ({ contractAddress }: OpenMintProps) => {
  return (
    <div id="OpenMint-Container" className="w-full h-full bg-white text-xl">
      {contractAddress}
    </div>
  );
};

export default OpenMint;
