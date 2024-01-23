import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import ConfirmAlertBox from "@/components/notification/confirm";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import { IModel } from "@/interfaces/IModel";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ModelTypes } from "./ModelTypes";
import { IDataset } from "@/interfaces/IDataset";
import { InferenceTypes } from "./InferenceTypes";

const Test = () => {
  const { modelId, resourceId } = useParams();
  const { auth } = useAuth();
  const isAboveMedium = useMediaQuery({ minWidth: 768 });
  const isBelowSm = useMediaQuery({ maxWidth: 500 });
  const [selectedModelType, setSelectedModelType] = useState<string>("");
  const [selectedResourceType, setSelectedResourceType] = useState<string>("DataFiles");
  const [selectedInferenceType, setSelectedInferenceType] = useState<string>("");

  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");

  const [pcaDimension, setPcaDimension] = useState<number>(0);


  const [modelMissing, setModelMissing] = useState<boolean>(false);
  const [imageMissing, setImageMissing] = useState<boolean>(false);
  const [coordinatesMissing, setCoordinatesMissing] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isResultAvailable, setIsResultAvailable] = useState<boolean>(false);
  const navigate = useNavigate();

  const [modelsResponse, modelsError, modelsLoading, modelsRefetch] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/models/models-by-user/" + auth?.userId,
    // url: "/models",
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  const [
    resourcesResponse,
    resourcesError,
    resourcesLoading,
    resourcesRefetch,
  ] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/resources/user_id/" + auth?.userId,
    // url: "/resources",
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  const [modelResponse, modelError, modelLoading, modelAF] = useAxiosFunction();
  const [resourceResponse, resourceError, resourceLoading, resourceAF] =
    useAxiosFunction();

  useEffect(() => {
    if (modelId) {
      modelAF({
        axiosInstance: UserDashboardAI,
        method: "get",
        url: "/models/" + modelId,
        requestConfig: {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        },
      });
      setSelectedModelId(modelId);
    }
  }, [modelId]);

  useEffect(() => {
    if (resourceId) {
      resourceAF({
        axiosInstance: UserDashboardAI,
        method: "get",
        url: "/resources/" + resourceId,
        requestConfig: {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        },
      });
      setSelectedResourceId(resourceId);
    }
  }, [resourceId]);

  const [models, setModels] = useState<IModel[]>(modelsResponse?.data || []);
  const [resources, setResources] = useState<IDataset[]>(
    resourcesResponse?.data || [],
  );

  useEffect(() => {
    if (modelsResponse) {
      setModels(modelsResponse.data);
    }
  }, [modelsResponse]);

  useEffect(() => {
    if (resourcesResponse) {
      setResources(resourcesResponse.data);
    }
  }, [resourcesResponse]);

  const [coordinates, setCoordinates] = useState<
    { x: number; y: number } | null
  >(null);
  const [displayCoordinates, setDisplayCoordinates] = useState<
    { x: number; y: number } | null
  >(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageResolution, setImageResolution] = useState<
    { width: number; height: number } | null
  >(null);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top;

    // Set the display coordinates
    setDisplayCoordinates({ x, y });

    // Get the natural width and height of the image
    const naturalWidth = event.currentTarget.naturalWidth;
    const naturalHeight = event.currentTarget.naturalHeight;

    // Calculate the scale factor
    const scaleFactorX = naturalWidth / boundingBox.width;
    const scaleFactorY = naturalHeight / boundingBox.height;

    // Apply the scale factor to the clicked coordinates
    const scaledX = x * scaleFactorX;
    const scaledY = y * scaleFactorY;

    setCoordinates({ x: scaledX, y: scaledY });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCoordinates(null); // Reset coordinates when a new image is selected

      // Get image resolution
      const img = new Image();
      img.onload = () => {
        setImageResolution({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = imageUrl;
    }
  };

  const handleTestHsi = () => {
    if (!selectedModelId) {
      setModelMissing(true);
    } else if (!selectedImage) {
      setImageMissing(true);
    } else if (!coordinates) {
      setCoordinatesMissing(true);
    } else {
      setIsProcessing(true);
      setIsResultAvailable(true);
      console.log("submit");
    }
  };

  const handleTrain = () => {

  }

  const handleInfer = () => {

  }

  const handleNewTest = () => {
    setSelectedModelId("");
    setSelectedResourceId("");
    setCoordinates(null);
    setSelectedImage(null);
    setImageResolution(null);
    setIsProcessing(false);
    navigate("/tests");
  };

  const [file, setFile] = useState<File>();
  const [fileDimensions, setFileDimensions] = useState<number | null>(null);
  const [fileAsArray, setFileAsArray] = useState<Array<number>>();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = function(e) {
        if (typeof e.target?.result === 'string') {
          const header = e.target.result.split('\n')[0]; // Take the first line
          const array = header.split(',').map(item => parseFloat(item.trim())); // Split the header into an array
          setFileAsArray(array);
          console.log(fileAsArray)
          setFileDimensions(array.length);
        }
      };
      reader.readAsText(file);

    }
  };

  const ProgressBar = [
    {
      size: "w-12 h-12",
      text: "Model",
      textStyle: "text-xl",
      number: "1",
      condition: selectedModelType && selectedModelId,
    },
    {
      size: "w-4 h-4 ml-4",
      text: "Choose Type",
      textStyle: "text-lg",
      condition: selectedModelType,
    },
    {
      size: "w-4 h-4 ml-4",
      text: "Load Model",
      textStyle: "text-lg",
      condition: selectedModelId,
    },
    {
      size: "w-12 h-12",
      text: "Train",
      textStyle: "text-xl",
      number: "2",
      condition: selectedResourceId,
    },
    {
      size: "w-12 h-12",
      text: "Infer",
      textStyle: "text-xl",
      number: "3",
      condition: selectedInferenceType && file,
    },
    {
      size: "w-4 h-4 ml-4",
      text: "Choose Type",
      textStyle: "text-lg",
      condition: selectedInferenceType,
    },
    {
      size: "w-4 h-4 ml-4",
      text: "Load Data",
      textStyle: "text-lg",
      condition: file,
    },
    {
      size: "w-4 h-4 ml-4",
      text: "PCA",
      textStyle: "text-lg",
      condition: pcaDimension > 0,
    },
  ];

  return (
    <Container>
      {modelMissing && (
        <ConfirmAlertBox
          title="Model Missing"
          description="Please select a model"
          onClose={() => setModelMissing(false)}
        />
      )}
      <h1 className={`flex justify-center font-bold text-5xl ${isAboveMedium ? "" : "mt-20"}`}>Tests</h1>
      <div className={`flex mt-8 gap-10 w-full h-full 2xl:px-32 xl:px-28 lg:px-28 md:px-24 sm:px-18 ${isAboveMedium ? "px-32" : "px-10"}`}>
        <div
          className={`xl:w-5/6 md:w-4/6  ${isAboveMedium ? "xl:flex" : "w-2/3"}  ${isBelowSm && "w-full"}`}
        >
          <div className="xl:flex w-full">
            <div className="w-full">
              <div className="border xl:px-5 flex flex-col items-center">
                <h1 className="text-3xl flex justify-center my-4">Model</h1>
                <div className="ml-6">
                  <div>
                    <h1 className="text-lg">1. Select model type</h1>{" "}
                    <div className="ml-6">
                      <div className="flex items-center gap-5">
                        <select
                          className="p-2 border-2 rounded-lg w-36"
                          value={selectedModelType}
                          onChange={(event) => {
                            setSelectedModelType(event.target.value);
                          }}
                        >
                          <option value="">none</option>
                          {ModelTypes.map((item, index) => (
                            <option className="w-32" key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        <button
                          className="border-2 rounded-lg p-2 hover:bg-gray-900 hover:text-white"
                          onClick={() => setSelectedModelType("")}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h1 className="text-lg mt-8">2. Select a model</h1>
                    <div className="ml-6">
                      <div className="flex">
                        <div className="flex items-center gap-5">
                          <select
                            className="p-2 border-2 rounded-lg w-36"
                            value={selectedModelId}
                            onChange={(event) => {
                              setSelectedModelId(event.target.value);
                            }}
                          // disabled={selectedModelType === ""}
                          >
                            <option value="">none</option>
                            {Array.isArray(models) && !modelId &&
                              models
                                .filter((item) =>
                                  selectedModelType
                                    ? item.type === selectedModelType
                                    : true
                                )
                                .map((item, index) => (
                                  <option key={index} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                            {modelId && modelResponse && (
                              <option value={modelResponse.data.id}>
                                {modelResponse.data.name} - Community model
                              </option>
                            )}
                          </select>
                        </div>
                        <Link to="/tests" onClick={() => setSelectedModelId("")}>
                          <button className="ml-6 border-2 rounded-lg p-2 hover:bg-gray-900 hover:text-white">
                            Reset
                          </button>
                        </Link>
                      </div>
                      <span>
                        <p>
                          Or{" "}
                          <Link
                            to="/explorer"
                            className="text-blue-600 underline hover:text-blue-400 "
                          >
                            browse
                          </Link>{" "}
                          for community model
                        </p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xl:px-5 border flex flex-col items-center">
                <h1 className="text-3xl flex justify-center my-4">Train</h1>
                <div className="ml-6">
                  <div className="mb-4">
                    <h1 className="text-lg ">Select a resource</h1>
                    <div className="ml-6">
                      <div className="flex">
                        <div className="flex items-center gap-5">
                          <select
                            className="p-2 border-2 rounded-lg w-36"
                            value={selectedResourceId}
                            onChange={(event) => {
                              setSelectedResourceId(event.target.value);
                            }}
                          >
                            <option value="">none</option>
                            {Array.isArray(resources) && !resourceId &&
                              resources
                                .filter((item) =>
                                  selectedResourceType
                                    ? item.type === selectedResourceType
                                    : true
                                )
                                .map((item, index) => (
                                  <option key={index} value={item.id}>
                                    {item.id}
                                  </option>
                                ))}
                            {resourceId && resourceResponse && (
                              <option value={resourceResponse.data.id}>
                                {resourceResponse.data.id} - {""}
                                {resourceResponse.data.type} {""}
                                - Community resource
                              </option>
                            )}
                          </select>
                        </div>
                        <Link to="/tests" onClick={() => setSelectedResourceId("")}>
                          <button className="ml-6 border-2 rounded-lg p-2 hover:bg-gray-900 hover:text-white">
                            Reset
                          </button>
                        </Link>
                      </div>
                      <span>
                        <p>
                          Or{" "}
                          <Link
                            to="/explorer"
                            className="text-blue-600 underline hover:text-blue-400 "
                          >
                            browse
                          </Link>{" "}
                          for community resource
                        </p>
                      </span>
                    </div>
                    <div className="w-full flex items-center justify-center mt-4">
                      <button
                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button"
                        onClick={handleTrain}
                      >
                        Train
                      </button>
                    </div>
                    <div className="flex flex-col justify-center items-start w-full px-5 mt-4 text-lg">
                      <div>
                        Train status: <span className="text-green-600">Done</span>
                      </div>
                      {/* <div> */}
                      {/*   Model R2: <span className="text-green-600">0.9</span> */}
                      {/* </div> */}
                      {/* <div> */}
                      {/*   Model MSE: <span className="text-green-600">0.1</span> */}
                      {/* </div> */}
                      <div>
                        Model Dimension: <span className="text-green-600">2151</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex flex-col justify-center items-center w-full px-5">
                      <button
                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button"
                        onClick={handleNewTest}
                      >
                        RESET
                      </button>
                </div> */}
                </div>
              </div>
            </div>
            <div className="w-full border flex flex-col items-center">
              <div className="mt-4 xl:px-20 w-full">
                <h1 className="text-3xl flex justify-center mb-4">Infer</h1>
                <div className="ml-6">
                  <div>
                    <h1 className="text-lg">1. Select file type</h1>{" "}
                    <div className="ml-6">
                      <div className="flex items-center gap-5">
                        <select
                          className="p-2 border-2 rounded-lg w-36"
                          value={selectedInferenceType}
                          onChange={(event) => {
                            setSelectedInferenceType(event.target.value);
                          }}
                        >
                          <option value="">none</option>
                          {InferenceTypes.map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        <button
                          className="border-2 rounded-lg p-2 hover:bg-gray-900 hover:text-white"
                          onClick={() => setSelectedInferenceType("")}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <h1 className="text-lg">2. Inference file</h1>{" "}
                    <div className="ml-6">
                      <input
                        id="inference-file"
                        className="border-2 rounded-lg p-2 hover:bg-gray-900 hover:text-white w-36"
                        type="file"
                        onChange={onSelectFile}
                      />
                      <h1 className="text-md text-red-500">Input file potocol: The input sample must have the same feature</h1>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg">3. PCA Dimension</h1>{" "}
                    <div className="ml-6">
                      <input
                        id="inference-pca-dimension"
                        className="border-2 rounded-lg p-2 w-36"
                        type="number"
                        onChange={(event) => setPcaDimension(parseInt(event.target.value))}
                      />
                      <h1 className="text-md text-red-500">PCA dimension less than  number feature </h1>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-start w-full px-5 mt-4 text-lg">
                    <div>
                      Sample Dimension: <span className="text-green-600">{fileDimensions}</span>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-center my-4">
                    <button
                      className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                      type="button"
                      onClick={handleInfer}
                    >
                      Get Result
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* {isResultAvailable && ( */}
            <div className="w-full border">
              <div className="w-full flex flex-col justify-center items-center my-8 ">
                <h1 className="text-5xl mb-5 text-fuchsia-700">
                  Result
                </h1>
                <div>
                  <h1 className="text-3xl text-blue-700">N = 2800.00 (mg/kg)</h1>
                  <h1 className="text-3xl text-red-700">P = 4820.00 (mg/kg)</h1>
                  <h1 className="text-3xl text-yellow-700">K = 35530.00 (mg/kg)</h1>
                  <h1 className="text-xl text-cyan-950">MSE = 33018975</h1>
                  <h1 className="text-xl text-cyan-950">R2 = -6.72</h1>
                </div>
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
        <div
          className={`xl:w-1/6 md:w-2/6 max-sm:w-1/3 border-2 p-4 ${isAboveMedium ? "" : "w-1/3"
            }  ${isBelowSm && "hidden"}`}
        >
          <div className="flex">
            <div className="flex flex-col gap-5 h-full">
              {/* Content for the right half goes here */}
              {ProgressBar.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`p-2 mr-5 rounded-full border-2 font-bold text-2xl flex justify-center items-center ${item.size} ${item.condition && "bg-green-500"
                      }`}
                  >
                    {item.number}
                  </div>
                  <h1 className={`${item.textStyle}`}>{item.text}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container >
  );
};

export default Test;
