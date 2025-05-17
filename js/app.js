// Global variable to store all elements data
let allElements = [];
let tooltip = null;

document.addEventListener('DOMContentLoaded', () => {
    const url = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json';
    
    // Create tooltip element
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allElements = data.elements;
            createPeriodicTable(allElements);
            setupFilters(allElements);
            createLegend();
            setupEventListeners();
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
            document.getElementById('periodic-table').innerHTML = 
                '<p class="error">Error loading periodic table data. Please try again later.</p>';
        });
});

function createPeriodicTable(elements) {
    const periodicTable = document.getElementById('periodic-table');
      const categoryClasses = {
        'alkali metal': 'alkali-metal',
        'alkaline earth metal': 'alkaline-earth-metal',
        'transition metal': 'transition-metal',
        'post-transition metal': 'post-transition-metal',
        'metalloid': 'metalloid',
        'nonmetal': 'nonmetal',
        'polyatomic nonmetal': 'nonmetal',
        'diatomic nonmetal': 'nonmetal',
        'halogen': 'halogen',
        'noble gas': 'noble-gas',
        'lanthanoid': 'lanthanide',
        'lanthanide': 'lanthanide',
        'actinoid': 'actinide',
        'actinide': 'actinide'
    };
    
    periodicTable.innerHTML = '';
      elements.forEach(element => {
        const elementDiv = document.createElement('div');        elementDiv.className = `element ${getCategoryClass(element.category, categoryClasses)}`;
        elementDiv.dataset.atomicNumber = element.number;
        elementDiv.dataset.category = getCategoryClass(element.category, categoryClasses);
        elementDiv.dataset.state = element.phase || 'unknown';
        elementDiv.dataset.period = element.period || '';
        elementDiv.dataset.group = element.group || '';
        
        // Make elements focusable for keyboard navigation
        elementDiv.tabIndex = 0;
        elementDiv.setAttribute('role', 'button');
        elementDiv.setAttribute('aria-label', `${element.name}, atomic number ${element.number}, ${element.category}`);
        
        elementDiv.style.gridColumn = element.group || 1;
        elementDiv.style.gridRow = element.period || 1;
        
        elementDiv.innerHTML = `
            <div class="number">${element.number}</div>
            <div class="symbol">${element.symbol}</div>
            <div class="name">${element.name}</div>
        `;
        
        // Add tooltip functionality
        elementDiv.addEventListener('mouseover', (e) => {
            showTooltip(e, element);
        });
        
        elementDiv.addEventListener('mousemove', (e) => {
            positionTooltip(e);
        });
        
        elementDiv.addEventListener('mouseout', () => {
            hideTooltip();
        });
        
        // Add click handler for details
        elementDiv.addEventListener('click', () => showElementDetails(element));
        
        periodicTable.appendChild(elementDiv);
    });

    elements.forEach(element => {
        if ((element.number >= 57 && element.number <= 71) || 
            (element.number >= 89 && element.number <= 103)) {
            
            const elementDiv = findElementByNumber(element.number);
            if (elementDiv) {
                let rowPosition;
                let colPosition;
                
                if (element.number >= 57 && element.number <= 71) {
                    // Lanthanides
                    rowPosition = 8;
                    colPosition = (element.number - 57) + 3;
                } else {
                    // Actinides
                    rowPosition = 9;
                    colPosition = (element.number - 89) + 3;
                }
                
                elementDiv.style.gridRow = rowPosition;
                elementDiv.style.gridColumn = colPosition;
            }
        }
    });    const lanthanideMarker = document.createElement('div');
    lanthanideMarker.className = 'element lanthanide marker-block';
    lanthanideMarker.style.gridColumn = 3;
    lanthanideMarker.style.gridRow = 6;
    lanthanideMarker.innerHTML = `
        <div class="symbol">La-Lu</div>
        <div class="name">57-71</div>
    `;    // Add data attributes to clearly identify this as a marker block and ensure it's excluded from all filters
    lanthanideMarker.dataset.isMarker = 'true';
    lanthanideMarker.dataset.category = 'lanthanide';
    lanthanideMarker.dataset.state = 'marker';  // Special state for markers
    lanthanideMarker.dataset.period = 'marker'; // Special period for markers
    lanthanideMarker.dataset.group = 'marker';  // Special group for markers
    
    // Make marker blocks focusable for keyboard navigation
    lanthanideMarker.tabIndex = 0;
    lanthanideMarker.setAttribute('role', 'button');
    lanthanideMarker.setAttribute('aria-label', 'Lanthanide elements, atomic numbers 57 to 71');
    
    lanthanideMarker.addEventListener('click', () => {
        document.querySelectorAll('.element.lanthanide').forEach(el => {
            // Only highlight actual elements, not the marker block itself
            if (!el.dataset.isMarker) {
                el.classList.add('highlighted');
                setTimeout(() => el.classList.remove('highlighted'), 2000);
            }
        });
    });
    periodicTable.appendChild(lanthanideMarker);
    
    const actinideMarker = document.createElement('div');
    actinideMarker.className = 'element actinide marker-block';
    actinideMarker.style.gridColumn = 3;
    actinideMarker.style.gridRow = 7;
    actinideMarker.innerHTML = `
        <div class="symbol">Ac-Lr</div>
        <div class="name">89-103</div>
    `;    // Add data attributes to clearly identify this as a marker block and ensure it's excluded from all filters
    actinideMarker.dataset.isMarker = 'true';
    actinideMarker.dataset.category = 'actinide';
    actinideMarker.dataset.state = 'marker';  // Special state for markers
    actinideMarker.dataset.period = 'marker'; // Special period for markers
    actinideMarker.dataset.group = 'marker';  // Special group for markers
    
    // Make marker blocks focusable for keyboard navigation
    actinideMarker.tabIndex = 0;
    actinideMarker.setAttribute('role', 'button');
    actinideMarker.setAttribute('aria-label', 'Actinide elements, atomic numbers 89 to 103');
    
    actinideMarker.addEventListener('click', () => {
        document.querySelectorAll('.element.actinide').forEach(el => {
            // Only highlight actual elements, not the marker block itself
            if (!el.dataset.isMarker) {
                el.classList.add('highlighted');
                setTimeout(() => el.classList.remove('highlighted'), 2000);
            }
        });
    });
    periodicTable.appendChild(actinideMarker);
}

