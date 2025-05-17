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
        const elementDiv = document.createElement('div');
        elementDiv.className = `element ${getCategoryClass(element.category, categoryClasses)}`;
        elementDiv.dataset.atomicNumber = element.number;
        // Store CSS class name instead of raw category for filtering
        elementDiv.dataset.category = getCategoryClass(element.category, categoryClasses);
        elementDiv.dataset.state = element.phase || 'unknown';
        elementDiv.dataset.period = element.period || '';
        elementDiv.dataset.group = element.group || '';
        
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
    `;
    // Add data attributes to clearly identify this as a marker block and ensure it's excluded from all filters
    lanthanideMarker.dataset.isMarker = 'true';
    lanthanideMarker.dataset.category = 'lanthanide';
    lanthanideMarker.dataset.state = 'marker';  // Special state for markers
    lanthanideMarker.dataset.period = 'marker'; // Special period for markers
    lanthanideMarker.dataset.group = 'marker';  // Special group for markers
    
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
    `;
    // Add data attributes to clearly identify this as a marker block and ensure it's excluded from all filters
    actinideMarker.dataset.isMarker = 'true';
    actinideMarker.dataset.category = 'actinide';
    actinideMarker.dataset.state = 'marker';  // Special state for markers
    actinideMarker.dataset.period = 'marker'; // Special period for markers
    actinideMarker.dataset.group = 'marker';  // Special group for markers
    
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
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    const handleSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            clearFilters();
            return;
        }
        
        // Reset filter dropdowns to avoid conflicts
        document.getElementById('category-filter').value = 'all';
        document.getElementById('state-filter').value = 'all';
        document.getElementById('period-filter').value = 'all';
        document.getElementById('group-filter').value = 'all';
        
        // First reset all elements
        document.querySelectorAll('.element').forEach(el => {
            el.classList.remove('filtered-out');
            el.classList.remove('filtered-in');
        });
          // Then apply search filter
        let matchCount = 0;

        document.querySelectorAll('.element').forEach(el => {
            // Skip marker blocks using the data attribute
            if (el.dataset.isMarker === 'true') {
                // Ensure markers are never affected by search filtering
                el.classList.remove('filtered-in');
                el.classList.remove('filtered-out');
                // Still show marker blocks during search
                el.style.display = '';
                return;
            }
            
            // Skip elements without a number (as a backup check)
            const numElement = el.querySelector('.number');
            if (!numElement) {
                return;
            }
            
            const symbol = el.querySelector('.symbol')?.textContent?.toLowerCase() || '';
            const name = el.querySelector('.name')?.textContent?.toLowerCase() || '';
            const number = el.querySelector('.number')?.textContent || '';
            
            // Get corresponding element data to search in other properties
            const elementData = allElements.find(e => e.number == number);
            if (!elementData) return;
            
            // Check for exact symbol match (prioritize this)
            const exactSymbolMatch = elementData.symbol.toLowerCase() === searchTerm;
            
            // More comprehensive search to include other properties
            const isMatch = exactSymbolMatch || 
                symbol.includes(searchTerm) || 
                name.includes(searchTerm) || 
                number.includes(searchTerm) ||
                (elementData.category.toLowerCase().includes(searchTerm)) ||
                (elementData.phase && elementData.phase.toLowerCase().includes(searchTerm)) ||
                (elementData.electron_configuration && elementData.electron_configuration.toLowerCase().includes(searchTerm));
            
            if (isMatch) {
                el.classList.add('filtered-in');
                
                // If it's an exact symbol match, highlight it specially
                if (exactSymbolMatch) {
                    el.classList.add('exact-match');
                }
                
                matchCount++;
            } else {
                el.classList.add('filtered-out');
            }
        });
    };
      searchBtn.addEventListener('click', () => {
        handleSearch();
        // Update filter count after search
        updateFilterCounts();
        
        // If there's only one match, show its details
        const visibleElements = document.querySelectorAll('.element.filtered-in');
        if (visibleElements.length === 1) {
            const atomicNumber = visibleElements[0].dataset.atomicNumber;
            const element = allElements.find(e => e.number == atomicNumber);
            if (element) {
                showElementDetails(element);
                visibleElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // If there's an exact match, show its details immediately
        const exactMatch = document.querySelector('.element.exact-match');
        if (exactMatch) {
            const atomicNumber = exactMatch.dataset.atomicNumber;
            const element = allElements.find(e => e.number == atomicNumber);
            if (element) {
                showElementDetails(element);
                exactMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            // Update UI after search
            updateFilterCounts();
            
            // Check for exact match or single result
            const exactMatch = document.querySelector('.element.exact-match');
            if (exactMatch) {
                const atomicNumber = exactMatch.dataset.atomicNumber;
                const element = allElements.find(e => e.number == atomicNumber);
                if (element) {
                    showElementDetails(element);
                    exactMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                const visibleElements = document.querySelectorAll('.element.filtered-in');
                if (visibleElements.length === 1) {
                    const atomicNumber = visibleElements[0].dataset.atomicNumber;
                    const element = allElements.find(e => e.number == atomicNumber);
                    if (element) {
                        showElementDetails(element);
                        visibleElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        } else if (e.key === 'Escape') {
            searchInput.value = '';
            clearFilters();
        } else if (searchInput.value === '') {
            // Clear filters if search box is emptied
            clearFilters();
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
    
    // Show all elements and clear special classes
    document.querySelectorAll('.element').forEach(el => {
        // Remove filter classes
        el.classList.remove('filtered-out');
        el.classList.remove('filtered-in');
        el.classList.remove('exact-match');
        el.classList.remove('highlighted');
        
        // For marker blocks, ensure they're properly visible and don't have any filter-related classes
        if (el.dataset.isMarker === 'true') {
            el.style.display = ''; // Reset display to default
            el.classList.remove('filtered-out');
            el.classList.remove('filtered-in');
        }
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
