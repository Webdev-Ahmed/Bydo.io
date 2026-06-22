interface DividerProps {
  text?: string;
  orientation?: "horizontal" | "vertical";
}

const Divider = ({ text, orientation = "horizontal" }: DividerProps) => {
  if (orientation === "vertical") {
    return (
      <div className="h-full w-0.5 mx-2 bg-text opacity-10 rounded-full inline-block">
        <p className="opacity-0 pointer-events-none">.</p>
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-0.5 bg-text/5 rounded-full" />
        <span className="text-text/50 text-sm font-medium tracking-wide">
          {text}
        </span>
        <div className="flex-1 h-0.5 bg-text/50 rounded-full" />
      </div>
    );
  }

  return <div className="w-full h-0.5 bg-text/5 rounded-full my-6" />;
};

export default Divider;
