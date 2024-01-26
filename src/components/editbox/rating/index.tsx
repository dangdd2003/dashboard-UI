import { StarIcon } from "@heroicons/react/24/outline";

type Props = {
  setIsRatingBoxVisible: (arg: boolean) => void;
  setUserComment: (arg: string) => void;
  setUserRatingStars: (arg: number) => void;
  handleNewRatingSubmit: () => void;
  userRatingStars: number | null;
}

const NewRatingBox = ({setIsRatingBoxVisible, setUserComment, setUserRatingStars, userRatingStars, handleNewRatingSubmit}: Props) => {
  return (
    <div>
    <div className="w-screen h-screen absolute inset-0 flex justify-center items-center bg-black bg-opacity-15 z-40">
      <div className="border rounded-lg bg-white w-1/2 h-1/2 p-2 flex flex-col items-center justify-center">
        <h1 className="text-5xl my-2 font-bold mb-4">Your Rating</h1>
        {/* <label className="block w-full ml-5">
          Username:
          <input
            className="ml-3 p-2 rounded bg-white text-black border w-5/6"
            placeholder={userData.username}
            onChange={(e) => userData.username = e.target.value}
          />
        </label> */}
        <div className="flex items-center mb-5">
        {[1, 2, 3, 4, 5].map((stars) => (
        <button
            key={stars}
            onClick={() => setUserRatingStars(stars)}
            className={`mr-1 text-white-500 hover:text-yellow-600 ${
                userRatingStars && userRatingStars >= stars ? 'text-yellow-400' : 'text-gray-300'
            }`}
        >
            <StarIcon className="w-6 h-6" />
        </button>
        ))}
        </div>
        <textarea
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Add a comment..."
            className="p-4 border border-gray-300 rounded-md w-full h-1/2"
        />
        <div className="flex gap-4 my-2">
          <button
            className="border border-gray-300 p-2 rounded-md hover:bg-gray-300"
            onClick={() => {
              setIsRatingBoxVisible(false);
            }}
          >
            Cancel
          </button>
          <button
            className="border border-gray-500 bg-gray-500 text-white p-2 rounded-md hover:shadow-xl"
            onClick={handleNewRatingSubmit}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default NewRatingBox;