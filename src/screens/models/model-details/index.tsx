import UserDashboardAI from "@/apis/UserDashboardAI";
import Container from "@/components/container";
import NewRatingBox from "@/components/editbox/rating";
import ConfirmAlertBox from "@/components/notification/confirm";
import RatingsSection from "@/components/ratings";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import useTestId from "@/hooks/useTestId";
import { IModel } from "@/interfaces/IModel.tsx";
import { StarIcon } from "@heroicons/react/16/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ModelDetail = () => {
  const { modelId } = useParams();
  const { auth } = useAuth();
  const { ids, setIds } = useTestId();
  if (!modelId) {
    return <div className="text-red-500">MODELID not found</div>;
  }

  const [modelResponse, modelError, modelLoading, modelRefetch] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/models/" + modelId,
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    },
  });

  const [newRatingResponse, newRatingError, newRatingLoading, newRatingAF] =
    useAxiosFunction();

  useEffect(() => {
    if (modelResponse?.data) {
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

  const handleNewRatingSubmit = () => {
    // Update the user's rating
    console.log(userRatingStars);
    console.log(userComment);
    newRatingAF({
      axiosInstance: UserDashboardAI,
      method: "post",
      url: "/ratings/create",
      requestConfig: {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        data: {
          modelId: model.id,
          stars: userRatingStars,
          comment: userComment,
        },
        params: {
          model_id: model.id,
          user_id: auth?.userId,
        },
      },
    });
    setIsRatingBoxVisible(false);
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
      {newRatingError === "Request failed with status code 400" && (
        <ConfirmAlertBox
          title="Error"
          description="You have already rated this model"
          onClose={() => { }}
        />
      )}
      {newRatingResponse && newRatingResponse.status === 201 && (
        <ConfirmAlertBox
          title="Success"
          description="Your rating has been submitted successfully"
          onClose={() => { }}
        />
      )}
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
                className="inline-flex justify-center rounded-md px-4 py-2  font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <EllipsisVerticalIcon className="w-8 h-8" />
              </button>
            </div>
            {isOpen && (
              <div className="origin-top-right absolute right-32 mt-28 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
          <p className="text-gray-800 leading-relaxed break-words font-thin">
            {model.description}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="lg:text-3xl md:text-2xl sm:text-xl font-bold mb-4">
            Model Details
          </h2>
          <div className="mt-4 text-gray-800 leading-relaxed break-words font-thin">
            <p>Type: {model.type}</p>
            <p>Stars: {model.stars}</p>
            <p>Usage: {model.usageCount}</p>
            <p>Created Time: {formattedCreateTime}</p>
          </div>
        </div>

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
        {model.id && <RatingsSection modelId={model.id} />}
      </div>
    </Container>
  );
};

export default ModelDetail;
