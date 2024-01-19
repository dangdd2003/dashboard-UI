import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ModelData } from "../ModelData";

import { IModel } from "@/interfaces/IModel";
import { useMediaQuery } from "react-responsive";
import { useEffect, useRef, useState } from "react";
import useAxios from "@/hooks/useAxios";
import UserDashboardAI from "@/apis/UserDashboardAI";
import useAuth from "@/hooks/useAuth";
import Model from "@/components/models/model";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import ConfirmAlertBox from "@/components/notification/confirm";

type Props = {
  userID: number;
};

const Models = ({ userID }: Props) => {
  const { auth } = useAuth();
  const isAboveMedium = useMediaQuery({ minWidth: 768 });
  const isOwner = auth?.userId == userID.toString();
  const [deleteModelNotification, setDeleteModelNotification] = useState(false);
  const [sortOrder, setSortOrder] = useState(0); // 1 for ascending, -1 for descending
  const [modelsResponse, modelsError, modelsLoading, modelsRefetch] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/models/models-by-user/" + userID,
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });
  const [
    modelDeleteResponse,
    modelDeleteError,
    modelDeleteLoading,
    modelDeleteAF,
  ] = useAxiosFunction();

  const [
    modelEditResponse,
    modelEditError,
    modelEditLoading,
    modelEditAF,
  ] = useAxiosFunction();

  const [models, setModels] = useState<IModel[]>(modelsResponse?.data);
  const [originalModels, setOriginalModels] = useState<IModel[]>(
    modelsResponse?.data,
  );
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isTypeFilterDropdownOpen, setIsTypeFilterDropdownOpen] = useState(
    false,
  );
  const dropdownRef = useRef(null);

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
      const filteredModels = originalModels.filter((model) =>
        model.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setModels(filteredModels);
    }
  }, [searchInput, originalModels]);

  useEffect(() => {
    if (typeFilter === "") {
      setModels(originalModels);
    } else {
      const filteredModels = originalModels.filter((model) =>
        model.type === typeFilter
      );
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

  // Effect to close the dropdown when the type filter changes
  useEffect(() => {
    setIsTypeFilterDropdownOpen(false);
  }, [typeFilter, searchInput]);

  //Effect to show the notification when a model is deleted
  useEffect(() => {
    if (modelDeleteResponse?.data) {
      setDeleteModelNotification(true);
    }
  }, [modelDeleteResponse]);

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

  const handleEdit = (model: IModel) => {
    console.log(model);
    modelEditAF({
      axiosInstance: UserDashboardAI,
      method: "put",
      url: "/models/update/" + model.id,
      requestConfig: {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        data: {
          name: model.name,
          description: model.description,
        }
      }
    })
  };

  const handleDelete = (model: IModel) => {
    console.log(model);
    modelDeleteAF({
      axiosInstance: UserDashboardAI,
      method: "delete",
      url: "/models/delete/" + model.id,
      requestConfig: {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      },
    });
    setModels(models.filter((m) => m.id !== model.id));
  };

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

  // Use originalModels to reset
  const resetInput = () => {
    const searchInput = document.getElementById("search") as HTMLInputElement;
    searchInput.value = "";
    setModels(originalModels);
  };

  return (
    <>
      {deleteModelNotification && (
        <ConfirmAlertBox
          title="Model Deleted"
          description="Model has been deleted"
          onClose={() => setDeleteModelNotification(!deleteModelNotification)}
        />
      )}

      <div className="flex flex-col items-center justify-center w-full">
        {/* FILTERS */}
        <div
          className={`flex flex-col items-center justify-center gap-5 mt-2 sticky top-0 z-20 shadow-lg bg-white w-screen p-2 `}
        >
          <div className="p-2 mx-auto my-auto border-2 rounded-full w-1/2">
            <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </div>
              <input
                className="peer h-full w-full outline-none text-lg text-gray-700 pr-2"
                type="text"
                id="search"
                placeholder="Search something.."
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <button
              className={`flex w-24 h-auto p-3 border-2 rounded-lg gap-4 hover:bg-gray-100 bg-white ${
                sortOrder ? "bg-gray-200" : "hover:bg-gray-100"
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
                  setIsTypeFilterDropdownOpen(!isTypeFilterDropdownOpen)}
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                <p>Type</p>
                <ChevronDownIcon className="w-4 h-4 mt-1" />
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
                      onClick={() =>
                        handleDropdownItemClick("Linear Regression")}
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
                      onClick={() =>
                        handleDropdownItemClick("Ridge Regression")}
                    >
                      Ridge Regression
                    </p>
                    <p
                      className="cursor-pointer hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm"
                      role="menuitem"
                      tabIndex={-1}
                      id="menu-item-3"
                      onClick={() =>
                        handleDropdownItemClick("Lasso Regression")}
                    >
                      Lasso Regression
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* MODELS */}
        <div className="flex flex-col justify-center items-center w-5/6 mt-6">
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
                <div
                  key={model.id}
                  className={`mx-20 mb-4 ${isAboveMedium ? "w-3/4" : "w-full"}`}
                >
                  {/* <Link to={`/models/${model.id}`}> */}
                  <Model
                    model={model}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    isOwner={isOwner}
                  />
                </div>
              ))
            )}
        </div>
      </div>
    </>
  );
};

export default Models;
