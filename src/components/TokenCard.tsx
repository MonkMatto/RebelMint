interface saleInfoProps {
  isTokenSaleActive: boolean;
  maxSupply: string | number;
  tokenCost: string | number;
  tokenUri: string;
}
interface tokenProps {
  name: string;
  created_by: string;
  description: string;
  external_url: string;
  attributes: [];
  image: string;
}
interface cardProps {
  token: tokenProps;
  saleInfo: saleInfoProps;
  index: number;
}
export const TokenCard = ({ token, saleInfo, index }: cardProps) => {
  if (token) {
    const { name, created_by, image } = token;
    const { maxSupply, tokenCost } = saleInfo;
    console.log(maxSupply);
    return (
      <div
        className=" max-w-52 w-fit flex flex-col justify-center align-middle bg-slate-400 p-2"
        onClick={() => setSelection(index)}
      >
        <img src={image} className="object-contain" />
        <div className="flex flex-col w-full">
          <div>
            <p>{name}</p>
            <p>{created_by}</p>
          </div>
          <p>{"Cost: " + tokenCost.toString()}</p>
          <p>{maxSupply}</p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
