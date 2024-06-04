import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import contractABI from "../contract/abi";

interface selectionProps {
  mintPrice;
}
interface ControlProps {
  maxCount?: number;
  cost?: number;
  contractAddress?: `0x${string}`;
  selection?: object;
}

const OpenMintControls = ({
  maxCount,
  cost,
  contractAddress,
  selection,
}: ControlProps) => {
  const { writeContractAsync, data: hash } = useWriteContract();
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  console.log(address);
  const userAddress = address as `0x${string}`;
  const [count, setCount] = useState(1);
  const minusDisabled = count <= 1 ? true : false;
  const plusDisabled = count >= (maxCount ? maxCount : 999999) ? true : false;
  const costToDisplay = cost ? Math.round(cost * count * 10000) / 10000 : "?";
  const ethPriceToSend = cost && count ? cost * count : 0;
  console.log(address);

  const handleMint = async () => {
    try {
      await writeContractAsync({
        abi: contractABI,
        address: contractAddress as `0x${string}`,
        functionName: "mint",
        args: [userAddress, BigInt(1), BigInt(count)],
      });
      console.log("Transaction sent successfully");
      console.log(hash);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  if (userAddress) {
    return (
      <div id="OM-controls" className="w-full flex justify-center mb-5 gap-5">
        <button
          id="OM-minus"
          disabled={minusDisabled}
          onClick={() => setCount(count - 1)}
          className="bg-textcol p-5 text-bgcol rounded-xl hover:invert duration-150 ease-in-out disabled:invert-[70%]"
        >
          -
        </button>
        <button
          id="OM-mint"
          className="w-60 bg-textcol p-5 text-bgcol rounded-xl hover:invert duration-300 ease-in-out"
          onClick={handleMint}
        >
          {"Mint " +
            (count ? count : "1") +
            " Edition" +
            (count ? (count > 1 ? "s" : "") : "")}
          <p>{costToDisplay + " " + address.chain?.nativeCurrency.symbol}</p>
        </button>
        <button
          id="OM-plus"
          disabled={plusDisabled}
          onClick={() => setCount(count + 1)}
          className="bg-textcol p-5 text-bgcol rounded-xl hover:invert duration-150 ease-in-out disabled:invert-[50%]"
        >
          +
        </button>
      </div>
    );
  } else {
    return (
      <div id="OM-controls" className="w-full flex justify-center mb-5 gap-5">
        <button
          className="w-fit bg-[#3482cb93] p-5 rounded-xl border-white border-[1px]"
          onClick={() => {
            open();
          }}
        >
          Please connect wallet to mint
        </button>
      </div>
    );
  }
};

export default OpenMintControls;
