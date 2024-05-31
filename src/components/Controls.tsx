import { useState } from "react";

interface ControlProps {
  maxCount?: number;
}

const OpenMintControls = ({ maxCount }: ControlProps) => {
  const [count, setCount] = useState(1);
  const minusDisabled = count <= 1 ? true : false;
  const plusDisabled = count >= (maxCount ? maxCount : 999999) ? true : false;

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
};

export default OpenMintControls;
