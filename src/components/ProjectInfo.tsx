interface ProjectProps {
  title?: string;
  creator?: string;
  desc?: string;
  imgURL?: string;
}
interface InfoProps {
  project: ProjectProps;
}
const OpenMintInfo = ({ project }: InfoProps) => {
  const { title, creator, desc, imgURL } = project;
  const style = { "--image-url": `url(${imgURL})` } as React.CSSProperties;
  return (
    <div
      id="OM-info"
      style={style}
      className="w-full h-full bg-[image:var(--image-url)] bg-cover bg-center rounded-full overflow-hidden p-5"
    >
      <h1 className="text-white">{title}</h1>
      <h3>{creator}</h3>
      <p>{desc}</p>
    </div>
  );
};

export default OpenMintInfo;
