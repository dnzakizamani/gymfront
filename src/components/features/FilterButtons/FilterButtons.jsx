import './FilterButtons.css';

const MUSCLE_GROUPS = ['All', 'Back', 'Chest', 'Legs', 'Shoulders', 'Arms', 'Core'];

const FilterButtons = ({ activeFilter, onFilterChange }) => {
    return (
        <div className="filter-buttons">
            {MUSCLE_GROUPS.map((group) => (
                <button
                    key={group}
                    className={`filter-button ${activeFilter === group ? 'filter-button--active' : ''
                        }`}
                    onClick={() => onFilterChange(group)}
                >
                    {group}
                </button>
            ))}
        </div>
    );
};

export default FilterButtons;
