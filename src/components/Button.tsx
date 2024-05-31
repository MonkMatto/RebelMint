import { createWeb3Modal, useWeb3Modal } from "@web3modal/wagmi/react";
import React, { useEffect, useState } from "react";
import { useWalletInfo } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

interface OpenMintProps {
  buttonText: string;
}

const OpenMintButton = ({ buttonText }: OpenMintProps) => {
  const { open } = useWeb3Modal();
  const { walletInfo } = useWalletInfo();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [userAddress, setUserAddress] = useState(null);
  const shortAddress = address
    ? address.substring(0, 4) +
      "..." +
      address.substring(address.length - 4, address.length)
    : null;

  console.log(address ? address : "no wallet connected");
  const handleConnect = () => {
    isDisconnected ? open({ view: "Networks" }) : open();
    setUserAddress(address);
  };

  useEffect(() => {
    console.log(userAddress);
  }, [userAddress]);

  return (
    <button
      onClick={handleConnect}
      className="w-fit h-fit bg-white rounded-md text-md"
    >
      {address ? shortAddress : buttonText}
    </button>
  );
};

export default OpenMintButton;
