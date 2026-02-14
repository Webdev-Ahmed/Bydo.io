interface DividerProps {
  text?: string;
  orientation?: "horizontal" | "vertical";
}

const Divider = ({ text, orientation = "horizontal" }: DividerProps) => {
  if (orientation === "vertical") {
    return <div className="w-0.5 h-full bg-neutral-50/5 rounded-full" />;
  }

  if (text) {
    return (
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-0.5 bg-neutral-50/5 rounded-full" />
        <span className="text-neutral-50/50 text-sm font-medium tracking-wide">
          {text}
        </span>
        <div className="flex-1 h-0.5 bg-neutral-50/5 rounded-full" />
      </div>
    );
  }

  return <div className="w-full h-0.5 bg-neutral-50/5 rounded-full my-6" />;
};

export default Divider;
