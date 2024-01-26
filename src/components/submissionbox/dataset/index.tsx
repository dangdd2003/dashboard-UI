import UserDashboardAI from "@/apis/UserDashboardAI";
import ConfirmAlertBox from "@/components/notification/confirm";
import useAuth from "@/hooks/useAuth";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import { ResourceTypes } from "@/screens/test/ResourceTypes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type Props = {
  setIsNewModelWindowVisible: (isVisible: boolean) => void;
};

const DatasetSubmissionBox = (props: Props) => {
  const { auth } = useAuth();
  const { setIsNewModelWindowVisible } = props;
  const [isExit, setIsExit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("")
  const [fileSubRes, fileSubErr, fileSubLoading, fileSubAF] =
    useAxiosFunction();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }

  };

  const handleRemoveFile = () => {
    setFile(null);

  };

  const handleSubmit = () => {

    fileSubAF({
      axiosInstance: UserDashboardAI,
      method: "post",
      url: "resources/create",
      requestConfig: {
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          "Content-Type": "multipart/form-data",
          // 'Access-Control-Allow-Origin': '*',
        },
        params: {
          type: fileType,
          user_id: auth?.userId,
        },
        data: {
          resource: file,
        },
      },
    });
  };

  return (
    <div>
      {fileSubRes?.status == 201 && (
        <ConfirmAlertBox title="Resource Submitted" description="Your resource has been submitted successfully" onClose={() => setIsNewModelWindowVisible(false)} />
      )}
      {fileSubErr && (
        <ConfirmAlertBox title="Resource Submission Failed" description={`Your resource submission has failed: ${fileSubErr}`} onClose={() => setIsNewModelWindowVisible(false)} />
      )}
      {isExit && (
        <ConfirmAlertBox title="Exit" description="Are you sure you want to exit?" onClose={() => setIsNewModelWindowVisible(false)} />
      )}

      <div
        className="w-screen h-screen absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40"
        onClick={() => setIsNewModelWindowVisible(false)}
      >
        <div
          className="border rounded-lg bg-white w-5/6 h-5/6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center shadow-sm">
            <XMarkIcon
              className="w-8 h-8 float-right m-2 cursor-pointer hover:bg-gray-300 rounded-full p-"
              onClick={() => {
                setIsExit(true);
              }}
            />
            <h1 className="text-2xl font-bold text-center p-2">Upload Resource</h1>
          </div>
          <div className=" w-full">
            <label
              htmlFor="dropzone-file"
              className="mx-auto mt-3 flex flex-col items-center justify-center w-1/2 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  .csv
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                name="images"
                onChange={onSelectFile}
                multiple
                accept="*"
              />
              {!file
                ? (
                  <span className="text-gray-500">
                    No file(s) selected
                  </span>
                )
                : <span>No file chosen</span>}
            </label>

            {file && (
              <div>
                <div className="flex items-center justify-center ml-3 mt-4">
                  <h1 className="text-gray-500 mr-4 text-sm">Resource Type</h1>
                  <select
                    className="p-2 border-2 rounded-lg "
                    value={fileType}
                    onChange={(event) => {
                      setFileType(event.target.value);
                    }}
                  >
                    <option value="">none</option>
                    {ResourceTypes.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center items-center w-full gap-3 shadow-md">
                  <button
                    onClick={handleSubmit}
                    className="my-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={!fileType}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    className="my-4 px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          {file && (
            <div className="w-auto mx-20 h-1/2 overflow-x-auto pt-2 ">
              <div
                className="flex items-center w-full justify-between h-10 mb-2 px-2 gap-2 border border-gray-300 rounded-lg"
              >
                <div>{file?.name}</div>
                <button onClick={() => handleRemoveFile()}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default DatasetSubmissionBox;
