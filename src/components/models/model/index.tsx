import { IModel } from "@/interfaces/IModel";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  model: IModel;
  onEdit: (model: IModel) => void;
  onDelete: (model: IModel) => void;
  isOwner: boolean;
};

const Model = ({ model, onEdit, onDelete, isOwner }: Props) => {
  const [openItemIndex, setOpenItemIndex] = useState<number>(-1);
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleItemSettings = (index: number) => {
    setIsDropdownActive(!isDropdownActive);
    setOpenItemIndex((prevIndex) => prevIndex !== index ? index : -1);
  };

  const updateDropdownPosition = () => {
    if (dropdownRef.current && openItemIndex !== -1) {
      const button = dropdownRef.current.parentElement?.getBoundingClientRect();
      if (button) {
        const rootFontSize = parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        );
        dropdownRef.current.style.top = `${
          (button.bottom - 50) / rootFontSize
        }rem`;
        dropdownRef.current.style.left = `${
          (button.right - 120) / rootFontSize
        }rem`;
      }
    }
  };

  const handleEditClick = () => {
    model && onEdit(model);
  };

  const handleDeleteClick = () => {
    model && onDelete(model);
  };

  useEffect(() => {
    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [openItemIndex, model]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenItemIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`border-2 rounded-lg mt-2 w-full bg-white relative ${
        isDropdownActive ? "" : "hover:bg-gray-200"
      }`}
    >
      <Link to={`/models/${model.id}`}>
        <div className="flex justify-between rounded-lg w-full shadow-lg p-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{model.name}</h1>
            <p className="text-sm">Type: {model.type}</p>
            <p className="text-sm">Star: {model.stars}</p>
            <p className="text-sm">Owner: {model.username}</p>
          </div>
        </div>
      </Link>
      <div className="flex justify-end pr-6 absolute bottom-12 right-0">
        {openItemIndex === model.id && (
          <div
            ref={dropdownRef}
            className="flex flex-col justify-start items-start w-28 h-auto p-2 bg-white border-2 rounded-lg"
            onMouseEnter={() => setIsDropdownActive(true)}
            onMouseLeave={() => setIsDropdownActive(false)}
          >
            {isOwner && (
              <div>
                <button
                  className="text-sm w-full hover:bg-gray-200"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className="text-sm w-full hover:bg-gray-200"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </div>
            )}
            <button className="text-sm w-full hover:bg-gray-200" // onClick={handleDownloadClick}
            >
              Download
            </button>
            <button className="text-sm w-full hover:bg-gray-200" // onClick={handleDownloadClick}
            >
              Copy
            </button>
          </div>
        )}
        <button
          className="flex justify-center items-center"
          onClick={(e) => {
            e.preventDefault();
            toggleItemSettings(model.id);
          }}
        >
          <EllipsisVerticalIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
export default Model;
