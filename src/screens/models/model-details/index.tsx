import UserDashboardAI from "@/apis/UserDashboardAI";
import { getErrorMessage, getErrorStatus } from "@/apis/errors";
import Container from "@/components/container";
import NewRatingBox from "@/components/editbox/rating";
import Inference from "@/components/models/inference";
import ConfirmAlertBox from "@/components/notification/confirm";
import RatingsSection from "@/components/ratings";
import useAxios from "@/hooks/useAxios";
import useTestId from "@/hooks/useTestId";
import { IModel } from "@/interfaces/IModel.tsx";
import { StarIcon } from "@heroicons/react/16/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";

const ModelDetail = () => {
  const { modelId } = useParams();
  if (!modelId) {
    return <div className="text-red-500">MODELID not found</div>;
  }
  return <ModelDetailContent modelId={modelId} />;
};

const ModelDetailContent = ({ modelId }: { modelId: string }) => {
  const { ids, setIds } = useTestId();

  const [modelResponse, modelError, , refetchModel] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/models/" + modelId,
  });

  useEffect(() => {
    if (modelResponse?.status === 200) {
      setModel(modelResponse.data);
    }
  }, [modelResponse]);

  //   useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       // Get the "Test" link element
  //       const testLink = document.querySelector('.test-link');

  //       // Check if the clicked element is the "Test" link
  //       if (event.target !== testLink) {
  //         setIsOpen(false);
  //       }
  //     }
  //   }

  //   // Use the 'mouseup' event instead of the 'mousedown' event
  //   document.addEventListener("mouseup", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mouseup", handleClickOutside);
  //   };
  // }, []);

  const [model, setModel] = useState<IModel>(modelResponse?.data);
  const [userRatingStars, setUserRatingStars] = useState<number | null>(null);
  const [userComment, setUserComment] = useState<string | null>(null);
  const [isRatingBoxVisible, setIsRatingBoxVisible] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const [ratingNotice, setRatingNotice] = useState<{ title: string; text: string } | null>(null);
  const [ratingsVersion, setRatingsVersion] = useState(0);

  const handleNewRatingSubmit = async () => {
    setIsRatingBoxVisible(false);
    if (!userRatingStars) {
      setRatingNotice({ title: "Error", text: "Please choose 1 to 5 stars" });
      return;
    }
    // The rating belongs to the caller (from the JWT); one rating per user per model.
    const body = { stars: userRatingStars, comment: userComment ?? undefined };
    const params = { model_id: model.id };
    try {
      await UserDashboardAI.post("/ratings/create", body, { params });
      setRatingNotice({ title: "Success", text: "Your rating has been submitted successfully" });
    } catch (err) {
      if (getErrorStatus(err) !== 409) {
        setRatingNotice({ title: "Error", text: getErrorMessage(err) });
        return;
      }
      // 409: already rated by the caller -> update the existing rating instead
      try {
        await UserDashboardAI.put("/ratings/update", body, { params });
        setRatingNotice({ title: "Success", text: "Your rating has been updated" });
      } catch (updateErr) {
        setRatingNotice({ title: "Error", text: getErrorMessage(updateErr) });
        return;
      }
    }
    setRatingsVersion((v) => v + 1);
    refetchModel();
  };

  const formattedCreateTime = model.createTime
    ? new Date(model.createTime).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  const handleStarClick = (stars: number) => {
    setUserRatingStars(stars);
    setIsRatingBoxVisible(true);
  };
  return (
    <Container>
      {ratingNotice && (
        <ConfirmAlertBox
          title={ratingNotice.title}
          description={ratingNotice.text}
          onClose={() => setRatingNotice(null)}
        />
      )}
      {modelError && <p className="text-red-500 mt-10">{modelError}</p>}
      <div className="mx-auto p-6 rounded-md mt-10 w-3/4">
        <div className="mb-8 pb-2 border-b border-gray-300">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{model.name}</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">
              Owner:{" "}
              <Link to={`/profile/${model.username}`}>{model.username}</Link>
            </p>
            <div ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center rounded-md px-4 py-2  font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <EllipsisVerticalIcon className="w-8 h-8" />
              </button>
            </div>
            {isOpen && (
              <div className="origin-top-right absolute right-32 mt-28 w-56 rounded-md shadow-lg bg-white ring-1 ring-black/5">
                <div
                  className="flex flex-col justify-start py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <Link
                    to={`/tests/`}
                    className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    onClick={() => setIds({ modelId: Number(modelId), resourceId: ids?.resourceId })}
                  >
                    Test
                  </Link>
                  {/* <Link to={`/profile/${model.username}`}>{model.username}</Link> */}
                  {/* <button className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Test</button> */}
                  {/* <button className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Option 2</button> */}
                  {/* <button className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Option 3</button> */}
                </div>
              </div>
            )}
          </div>
        </div>


        <div className="mb-8">
          <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
            Description
          </h2>
          <p className="text-gray-800 leading-relaxed wrap-break-word font-thin">
            {model.description}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
            Model Details
          </h2>
          <div className="mt-4 text-gray-800 leading-relaxed wrap-break-word font-thin">
            <p>Type: {model.type}</p>
            <p>Stars: {model.stars != null ? model.stars.toFixed(1) : "No ratings yet"}</p>
            <p>Usage: {model.usageCount}</p>
            <p>Created Time: {formattedCreateTime}</p>
          </div>
        </div>

        {model.id && <Inference modelId={model.id} />}  

        <div>
          <h2 className="lg:text-2xl md:text-xl sm:text-lg font-bold mb-4">
            Rate this model
          </h2>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((stars) => (
              <button
                key={stars}
                onClick={() => handleStarClick(stars)}
                className={`mr-1 text-white-500 hover:text-yellow-600 ${userRatingStars && userRatingStars >= stars
                  ? "text-yellow-400"
                  : "text-gray-300"
                  }`}
              >
                <StarIcon className="w-6 h-6" />
              </button>
            ))}
          </div>
          {/* Rating Section */}
          <p
            onClick={() => setIsRatingBoxVisible(true)}
            className="ml-1 mt-2 text-blue-500 cursor-pointer"
          >
            Write a review
          </p>
        </div>
        {isRatingBoxVisible && (
          <NewRatingBox
            setIsRatingBoxVisible={setIsRatingBoxVisible}
            setUserComment={setUserComment}
            setUserRatingStars={setUserRatingStars}
            userRatingStars={userRatingStars}
            handleNewRatingSubmit={handleNewRatingSubmit}
          />
        )}

        {/* Inference Section */}
        {/* {model.id && <Inference modelId={model.id} />} */}

        {/* Comment Section */}
        {model.id && <RatingsSection key={ratingsVersion} modelId={model.id} />}
      </div>
    </Container>
  );
};

export default ModelDetail;
