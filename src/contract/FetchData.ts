import { useReadContract } from "wagmi";
import contractABI from "./abi.ts";
import { useEffect, useState } from "react";

// module to read out smart contract and store values
export function ReadContract() {
  const contractRead = useReadContract({
    // storage contract to read out int
    address: "0x690172192cE338d6e5bCB65d3C9e44aA5352781e",
    abi: contractABI,
    functionName: "allTokenData",
    inputs: [{ name: "account", type: "address" }],
    watch: true,
  });
  // write data in variable ;
  const [value, setValue] = useState();
  const contractData = contractRead.data;

  // always executes when value of comparison changes
  useEffect(() => {
    setValue((value) => [...value, comparison]);
  }, [contractData]);
}
