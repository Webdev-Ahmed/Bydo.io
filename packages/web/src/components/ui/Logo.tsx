import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <div className="font-black pointer-events-none flex items-center justify-center size-9 bg-primary text-background text-xl rounded-xl">
        T
      </div>
    </Link>
  );
};

export default Logo;
