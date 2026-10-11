import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const SearchBar = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  sort,
  setSort,
  onSearch
}) => {
  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Workshop',
    'Seminar',
    'Sports',
    'Competition',
    'Fest'
  ];

  const statuses = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Ongoing', value: 'ONGOING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  const sortOptions = [
    { label: 'Event Date (Upcoming)', value: 'upcoming' },
    { label: 'Recently Added', value: 'latest' },
    { label: 'Most Popular', value: 'popular' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="filter-bar">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="form-control"
          placeholder="Search events by title, keyword, or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Dropdown */}
      <div className="filter-select">
        <select
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              Category: {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Status Dropdown */}
      <div className="filter-select">
        <select
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="filter-select">
        <select
          className="form-control"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((so) => (
            <option key={so.value} value={so.value}>
              Sort: {so.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default SearchBar;
