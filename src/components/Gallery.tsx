import { TokenCard } from "./TokenCard";

interface galleryProps {
  project: object;
  tokens: [];
}

export const OMGallery = ({ project, tokens }: galleryProps) => {
  return (
    <div className="grid grid-cols-3 w-full p-10 overflow-y-auto">
      {tokens &&
        tokens.map((a, index) => (
          <TokenCard
            key={index}
            token={a}
            index={index}
            saleInfo={project.allTokens[index]}
          />
        ))}
    </div>
  );
};
