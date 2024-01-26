// ModelCardComponentLarge.tsx
import { IModel } from "@/interfaces/IModel";
import { StarIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";

export type Props = {
  model: IModel;
};

const ModelCardLarge: React.FC<Props> = ({ model }) => {
  const isAboveMedium = useMediaQuery({ minWidth: 768 });
  return (
    <div className={`p-2`}>
      <div
        className={`mr-4 rounded overflow-hidden shadow-lg p-6 mb-2 bg-white border-2}`}
      >
        <div className="font-bold text-xl mb-2">{model.name}</div>
        <p>Owner: {model.username}</p>
        <p>Type: {model.type}</p>
        <p>Usage: {model.usageCount}</p>
        <div className="flex items-center mt-4">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span className="pt-1 ml-2">{model.stars}</span>
        </div>
      </div>
    </div>
  );
};

export default ModelCardLarge;
