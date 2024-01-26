// EditUserBox.tsx
import React from "react";

interface EditUserBoxProps {
  userData: any;
  handleEditBoxSave: () => void;
  setIsEditBoxVisible: (isVisible: boolean) => void;
}

const EditUserBox: React.FC<EditUserBoxProps> = (
  { userData, handleEditBoxSave, setIsEditBoxVisible },
) => (
  <div>
    <div className="w-screen h-screen absolute inset-0 flex justify-center items-center bg-black bg-opacity-15 z-40">
      <div className="border rounded-lg bg-white w-1/2 h-1/2 p-2 flex flex-col items-center justify-center">
        <h1 className="text-5xl my-2 font-bold mb-4">Edit User</h1>
        {/* <label className="block w-full ml-5">
          Username:
          <input
            className="ml-3 p-2 rounded bg-white text-black border w-5/6"
            placeholder={userData.username}
            onChange={(e) => userData.username = e.target.value}
          />
        </label> */}
        <label className="block mt-2 w-full ml-5">
          First Name:
          <input
            className="ml-2 p-2 rounded bg-white text-black border w-5/6"
            placeholder={userData.firstname}
            onChange={(e) => userData.firstname = e.target.value}
          />
        </label>
        <label className="block mt-2 w-full ml-5">
          Last Name:
          <input
            className="ml-2 p-2 rounded bg-white text-black border w-5/6"
            placeholder={userData.lastname}
            onChange={(e) => userData.lastname = e.target.value}
          />
        </label>
        <label className="block mt-2 w-full ml-5">
          Email:
          <input
            className="ml-11 p-2 rounded bg-white text-black border w-5/6"
            placeholder={userData.email}
            onChange={(e) => userData.email = e.target.value}
          />
        </label>
        {/* <label className="block mt-2 w-full ml-5">
          Password:
          <input
            className="ml-4 p-2 rounded bg-white text-black border w-5/6"
            placeholder="********"
            onChange={(e) => userData.password = e.target.value}
          />
        </label> */}
          <label className="block mt-2 w-full ml-5">
          Role:
          <input
            className="ml-12 p-2 rounded bg-white text-black border w-5/6"
            placeholder={userData.role}
            onChange={(e) => userData.role = e.target.value}
          />
          </label>
          <div className="flex gap-4 my-2">
          <button
            className="border border-gray-300 p-2 rounded-md hover:bg-gray-300"
            onClick={() => {
              setIsEditBoxVisible(false);
            }}
          >
            Cancel
          </button>
          <button
            className="border border-gray-500 bg-gray-500 text-white p-2 rounded-md hover:shadow-xl"
            onClick={handleEditBoxSave}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default EditUserBox;
