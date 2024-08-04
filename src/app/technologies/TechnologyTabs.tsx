import { cn } from "../../../utils/cn";
import { TechnologyCategoryType } from "@/types/types";

type TechnologyTabsProps = {
  techCategories: TechnologyCategoryType[];
  activeTab: string;
  handleActiveTab: (id: string) => void;
};

const TechnologyTabs = ({
  techCategories,
  activeTab,
  handleActiveTab,
}: TechnologyTabsProps) => {
  return (
    <div className="border-b-2 border-gray-200 relative">
      <ul className="flex justify-around">
        {techCategories.map((category) => (
          <li
            onClick={() => handleActiveTab(category._id)}
            className={cn(
              "flex-1 text-center text-slate-400 font-bold pb-2 cursor-pointer relative",
              {
                "after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-blue-500 text-blue-500 font-bold":
                  activeTab === category._id,
              }
            )}
            key={category._id}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechnologyTabs;
