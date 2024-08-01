import { cva, type VariantProps } from "class-variance-authority";

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
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

const Button = ({ className, intent, size, ...props }: ButtonProps) => {
  return <button className={button({ intent, size, className })} {...props} />;
};

export default Button;
