import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const button = cva("px-4 py-2 font-semibold rounded-md text-nowrap", {
  variants: {
    intent: {
      primary: "bg-blue-600 text-white",
      secondary: "bg-white border text-black",
      link: "text-blue-500 hover:underline",
    },
    size: {
      small: "text-sm",
      medium: "text-md",
      large: "text-lg",
    },
    state: {
      active: "bg-blue-500 text-white",
      inactive: "bg-white text-black",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

const Button = ({ className, intent, size, state, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(button({ intent, size, state }), className)}
      {...props}
    />
  );
};

export default Button;
