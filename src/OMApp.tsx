import "./output.css";
import OpenMintButton from "./components/Button";

import { useEffect, useState } from "react";
import OpenMintInfo from "./components/ProjectInfo";
import OpenMintControls from "./components/Controls";

import contractABI from "./contract/abi";
import { useReadContract } from "wagmi";

interface OpenMintProps {
  contractAddress?: string;
}

export const OpenMintApp = ({ contractAddress }: OpenMintProps) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const result = useReadContract({
    abi: contractABI,
    address: "0xfbE3687896B583E9E9727a58BD96207f35fD015c",
    functionName: "getContractData",
  });
  console.log("Contract Data Returned:");
  console.log(result.data);

  const contractData = result.data;

  const project = {
    title: contractData ? contractData[0] : "Title",
    creator: "Creator",
    desc: "This project is a project that a creator has created",
    mintPrice: 0.15,
    allTokens: contractData ? contractData[1] : [],
    imgURL:
      tokens && tokens[0] && tokens[0].image
        ? tokens[Math.round(Math.random()) * (tokens.length - 1)].image
        : "https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  // We have each token URI and need to fetch info like Token image, creator,
  useEffect(() => {
    const fetchDataFromURI = async (uri) => {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(
          `Error fetching data from ${uri}: ${response.statusText}`,
        );
      }
      return response.json();
    };

    const fetchAllTokens = async () => {
      if (project.allTokens.length > 0) {
        try {
          const tokenUris = project.allTokens.map((token) => token.tokenUri);
          const dataPromises = tokenUris.map(fetchDataFromURI);
          const results = await Promise.all(dataPromises);
          setTokens(results);
          console.log(results);
        } catch (error) {
          console.log(error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllTokens();
  }, [project.allTokens]);

  const style = {
    "--image-url": `linear-gradient(
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.3)
      ), url(${project.imgURL})`,
  } as React.CSSProperties;

  return (
    <div
      id="OM-container"
      style={style}
      className="w-full h-full text-xl bg-[image:var(--image-url)] bg-cover bg-center flex flex-col justify-center align-center p-2 text-textcol"
    >
      <div
        id="OM-header"
        className="h-fit w-full flex justify-end justify-self-start"
      >
        <OpenMintButton buttonText="Connect Wallet" />
      </div>
      <OpenMintInfo project={project} />
      <OpenMintControls cost={project.mintPrice} />
    </div>
  );
};
