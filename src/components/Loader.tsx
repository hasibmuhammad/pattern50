import { CircleNotch } from "@phosphor-icons/react";

const Loader = ({ pageName }: { pageName?: string }) => {
  return (
    <div className="flex items-center justify-center animate-spin">
      <CircleNotch size={pageName === "login" ? 22 : 40} />
    </div>
  );
};

export default Loader;
