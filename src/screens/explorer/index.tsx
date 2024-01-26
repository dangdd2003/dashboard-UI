import Container from "@/components/container";

import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { IModel } from "@/interfaces/IModel";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import ModelCardLarge from "@/components/models/model-card-large";
import ModelCardSmall from "@/components/models/model-card-small";
import useAuth from "@/hooks/useAuth";
import UserDashboardAI from "@/apis/UserDashboardAI";
import useAxios from "@/hooks/useAxios";

const Explorer = () => {
  const { auth } = useAuth();
  const [sortOrder, setSortOrder] = useState(0); // 1 for ascending, -1 for descending\
  const [typeFilter, setTypeFilter] = useState("");
  const [isTypeFilterDropdownOpen, setIsTypeFilterDropdownOpen] = useState(
    false,
  );
  const isAboveMedium = useMediaQuery({ minWidth: 768 });
  const dropdownRef = useRef(null);

  const [modelsResponse, modelsError, modelsLoading, modelsRefetch] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/models",
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  const [models, setModels] = useState<IModel[]>(modelsResponse?.data);
  const [originalModels, setOriginalModels] = useState<IModel[]>(
    modelsResponse?.data,
  );
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (modelsResponse?.data) {
      setModels(modelsResponse.data);
      setOriginalModels(modelsResponse.data);
    }
  }, [modelsResponse]);

    // Effect to filter models based on search input
  useEffect(() => {
    if (searchInput === "") {
      setModels(originalModels);
    } else {
      const normalizedSearchInput = searchInput.replace(/\s/g, '').toLowerCase().trim();

      const filteredModels = originalModels.filter((model) => {
        const normalizedModelName = model.name.replace(/\s/g, '').toLowerCase().trim();
        return normalizedModelName.includes(normalizedSearchInput);
      });

      setModels(filteredModels);
    }
  }, [searchInput, originalModels]);

  // Effect to filter models based on type filter
  useEffect(() => {
    if (typeFilter === "") {
      setModels(originalModels);
    } else {
      const normalizedTypeFilter = typeFilter.replace(/\s/g, '').toLowerCase().trim();

      const filteredModels = originalModels.filter((model) => {
        const normalizedModelType = model.type.replace(/\s/g, '').toLowerCase().trim();
        return normalizedModelType.includes(normalizedTypeFilter);
      });

      setModels(filteredModels);
    }
  }, [typeFilter, originalModels]);

  // Effect to add/remove the event listener
  useEffect(() => {
    if (isTypeFilterDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTypeFilterDropdownOpen]);

  const handleStarsSort = () => {
    setSortOrder((prev) => {
      const newOrder = prev === 1 ? -1 : prev === -1 ? 0 : 1;
      setModels(
        newOrder !== 0
          ? [...models].sort((a, b) => newOrder * (a.stars - b.stars))
          : originalModels,
      );
      return newOrder;
    });
  };

  // Event handler for the dropdown item click
  const handleDropdownItemClick = (type: string) => {
    setTypeFilter(type);
    setIsTypeFilterDropdownOpen(false); // Close the dropdown
  };

  // Event handler for clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsTypeFilterDropdownOpen(false);
    }
  };

  // Use originalModels to reset
  const resetInput = () => {
    const searchInput = document.getElementById("search") as HTMLInputElement;
    searchInput.value = "";
    setModels(originalModels);
  };

  return (
    <Container>
      <h1 className={`flex justify-center font-bold text-5xl `}>Explorer</h1>
      <div
        className={`flex flex-col items-center justify-center gap-5 mt-2 sticky top-0 z-20 shadow-lg bg-white opacity-95 w-screen p-2 `}
      >
        <div className="p-2 mx-auto my-auto border-2 rounded-full w-1/2">
          <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </div>
            <input
              className={`peer h-full w-full outline-none text-lg text-gray-700 pr-2  ${isAboveMedium ? "text-lg" : "text-sm "}`}
              type="text"
              id="search"
              placeholder="Search something.."
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <button
            className={`flex w-24 h-auto p-3 border-2 rounded-lg gap-4 hover:bg-gray-100 bg-white ${sortOrder ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            onClick={handleStarsSort}
          >
            <p>Stars</p>
            {sortOrder === 1
              ? <ChevronUpIcon className="w-4 h-4 mt-1" />
              : sortOrder === -1
                ? <ChevronDownIcon className="w-4 h-4 mt-1" />
                : <ChevronUpDownIcon className="w-4 h-4 mt-1" />}
          </button>
          <div className="relative">
            <button
              className="flex w-auto h-auto p-3 border-2 rounded-lg gap-2 hover:bg-gray-100 bg-white"
              onClick={() =>
                typeFilter === "" && setIsTypeFilterDropdownOpen(!isTypeFilterDropdownOpen)
              }
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              
              {typeFilter !== ""
                  ? <div className="flex gap-2" onClick={() => setTypeFilter("")}><p>{typeFilter}</p>
                  <XMarkIcon className="w-4 h-4 mt-1" />
                </div>
                : <div className="flex gap-2">
                  <p>Type</p>
                  <ChevronDownIcon className="w-4 h-4 mt-1" />
                </div>}
            </button>
            {isTypeFilterDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right--0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                <div className="py-1" role="none">
                  <p
                    className="cursor-pointer hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm"
                    role="menuitem"
                    tabIndex={-1}
                    id="menu-item-0"
                    onClick={() => handleDropdownItemClick("Linear Regression")}
                  >
                    Linear Regression
                  </p>
                  <p
                    className="cursor-pointer hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm"
                    role="menuitem"
                    tabIndex={-1}
                    id="menu-item-1"
                    onClick={() =>
                      handleDropdownItemClick("Bayesian Ridge Regression")}
                  >
                    Bayesian Ridge Regression
                  </p>
                  <p
                    className="cursor-pointer hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm"
                    role="menuitem"
                    tabIndex={-1}
                    id="menu-item-2"
                    onClick={() => handleDropdownItemClick("Ridge Regression")}
                  >
                    Ridge Regression
                  </p>
                  <p
                    className="cursor-pointer hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm"
                    role="menuitem"
                    tabIndex={-1}
                    id="menu-item-3"
                    onClick={() => handleDropdownItemClick("Lasso Regression")}
                  >
                    Lasso Regression
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 w-full xl:pl-28 lg:pl-28 md:pl-20">
        <div className="flex flex-wrap justify-center items-center">
          {models.length === 0
            ? (
              <div className="flex flex-col justify-center items-center w-full ">
                <h1 className="text-2xl">No result found</h1>
                <p>To see more results, try other inputs</p>
                <button
                  className=" w-32 h-16 p-3 text-xl border-2 rounded-full gap-2 hover:bg-gray-100 bg-white mt-2"
                  onClick={resetInput}
                >
                  Reset
                </button>
              </div>
            )
            : (
              Array.isArray(models) &&
              models.map((model: IModel) => (
                <Link
                  key={model.id}
                  className={!isAboveMedium || sortOrder !== 0
                    ? "w-3/4"
                    : "w-1/3 lg:w-1/4"}
                  to={`/models/${model.id}`}
                >
                  {(!isAboveMedium || sortOrder !== 0)
                    ? (
                      <div>
                        <ModelCardSmall model={model} />
                      </div>
                    )
                    : (
                      <div>
                        <ModelCardLarge model={model} />
                      </div>
                    )}
                </Link>
              ))
            )}
        </div>
      </div>
    </Container>
  );
};

export default Explorer;
