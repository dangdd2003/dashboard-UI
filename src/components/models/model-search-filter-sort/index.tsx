type SearchSortFilterProps = {
  searchInput: string;
  sortOrder: number;
  typeFilter: string;
  onSearchInputChange: (newSearchInput: string) => void;
  onSortOrderChange: () => void;
  onTypeFilterChange: (newTypeFilter: string) => void;
};

const SearchSortFilter: React.FC<SearchSortFilterProps> = ({
  searchInput,
  sortOrder,
  typeFilter,
  onSearchInputChange,
  onSortOrderChange,
  onTypeFilterChange,
}) => {
  // Render the search box, sort button, and filter
  return (
    <div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
      />
      <button onClick={onSortOrderChange}>Sort</button>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
      >
        <option value="">All</option>
        <option value="image">Image</option>
        <option value="text">Text</option>
        <option value="audio">Audio</option>
      </select>
    </div>
  );
};
