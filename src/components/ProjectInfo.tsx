interface ProjectProps {
  title?: string;
  creator?: string;
  desc?: string;
  mintPrice?: number;
  imgURL?: string;
}
interface InfoProps {
  project: ProjectProps;
}
const OpenMintInfo = ({ project }: InfoProps) => {
  const { title, creator, desc } = project;
  return (
    <div id="OM-info" className="w-full h-full rounded-lg p-12">
      <h1 className="mb-2 text-5xl">{title}</h1>
      <h3 className="mb-10 text-xl">{"by " + creator}</h3>
      <p className="">{desc}</p>
    </div>
  );
};

export default OpenMintInfo;
