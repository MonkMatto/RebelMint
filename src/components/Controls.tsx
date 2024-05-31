import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import { useAccount } from "wagmi";

interface ControlProps {
  maxCount?: number;
  cost?: number;
}

const OpenMintControls = ({ maxCount, cost }: ControlProps) => {
  const [count, setCount] = useState(1);
  const minusDisabled = count <= 1 ? true : false;
  const plusDisabled = count >= (maxCount ? maxCount : 999999) ? true : false;

  const address = useAccount();
  const { open } = useWeb3Modal();

  const costToUser = cost ? Math.round(cost * count * 10000) / 10000 : "?";

  console.log(address.address);
  console.log(address.chain);

  if (address.address) {
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
        >
          {"Mint " +
            (count ? count : "1") +
            " Edition" +
            (count ? (count > 1 ? "s" : "") : "")}
          <p>{costToUser + " " + address.chain?.nativeCurrency.symbol}</p>
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
