import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import ConfirmAlertBox from "@/components/notification/confirm";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import { IModel } from "@/interfaces/IModel";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router";
import { IDataset } from "@/interfaces/IDataset";
import useTestId from "@/hooks/useTestId";

const Test = () => {
  const { auth } = useAuth();
  const { ids, setIds } = useTestId();
  const modelId = ids?.modelId;

  const isAboveMedium = useMediaQuery({ minWidth: 768 });
  const isBelowSm = useMediaQuery({ maxWidth: 500 });
  const [alert, setAlert] = useState<number>(0);
  const [selectedModelType, setSelectedModelType] = useState<string>("");

  const [selectedModelId, setSelectedModelId] = useState<number | string>();

  const [pcaDimensionTrain, setPcaDimensionTrain] = useState<number>(0);
  const [pcaDimensionInference, setPcaDimensionInference] = useState<number>(0);

  const [trainResponse, trainError, trainLoading, trainAF] = useAxiosFunction();
  const [inferenceResponse, inferenceError, inferenceLoading, inferenceAF] =
    useAxiosFunction();

  const [modelsResponse] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/models/models-by-user",
    requestConfig: {
      params: {
        user_id: auth?.userId,
      },
    },
  });

  const [
    resourcesResponse,
  ] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    // defaults to the caller's own resources
    url: "/resources/user_id",
  });

  const [modelResponse, , , modelAF] = useAxiosFunction();

  useEffect(() => {
    if (modelId) {
      modelAF({
        axiosInstance: UserDashboardAI,
        method: "get",
        url: "/models/" + modelId,
      });
      setSelectedModelId(modelId);
    }
  }, [modelId]);

  const [models, setModels] = useState<IModel[]>([]);
  // model types actually present (the backend accepts any [A-Za-z0-9_-]{1,64})
  const modelTypes = Array.isArray(models)
    ? [...new Set(models.map((m) => m.type).filter(Boolean))]
    : [];
  const [, setResources] = useState<IDataset[]>(
    resourcesResponse?.data || [],
  );

  useEffect(() => {
    if (Array.isArray(modelsResponse?.data)) {
      setModels(modelsResponse.data);
    }
  }, [modelsResponse]);

  useEffect(() => {
    if (resourcesResponse) {
      setResources(resourcesResponse.data);
    }
  }, [resourcesResponse]);

  const formatFilePath = (filepath: unknown) => {
    if (typeof filepath !== "string") return "";
    const parts = filepath.split('/');
    return parts[parts.length - 1];
  }
  const handleTrain = () => {
    if (!selectedModelId) {
      setAlert(1); // missing model
      return;
    }
    if (!(pcaDimensionTrain > 0)) {
      setAlert(2); // missing pca dimension
      return;
    }
    // POST since 2.0; the caller is taken from the JWT. The backend waits up to 300 s for the ML service.
    trainAF({
      axiosInstance: UserDashboardAI,
      method: "post",
      url: "/inferences/model-train-eval-MPAP",
      requestConfig: {
        params: {
          model_id: selectedModelId,
          pca_dim: pcaDimensionTrain,
        },
      },
      timeoutMs: 330000,
    });

  }

  const handleInfer = () => {
    if (!selectedModelId) {
      setAlert(1);
      return;
    }
    if (!file) {
      setAlert(3);
      return;
    }
    // test_sample: UTF-8 text file (max 1 MiB) of numbers separated by commas and/or whitespace
    const form = new FormData();
    form.append("test_sample", file);
    inferenceAF({
      axiosInstance: UserDashboardAI,
      method: "post",
      url: "/inferences/model-inference-MPAP",
      requestConfig: {
        params: {
          model_id: selectedModelId,
          // optional: left out of the ML call when missing
          ...(pcaDimensionInference > 0 ? { pca_dim: pcaDimensionInference } : {}),
        },
        data: form,
      },
      timeoutMs: 330000,
    });
  }

  const handleResetModel = () => {
    setSelectedModelId(0);
    setIds({ ...ids, modelId: 0 });
  }

  const [file, setFile] = useState<File>();
  const [fileDimensions, setFileDimensions] = useState<number | null>(null);

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = function(e) {
        if (typeof e.target?.result === 'string') {
          // same separators as the backend parser: commas and/or whitespace
          const values = e.target.result.split(/[,\s]+/).filter((v) => v !== "");
          setFileDimensions(values.length);
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
      condition: pcaDimensionTrain > 0,
    },
    {
      size: "w-12 h-12",
      text: "Infer",
      textStyle: "text-xl",
      number: "3",
      condition: file && pcaDimensionInference,
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
      condition: pcaDimensionInference > 0,
    },
  ];

  return (
    <Container>

      {alert == 1 && (
        <ConfirmAlertBox
          title="Error"
          description="Please enter model"
          onClose={() => setAlert(0)}
        />
      )}
      {alert == 3 && (
        <ConfirmAlertBox
          title="Error"
          description="Please choose an inference file"
          onClose={() => setAlert(0)}
        />
      )}
      {alert == 2 && (
        <ConfirmAlertBox
          title="Error"
          description="Please select a PCA dimension"
          onClose={() => setAlert(0)}
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
                    <h1 className="text-lg">1. Filter model type</h1>{" "}
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
                          {modelTypes.map((item, index) => (
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
                        <Link to="/tests" onClick={handleResetModel}>
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
                <div className="ml-6 mb-4">
                  <div>
                    <h1 className="text-lg ">1. PCA Dimension</h1>
                    <div className="ml-6 flex gap-5">
                      <div>
                        <input
                          id="train-pca-dimension"
                          className="border-2 rounded-lg p-2 w-36"
                          type="number"
                          onChange={(event) => setPcaDimensionTrain(parseInt(event.target.value))}
                        />
                      </div>
                      <button
                        className="border-2 rounded-lg p-2 hover:bg-gray-900 hover:text-white"
                        onClick={() => setPcaDimensionTrain(0)}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center mt-4">
                    <button
                      className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                      type="button"
                      onClick={handleTrain}
                      disabled={trainLoading}
                    >
                      {trainLoading ? "Training..." : "Train"}
                    </button>
                  </div>
                  {!trainError && trainResponse?.data?.message && (
                    <div className="flex flex-col justify-center items-start w-full px-5 mt-4 text-lg">
                      <div>
                        <span className="flex gap-1">Train status: <p className="text-green-600"> {trainResponse.data.message}</p></span>
                        <span className="flex flex-col">Output file:<p className="text-green-600">{formatFilePath(trainResponse.data.result)}</p></span>
                      </div>
                    </div>
                  )}
                  {trainError && (
                    <div className="flex flex-col justify-center items-start w-full px-5 mt-4 text-lg">
                      <div>
                        <span className=" gap-1">Train status: <p className="text-red-600"> {trainError}</p></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full border flex flex-col items-center">
              <div className="mt-4 xl:px-20 w-full flex flex-col justify-center items-center">
                <h1 className="text-3xl flex justify-center mb-4">Infer</h1>
                <div className="ml-6">
                  <div className="my-4">
                    <h1 className="text-lg">1. Inference file</h1>{" "}
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
                    <h1 className="text-lg">2. PCA Dimension</h1>{" "}
                    <div className="ml-6">
                      <input
                        id="inference-pca-dimension"
                        className="border-2 rounded-lg p-2 w-36"
                        type="number"
                        onChange={(event) => setPcaDimensionInference(parseInt(event.target.value))}
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
                      disabled={inferenceLoading}
                    >
                      {inferenceLoading ? "Running..." : "Get Result"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* {isResultAvailable && ( */}
            <div className="w-full border">
              <div className="w-full flex flex-col justify-center items-center my-8 ">
                <h1 className="text-5xl mb-5">
                  Result
                </h1>
                {inferenceError && (
                  <p className="text-xl text-red-600">{inferenceError}</p>
                )}
                {!inferenceError && inferenceResponse?.data?.result && (
                  <div className="text-xl">
                    <span className="flex gap-1"><p className="text-blue-500">N:</p> <p>{inferenceResponse.data.result.N}</p></span>
                    <span className="flex gap-1"><p className="text-blue-500">P:</p> <p>{inferenceResponse.data.result.P}</p></span>
                    <span className="flex gap-1"><p className="text-blue-500">K:</p> <p>{inferenceResponse.data.result.K}</p></span>
                    <span className="flex gap-1"><p className="text-purple-500">MSE:</p> <p>{inferenceResponse.data.result.metrics?.mse}</p></span>
                    <span className="flex gap-1"><p className="text-purple-500">R2:</p> <p>{inferenceResponse.data.result.metrics?.r2}</p></span>
                  </div>
                )}
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
