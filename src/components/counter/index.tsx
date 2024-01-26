import { ICounter } from "@/interfaces/ICounter";

type Props = {
  data: ICounter;
};

const Counter = ({ data }: Props) => {
  const Icon = data.icon;
  return (
    <div className="flex flex-col items-center justify-center w-36 h-36 p-4 mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-center items-center gap-2">
        <div className="flex items-center justify-center w-12 h-12 mx-auto text-white bg-blue-500 rounded-full">
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl">{data.title}</h1>
      </div>
      <h3 className="mt-3 text-3xl font-bold text-center">{data.count}</h3>
      <p className="text-sm text-center text-gray-500">{data.subtitle}</p>
    </div>
  );
};

export default Counter;
