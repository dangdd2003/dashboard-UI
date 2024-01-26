import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Searchbar = () => {
  return (
    <div className="p-2 mx-auto my-auto border-2 rounded-full">
      <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-white overflow-hidden">
        <div className="grid place-items-center h-full w-12">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </div>
        <input
          className="peer h-full w-full outline-none text-lg text-gray-700 pr-2"
          type="text"
          id="search"
          placeholder="Search something.."
        />
      </div>
    </div>
  );
};

export default Searchbar;
