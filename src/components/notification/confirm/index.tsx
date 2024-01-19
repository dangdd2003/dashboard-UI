import React, { useState } from "react";

interface ConfirmAlertBoxProps {
  title: string;
  description: string;
  onClose: (value: boolean) => void;
}

const ConfirmAlertBox: React.FC<ConfirmAlertBoxProps> = (
  { title, description, onClose },
) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className=" top-0 left-0 w-screen h-screen absolute inset-0 flex justify-center items-center bg-black bg-opacity-15 z-50">
      <div className="border rounded-lg bg-white w-2/4 h-1/3 p-2 flex flex-col items-center justify-center">
        <h1 className="text-5xl my-2 font-bold">{title}</h1>
        <p className="text-lg">{description}</p>
        <div className="flex gap-4 my-2">
          <button
            className="border border-gray-300 p-2 rounded-md hover:bg-gray-300"
            onClick={() => {
              setIsVisible(false);
              onClose(false);
            }}
          >
            Cancel
          </button>
          <button
            className="border border-gray-500 bg-gray-500 text-white p-2 rounded-md hover:shadow-xl"
            onClick={() => {
              setIsVisible(false);
              onClose(true);
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlertBox;
