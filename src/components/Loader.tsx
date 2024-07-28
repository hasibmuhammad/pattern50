import { CircleNotch } from "@phosphor-icons/react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center animate-spin">
      <CircleNotch size={40} />
    </div>
  );
};

export default Loader;
