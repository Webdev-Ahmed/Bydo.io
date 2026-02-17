import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps extends PropsWithChildren {
  flex?: boolean;
  flexDir?: "col" | "row";
  className?: string;
  navbar?: boolean;
}

const Layout = ({
  children,
  flex = false,
  flexDir = "row",
  className = "",
}: LayoutProps) => {
  const classes = cn(
    "lg:max-w-5xl md:max-w-4xl mx-auto",
    `${flex && "flex"} ${flexDir === "col" ? "flex-col" : "flex-row"}`,
    className,
  );

  return (
    <>
      <main className={classes}>{children}</main>
    </>
  );
};

export default Layout;
