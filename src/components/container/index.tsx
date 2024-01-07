import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import Navbar from "../navigation/navbar";
import Sidebar from "../navigation/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Container = ({ children }: LayoutProps) => {
  const isAboveMedium = useMediaQuery({ query: "(min-width: 768px)" });
  return (
    <div>
      <div className="sticky top-0 z-50">
        <div className="absolute top-0 left-0 z-50">
          <Navbar />
        </div>
        <div className="pt-2 z-20">
            <div className="absolute w-auto px-4 right-0">
              <Sidebar />
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col justify-center items-center ${
          isAboveMedium ? "ml-32" : "ml-0"
        } mt-2`}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
