interface EditModelBoxProps {
  modelData: any;
  editedData: any;
  handleEditBoxSave: () => void;
  setIsEditBoxVisible: (isVisible: boolean) => void;
}

const EditModelBox: React.FC<EditModelBoxProps> = ({ modelData, editedData, handleEditBoxSave, setIsEditBoxVisible }) => {
  // Use the props in your component logic as needed
  console.log(modelData);
  return (
    <div>
      <div className="w-screen h-screen absolute inset-0 flex justify-center items-center bg-black bg-opacity-15 z-40">
        <div className="border rounded-lg bg-white w-3/4 h-3/4 p-2 flex flex-col items-center justify-center">
          <h1 className="text-5xl my-2 font-bold mb-4">Edit Model</h1>
          <label className="flex flex-col my-2 w-full ml-5">
            Name:
            <textarea
              className="ml-2 p-2 rounded bg-white text-black border w-5/6"
              placeholder={modelData.name}
              onChange={(e) => editedData.name = e.target.value}
            />
          </label>
          <label className="flex flex-col my-2 w-full ml-5">
            Description:
            <textarea
              className="ml-2 p-2 rounded bg-white text-black border w-5/6"
              placeholder={modelData.description}
              onChange={(e) => editedData.description = e.target.value}
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
  )
}

export default EditModelBox
