import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Logo = ({ className }: { className?: string }) => {
  const classes = cn(
    "size-9 font-black pointer-events-none flex items-center justify-center bg-primary text-background text-xl rounded-xl",
    className ? className : "",
  );

  return (
    <Link to="/">
      <div className={classes}>T</div>
    </Link>
  );
};

export default Logo;
