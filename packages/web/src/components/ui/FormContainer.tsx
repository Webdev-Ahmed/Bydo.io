import { type ReactNode } from "react";

interface FormContainerProps {
  title: string;
  children: ReactNode;
}

const FormContainer = ({ title, children }: FormContainerProps) => {
  return (
    <div className="min-h-screen px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-neutral-50/5 border border-neutral-50/5 rounded-2xl shadow-md p-4">
        <h1 className="text-3xl tracking-wide font-semibold text-center">
          {title}
        </h1>
        <div className="w-full h-0.5 bg-neutral-50/5 rounded-full my-6"></div>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
