import { ImCross } from "react-icons/im";
import { AiFillPlusCircle } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

export default function Navbar({
  search,
  setSearch,
  showAdd,
  setShowAdd,
  selectedId,
}) {
  return (
    <div className="w-full shrink-0 py-3 border-b border-white/10 px-3 sm:px-5 bg-[#111D1B]">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center w-full">
        {/* Search */}
        <div className="flex items-center bg-[#1C2826] px-3 gap-2 rounded-full w-full sm:w-[60%] md:w-[50%]">
          <FaSearch className="text-[#606867] text-[14px]" />
          <input
            className="w-full py-1 px-2 text-sm sm:text-base text-[#606867] bg-transparent placeholder:text-xs sm:placeholder:text-sm outline-none"
            placeholder="Search all folders by title / description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add Content */}
        <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
          <button
            disabled={!selectedId}
            className={`flex items-center gap-2 py-1.5 rounded-full px-3 text-xs sm:text-sm font-bold shadow-2xl transition-all duration-300
              ${
                selectedId
                  ? "bg-[#2BD4BD] hover:bg-[#2bacd4] text-black"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            onClick={() => setShowAdd((p) => !p)}
          >
            {showAdd ? (
              <>
                <ImCross className="text-[14px]" />
                Close
              </>
            ) : (
              <>
                <AiFillPlusCircle className="text-[14px]" />
                Add Content
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
