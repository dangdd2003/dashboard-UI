import UserDashboardAI from "@/apis/UserDashboardAI";
import ConfirmAlertBox from "@/components/notification/confirm";
import useAuth from "@/hooks/useAuth";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import { ModelTypes } from "@/screens/test/ModelTypes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

type Props = {
  setIsNewModelWindowVisible: (isVisible: boolean) => void;
};

const ModelSubmissionBox = (props: Props) => {
  const { auth } = useAuth();
  const { setIsNewModelWindowVisible } = props;
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileTitle] = useState<string>("");
  const [fileDescription, setFileDescription] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSubRes, fileSubErr, fileSubLoading, fileSubAF] =
    useAxiosFunction();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(event.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    console.log(fileName);
    console.log(fileDescription);
    console.log(file);
    fileSubAF({
      axiosInstance: UserDashboardAI,
      method: "post",
      url: "models/create",
      requestConfig: {
        headers: {
          // 'Authorization': `Bearer ${auth?.token}`,
          "Content-Type": "multipart/form-data",
          // 'Access-Control-Allow-Origin': '*',
        },
        params: {
          user_id: auth?.userId,
          name: fileName,
          description: fileDescription,
          type: fileType,
        },
        data: {
          model: file,
        },
      },
    });
  };

  return (
    <div>
      {fileSubRes?.status == 201 && (
        <ConfirmAlertBox title="Model Submitted" description="Your model has been submitted successfully" onClose={() => setIsNewModelWindowVisible(false)} />
      )}
      {fileSubErr && (
        <ConfirmAlertBox title="Resource Submission Failed" description={`Your resource submission has failed: ${fileSubErr}`} onClose={() => setIsNewModelWindowVisible(false)} />
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
              className="w-6 h-6 float-right m-2 cursor-pointer"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to close the window?")
                ) {
                  setIsNewModelWindowVisible(false);
                }
              }}
            />
            <h1 className="text-2xl font-bold text-center p-2">Upload Model</h1>
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
                  .py (MAX. 10GB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                id="dropzone-file"
                type="file"
                className="hidden"
                name="images"
                onChange={onSelectFile}
                accept=".py"
              />
              {file
                ? (
                  <span className="text-gray-500">
                    1 file selected
                  </span>
                )
                : <span>No file chosen</span>}
            </label>

            {file && (
              <div className="flex flex-col shadow-md mb-3">
                <div className="flex flex-col items-center gap-6 w-full mt-2">
                  <div className="relative w-full min-w-[200px] h-10">
                    <input
                      id="model-title"
                      onChange={(e) => setFileTitle(e.target.value)}
                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                      placeholder=" "
                    />
                    <label
                      htmlFor="model-title"
                      className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900"
                    >
                      Model Title
                    </label>
                  </div>
                  <div className="relative w-full min-w-[200px] h-11">
                    <input
                      id="model-description"
                      onChange={(e) => setFileDescription(e.target.value)}
                      className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer text-blue-gray-700 outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 border-t-transparent focus:border-t-transparent border-blue-gray-200 focus:border-gray-900"
                      placeholder=" "
                    />
                    <label
                      htmlFor="model-description"
                      className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900"
                    >
                      Model Description
                    </label>
                  </div>
                  <div className="relative w-full min-w-[200px] h-11">
                    <input
                      id="model-type"
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer text-blue-gray-700 outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 border-t-transparent focus:border-t-transparent border-blue-gray-200 focus:border-gray-900"
                      placeholder=" "
                    />
                    <label
                      htmlFor="model-type"
                      className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900"
                    >
                      Model Type
                    </label>
                  </div>
                </div>
                {/* <div className="flex items-center justify-start ml-3 my-4"> */}
                {/*   <h1 className="text-gray-500 mr-4 text-sm">Model Type</h1> */}
                {/*   <select */}
                {/*     className="p-2 border-2 rounded-lg " */}
                {/*     value={fileType} */}
                {/*     onChange={(event) => { */}
                {/*       setFileType(event.target.value); */}
                {/*     }} */}
                {/*   > */}
                {/*     <option value="">none</option> */}
                {/*     {ModelTypes.map((item, index) => ( */}
                {/*       <option key={index} value={item}> */}
                {/*         {item} */}
                {/*       </option> */}
                {/*     ))} */}
                {/*   </select> */}
                {/* </div> */}
                <div className="flex justify-center items-center w-full gap-3 ">
                  <button
                    onClick={handleSubmit}
                    className="my-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={!fileName || !fileDescription || !file}
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
          <div className="w-auto mx-20 h-1/2 overflow-x-auto pt-2 ">
            {file && (
              <div className="flex justify-between items-center border-b-2">
                <div>{file.name}</div>
                <button onClick={() => handleRemoveFile()}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSubmissionBox;
