interface OpenMintProps {
  buttonText: string;
}

const OpenMintButton = ({ buttonText }: OpenMintProps) => {
  return <w3m-button balance="hide" />;
};

export default OpenMintButton;