function getCategoryClass(category, categoryClasses) {
    // First try exact match
    if (categoryClasses[category.toLowerCase()]) {
        return categoryClasses[category.toLowerCase()];
    }
    
    // For nonmetals, handle different types
    if (category.toLowerCase().includes('nonmetal')) {
        return 'nonmetal';
    }
    
    return 'unknown';
}

// Show tooltip with basic element information
function showTooltip(event, element) {
    tooltip.innerHTML = `
        <strong>${element.name} (${element.symbol})</strong><br>
        Atomic Number: ${element.number}<br>
        Mass: ${element.atomic_mass} u<br>
        Category: ${element.category}<br>
        State: ${element.phase}
    `;
    
    tooltip.style.opacity = '1';
    positionTooltip(event);
}

// Position tooltip near the cursor
function positionTooltip(event) {
    tooltip.style.left = `${event.pageX}px`;
    tooltip.style.top = `${event.pageY - 10}px`;
}

// Hide tooltip
function hideTooltip() {
    tooltip.style.opacity = '0';
}

function showElementDetails(element) {
    const detailsDiv = document.getElementById('element-details');
    
    let detailsHTML = `
        <h2>${element.name} (${element.symbol})</h2>
        <p><strong>Atomic Number:</strong> ${element.number}</p>
        <p><strong>Atomic Mass:</strong> ${element.atomic_mass} u</p>
        <p><strong>Category:</strong> ${element.category}</p>
        <p><strong>Period:</strong> ${element.period}</p>
        <p><strong>Group:</strong> ${element.group || 'N/A'}</p>
        <p><strong>Phase at Room Temperature:</strong> ${element.phase}</p>
    `;
    
    if (element.electron_configuration) {
        detailsHTML += `<p><strong>Electron Configuration:</strong> ${element.electron_configuration}</p>`;
    }
    
    if (element.density) {
        detailsHTML += `<p><strong>Density:</strong> ${element.density} g/cm³</p>`;
    }
    
    if (element.melt) {
        detailsHTML += `<p><strong>Melting Point:</strong> ${element.melt} K</p>`;
    }
    
    if (element.boil) {
        detailsHTML += `<p><strong>Boiling Point:</strong> ${element.boil} K</p>`;
    }
    
    if (element.discovered_by) {
        detailsHTML += `<p><strong>Discovered by:</strong> ${element.discovered_by}</p>`;
    }
    
    if (element.named_by) {
        detailsHTML += `<p><strong>Named by:</strong> ${element.named_by}</p>`;
    }
    
    if (element.summary) {
        detailsHTML += `<p><strong>Summary:</strong> ${element.summary}</p>`;
    }
    
    // Add extra data visualization
    if (element.boil && element.melt) {
        const boilK = element.boil;
        const meltK = element.melt;
        const roomTemp = 293.15; // 20°C in Kelvin
        
        detailsHTML += `
            <div class="temperature-viz">
                <h3>Temperature Range</h3>
                <div class="temp-bar">
                    <div class="temp-scale">
                        <div class="temp-marker melt" style="left: ${Math.min(100, (meltK/boilK)*100)}%">
                            <span>Melting: ${meltK}K</span>
                        </div>
                        <div class="temp-marker room" style="left: ${Math.min(100, (roomTemp/boilK)*100)}%">
                            <span>Room Temp</span>
                        </div>
                        <div class="temp-marker boil" style="left: 100%">
                            <span>Boiling: ${boilK}K</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update the details div
    detailsDiv.innerHTML = detailsHTML;
    
    // Highlight this element
    document.querySelectorAll('.element.selected').forEach(el => el.classList.remove('selected'));
    const selectedElement = findElementByNumber(element.number);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
}

function findElementByNumber(number) {
    const elements = document.querySelectorAll('.element');
    for (const element of elements) {
        const numElement = element.querySelector('.number');
        if (numElement && numElement.textContent == number) {
            return element;
        }
    }
    return null;
}

// Set up filters based on available data
function setupFilters(elements) {
    // Define predefined categories for the filter dropdown
    const categoryClasses = {
        'alkali-metal': 'Alkali Metal',
        'alkaline-earth-metal': 'Alkaline Earth Metal',
        'transition-metal': 'Transition Metal',
        'post-transition-metal': 'Post-Transition Metal',
        'metalloid': 'Metalloid',
        'nonmetal': 'Nonmetal',
        'halogen': 'Halogen',
        'noble-gas': 'Noble Gas',
        'lanthanide': 'Lanthanide',
        'actinide': 'Actinide',
        'unknown': 'Unknown'
    };
    
    const categoryFilter = document.getElementById('category-filter');
    
    // Clear any existing options except the first one
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }
    
    // Add options for each category CSS class
    Object.entries(categoryClasses).forEach(([cssClass, label]) => {
        const option = document.createElement('option');
        option.value = cssClass;
        option.textContent = label;
        categoryFilter.appendChild(option);
    });
    
    // Populate period filter
    const periods = [...new Set(elements.map(el => el.period))].sort((a, b) => a - b);
    const periodFilter = document.getElementById('period-filter');
    periods.forEach(period => {
        const option = document.createElement('option');
        option.value = period;
        option.textContent = period;
        periodFilter.appendChild(option);
    });
    
    // Populate group filter
    const groups = [...new Set(elements.map(el => el.group).filter(Boolean))].sort((a, b) => a - b);
    const groupFilter = document.getElementById('group-filter');
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupFilter.appendChild(option);
    });
}

// Create the legend for element categories
function createLegend() {
    const legendItems = document.querySelector('.legend-items');
    const categories = {
        'alkali-metal': 'Alkali Metal',
        'alkaline-earth-metal': 'Alkaline Earth Metal',
        'transition-metal': 'Transition Metal',
        'post-transition-metal': 'Post-Transition Metal',
        'metalloid': 'Metalloid',
        'nonmetal': 'Nonmetal',
        'halogen': 'Halogen',
        'noble-gas': 'Noble Gas',
        'lanthanide': 'Lanthanide',
        'actinide': 'Actinide',
        'unknown': 'Unknown'
    };
    
    Object.entries(categories).forEach(([cssClass, label]) => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = `legend-color ${cssClass}`;
        
        const text = document.createElement('span');
        text.textContent = label;
        
        item.appendChild(colorBox);
        item.appendChild(text);
        legendItems.appendChild(item);
    });
}

// Set up event listeners for search and filters
function setupEventListeners() {    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Create debounce function to improve performance for real-time search
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Function to show a visual indicator that search is in progress
    function showSearchingIndicator() {
        // Add a class to the search box to show search is in progress
        const searchBox = document.querySelector('.search-box');
        searchBox.classList.add('searching');
        
        // Remove the class after the debounce time to show search is complete
        setTimeout(() => {
            searchBox.classList.remove('searching');
        }, 300);
    }
    
    const handleSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            clearFilters();
            return;
        }
        
        // Show search indicator for immediate feedback
        showSearchingIndicator();
        
        // Reset filter dropdowns to avoid conflicts
        document.getElementById('category-filter').value = 'all';
        document.getElementById('state-filter').value = 'all';
        document.getElementById('period-filter').value = 'all';
        document.getElementById('group-filter').value = 'all';
        
        // First reset all elements
        document.querySelectorAll('.element').forEach(el => {
            el.classList.remove('filtered-out');
            el.classList.remove('filtered-in');
            el.classList.remove('exact-match');
        });
          
        // Then apply search filter
        let matchCount = 0;
        let exactMatch = null;
        
        // Cache elements and their data to improve search performance
        const elements = document.querySelectorAll('.element');
        const elementDataMap = new Map(); // Use a Map for faster lookups
        
        elements.forEach(el => {
            // Special handling for marker blocks
            if (el.dataset.isMarker === 'true') {
                const symbol = el.querySelector('.symbol')?.textContent?.toLowerCase() || '';
                const name = el.querySelector('.name')?.textContent?.toLowerCase() || '';
                
                // Only show marker blocks if they match the search term
                const isMarkerMatch = 
                    symbol.includes(searchTerm) ||
                    name.includes(searchTerm) ||
                    (el.dataset.category && el.dataset.category.toLowerCase().includes(searchTerm));
                    
                if (isMarkerMatch) {
                    el.style.display = ''; // Show the marker
                    el.classList.add('filtered-in');
                    el.classList.remove('filtered-out');
                } else {
                    el.style.display = 'none'; // Hide the marker
                    el.classList.remove('filtered-in');
                    el.classList.add('filtered-out');
                }
                return;
            }
            
            // Skip elements without a number (as a backup check)
            const numElement = el.querySelector('.number');
            if (!numElement) {
                return;
            }
            
            const number = numElement.textContent || '';
            // Cache element data for faster lookup
            if (!elementDataMap.has(number)) {
                const elementData = allElements.find(e => e.number == number);
                if (elementData) {
                    elementDataMap.set(number, {
                        element: elementData,
                        symbol: elementData.symbol.toLowerCase(),
                        name: elementData.name.toLowerCase(),
                        category: elementData.category.toLowerCase(),
                        phase: elementData.phase ? elementData.phase.toLowerCase() : '',
                        electronConfig: elementData.electron_configuration ? elementData.electron_configuration.toLowerCase() : '',
                    });
                }
            }
            
            const data = elementDataMap.get(number);
            if (!data) return;
            
            // Check for exact symbol match (prioritize this)
            const isExactSymbolMatch = data.symbol === searchTerm;
              // More comprehensive search to include other properties
            const isMatch = isExactSymbolMatch || 
                data.symbol.includes(searchTerm) || 
                data.name.includes(searchTerm) || 
                number.includes(searchTerm) ||
                data.category.includes(searchTerm) ||
                data.phase.includes(searchTerm) ||
                data.electronConfig.includes(searchTerm);
            
            if (isMatch) {
                el.classList.add('filtered-in');
                
                // If it's an exact symbol match, highlight it specially
                if (isExactSymbolMatch) {
                    el.classList.add('exact-match');
                    exactMatch = el;
                }
                
                matchCount++;
            } else {
                el.classList.add('filtered-out');
            }
        });
          // Update filter count
        updateFilterCounts();
        
        // Show details based on matches
        if (exactMatch) {
            // If there's an exact match, prioritize that
            const atomicNumber = exactMatch.dataset.atomicNumber;
            const element = allElements.find(e => e.number == atomicNumber);
            if (element) {
                showElementDetails(element);
                exactMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (matchCount === 1) {
            // If there's only one matching element, show its details
            const singleMatch = document.querySelector('.element.filtered-in:not([data-is-marker="true"])');
            if (singleMatch) {
                const atomicNumber = singleMatch.dataset.atomicNumber;
                const element = allElements.find(e => e.number == atomicNumber);
                if (element) {
                    showElementDetails(element);
                    singleMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        } else if (matchCount === 0) {
            // No matches found - show a "no results" message in the details panel
            const detailsDiv = document.getElementById('element-details');
            detailsDiv.innerHTML = `
                <div class="no-results">
                    <h2>No Results Found</h2>
                    <p>No elements match the search term: <strong>"${searchTerm}"</strong></p>
                    <button id="clear-search-from-results" class="clear-search-btn">Clear Search</button>
                </div>
            `;
            
            // Add event listener to the clear search button
            document.getElementById('clear-search-from-results').addEventListener('click', () => {
                searchInput.value = '';
                clearFilters();
                searchInput.focus();
            });
        }
        
        // If there are multiple matches including the search term in the element's symbol,
        // visually highlight these symbol matches
        if (matchCount > 1 && !exactMatch) {
            document.querySelectorAll('.element.filtered-in:not([data-is-marker="true"])').forEach(el => {
                const symbol = el.querySelector('.symbol')?.textContent?.toLowerCase() || '';
                if (symbol.includes(searchTerm)) {
                    el.classList.add('symbol-match');
                }
            });
        }
    };
      // Apply search on button click
    searchBtn.addEventListener('click', handleSearch);
    
    // Create a debounced search function for real-time updates
    const debouncedSearch = debounce(handleSearch, 300);
    
    // Apply search on input with real-time feedback
    searchInput.addEventListener('input', (e) => {
        // Reset all symbol-match classes when typing
        document.querySelectorAll('.element').forEach(el => {
            el.classList.remove('symbol-match');
        });
        
        // Show quick feedback when typing before the debounced search happens
        const quickSearchTerm = e.target.value.trim().toLowerCase();
        if (quickSearchTerm) {
            const searchIndicator = document.querySelector('.search-indicator') || 
                (() => {
                    const indicator = document.createElement('span');
                    indicator.className = 'search-indicator';
                    document.querySelector('.search-box').appendChild(indicator);
                    return indicator;
                })();
            searchIndicator.textContent = `Searching: ${quickSearchTerm}`;
            searchIndicator.style.display = 'block';
            
            setTimeout(() => {
                searchIndicator.style.display = 'none';
            }, 300);
        }
        
        // Run the debounced search
        debouncedSearch(e);
    });
      // Handle special key events
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            // Immediate search on Enter key
            handleSearch();
            
            // Select the first result or element with exact match
            const exactMatch = document.querySelector('.element.exact-match');
            const firstMatch = document.querySelector('.element.filtered-in:not([data-is-marker="true"])');
            
            if (exactMatch) {
                exactMatch.focus();
            } else if (firstMatch) {
                firstMatch.focus();
            }
        } else if (e.key === 'Escape') {
            // Clear search on Escape key
            searchInput.value = '';
            clearFilters();
        } else if (e.key === 'ArrowDown') {
            // Navigate to the first search result on Arrow Down
            const firstMatch = document.querySelector('.element.filtered-in:not([data-is-marker="true"])');
            if (firstMatch) {
                firstMatch.focus();
            }
        }
    });
    
    // Add keyboard navigation between search results
    document.addEventListener('keydown', (e) => {
        // Only handle key navigation when we have search results
        const hasFilteredElements = document.querySelector('.element.filtered-in:not([data-is-marker="true"])');
        if (!hasFilteredElements) return;
        
        // Get the currently focused element
        const focusedElement = document.activeElement;
        
        // Check if we're on an element and handle arrow keys
        if (focusedElement.classList?.contains('element')) {
            const allFilteredElements = Array.from(
                document.querySelectorAll('.element.filtered-in:not([data-is-marker="true"])')
            );
            
            const currentIndex = allFilteredElements.indexOf(focusedElement);
            if (currentIndex === -1) return;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                // Move to next element
                const nextIndex = (currentIndex + 1) % allFilteredElements.length;
                allFilteredElements[nextIndex].focus();
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                // Move to previous element
                const prevIndex = (currentIndex - 1 + allFilteredElements.length) % allFilteredElements.length;
                allFilteredElements[prevIndex].focus();
                e.preventDefault();
            } else if (e.key === 'Enter') {
                // Show details for the focused element
                focusedElement.click();
                e.preventDefault();
            } else if (e.key === 'Escape') {
                // Return focus to search input
                searchInput.focus();
                e.preventDefault();
            }
        }
    });
    
    // Filter functionality
    const filters = [
        document.getElementById('category-filter'),
        document.getElementById('state-filter'),
        document.getElementById('period-filter'),
        document.getElementById('group-filter')
    ];
    
    filters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
      // Reset filters
    document.getElementById('reset-filters').addEventListener('click', clearFilters);
    
    // Clear search button
    document.getElementById('clear-search').addEventListener('click', () => {
        searchInput.value = '';
        clearFilters();
        searchInput.focus();
    });
}

// Apply all active filters
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const stateFilter = document.getElementById('state-filter').value;
    const periodFilter = document.getElementById('period-filter').value;
    const groupFilter = document.getElementById('group-filter').value;
    
    // Check if any filter is active
    const isAnyFilterActive = 
        categoryFilter !== 'all' || 
        stateFilter !== 'all' || 
        periodFilter !== 'all' || 
        groupFilter !== 'all';
    
    // If no filters are active, just clear everything
    if (!isAnyFilterActive) {
        clearFilters();
        return;
    }
    
    // Reset search input
    document.getElementById('search-input').value = '';
    
    // First reset all elements
    document.querySelectorAll('.element').forEach(el => {
        el.classList.remove('filtered-out');
        el.classList.remove('filtered-in');
    });      // Apply filters to each element
    document.querySelectorAll('.element').forEach(el => {        // Special handling for Lanthanide/Actinide markers
        if (el.dataset.isMarker === 'true') {
            // For category filter, only show the marker if it matches the selected category
            if (categoryFilter !== 'all') {
                // Only show the marker if its category matches the filter
                if (el.dataset.category === categoryFilter) {
                    el.style.display = ''; // Show the marker
                    el.classList.add('filtered-in');
                    el.classList.remove('filtered-out');
                } else {
                    el.style.display = 'none'; // Hide the marker
                    el.classList.remove('filtered-in');
                    el.classList.add('filtered-out');
                }
                return;
            }
            
            // Hide markers completely if filtering by state, period, or group
            // (only show them when filtering by category or when all filters are reset)
            if (stateFilter !== 'all' || periodFilter !== 'all' || groupFilter !== 'all') {
                el.style.display = 'none';
            } else {
                el.style.display = ''; // reset to default display
            }
            
            // Ensure markers are never affected by filtering classes when not category filtering
            el.classList.remove('filtered-in');
            el.classList.remove('filtered-out');
            return;
        }
        
        // Skip elements without a number (as a backup check)
        const numElement = el.querySelector('.number');
        if (!numElement) {
            return;
        }
        
        let visible = true;
        
        // Apply category filter using dataset attributes
        if (categoryFilter !== 'all') {
            visible = visible && el.dataset.category === categoryFilter;
        }
        
        // Apply state filter - explicitly never match marker blocks
        if (stateFilter !== 'all') {
            visible = visible && (el.dataset.state === stateFilter && el.dataset.state !== 'marker');
        }
        
        // Apply period filter - explicitly never match marker blocks
        if (periodFilter !== 'all') {
            visible = visible && (String(el.dataset.period) === String(periodFilter) && el.dataset.period !== 'marker');
        }
        
        // Apply group filter - explicitly never match marker blocks
        if (groupFilter !== 'all') {
            visible = visible && (String(el.dataset.group) === String(groupFilter) && el.dataset.group !== 'marker');
        }
        
        if (visible) {
            el.classList.remove('filtered-out');
            el.classList.add('filtered-in');
        } else {
            el.classList.add('filtered-out');
            el.classList.remove('filtered-in');
        }
    });
      // Update filter counts - show how many elements match each filter
    updateFilterCounts();
    
    // If only one element is visible, show its details
    const visibleElements = document.querySelectorAll('.element:not(.filtered-out)');
    if (visibleElements.length === 1 && visibleElements[0].querySelector('.number')) {
        const atomicNumber = visibleElements[0].dataset.atomicNumber;
        const element = allElements.find(e => e.number == atomicNumber);
        if (element) {
            showElementDetails(element);
        }
    }
}

// Update filter counts to show how many elements match each filter
function updateFilterCounts() {
    // Only count actual elements, not the lanthanide/actinide markers
    const visibleElements = document.querySelectorAll('.element:not(.filtered-out)');
    let totalVisible = 0;
    
    visibleElements.forEach(el => {
        // Skip marker blocks using the data attribute
        if (el.dataset.isMarker !== 'true' && el.querySelector('.number')) {
            totalVisible++;
        }
    });
    
    // Create or update the count element
    let countElement = document.getElementById('filter-count');
    if (!countElement) {
        countElement = document.createElement('div');
        countElement.id = 'filter-count';
        countElement.className = 'filter-count';
        document.querySelector('.controls-container').appendChild(countElement);
    }
    
    const totalElementsCount = allElements.length;
    
    // Update the count text
    countElement.textContent = `Showing ${totalVisible} of ${totalElementsCount} elements`;
    countElement.style.display = totalVisible === totalElementsCount ? 'none' : 'block';
}

// Clear all filters and reset the table
function clearFilters() {
    // Reset all filter dropdowns
    document.getElementById('category-filter').value = 'all';
    document.getElementById('state-filter').value = 'all';
    document.getElementById('period-filter').value = 'all';
    document.getElementById('group-filter').value = 'all';
    document.getElementById('search-input').value = '';
    
    // Hide search indicator if present
    const searchIndicator = document.querySelector('.search-indicator');
    if (searchIndicator) {
        searchIndicator.style.display = 'none';
    }
    
    // Show all elements and clear special classes
    document.querySelectorAll('.element').forEach(el => {
        // Remove all filter and search-related classes
        el.classList.remove('filtered-out');
        el.classList.remove('filtered-in');
        el.classList.remove('exact-match');
        el.classList.remove('highlighted');
        el.classList.remove('symbol-match');
        
        // For marker blocks, ensure they're properly visible
        if (el.dataset.isMarker === 'true') {
            el.style.display = ''; // Reset display to default
            el.classList.remove('filtered-out');
            el.classList.remove('filtered-in');
        }
        
        // Remove any inline styles that might have been added
        if (el.style.opacity !== '') el.style.removeProperty('opacity');
        if (el.style.transform !== '') el.style.removeProperty('transform');
        if (el.style.filter !== '') el.style.removeProperty('filter');
    });
    
    // Hide the filter count
    const countElement = document.getElementById('filter-count');
    if (countElement) {
        countElement.style.display = 'none';
    }
    
    // Reset details panel to initial state
    const detailsDiv = document.getElementById('element-details');
    detailsDiv.innerHTML = '<h2>Select an element to see details</h2>';
    
    // Remove any highlighting from previously selected element
    document.querySelectorAll('.element.selected').forEach(el => {
        el.classList.remove('selected');
    });
}
