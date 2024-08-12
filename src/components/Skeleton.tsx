const Skeleton = () => {
  return (
    <div className="w-full flex gap-2">
      <div className="bg-slate-100 w-[100px] h-10 animate-pulse rounded-md"></div>
      <div className="bg-slate-100 w-[100px] h-10 animate-pulse rounded-md"></div>
      <div className="bg-slate-100 w-[100px] h-10 animate-pulse rounded-md"></div>
      <div className="bg-slate-100 w-[100px] h-10 animate-pulse rounded-md"></div>
    </div>
  );
};

export default Skeleton;
