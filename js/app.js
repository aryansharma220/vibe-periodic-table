document.addEventListener('DOMContentLoaded', () => {
    // URL for the periodic table data
    const apiUrl = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json';
    
    // Fetch the data
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process and display the periodic table
            createPeriodicTable(data.elements);
        })
        .catch(error => {
            console.error('There was a problem fetching the data:', error);
            document.getElementById('periodic-table').innerHTML = 
                '<p class="error">Error loading periodic table data. Please try again later.</p>';
        });
});

// Function to create the periodic table
function createPeriodicTable(elements) {
    const periodicTable = document.getElementById('periodic-table');
    
    // Define the mapping of categories to CSS classes
    const categoryClasses = {
        'alkali metal': 'alkali-metal',
        'alkaline earth metal': 'alkaline-earth-metal',
        'transition metal': 'transition-metal',
        'post-transition metal': 'post-transition-metal',
        'metalloid': 'metalloid',
        'nonmetal': 'nonmetal',
        'halogen': 'halogen',
        'noble gas': 'noble-gas',
        'lanthanoid': 'lanthanide',
        'lanthanide': 'lanthanide',
        'actinoid': 'actinide',
        'actinide': 'actinide'
    };
    
    // Clear existing content
    periodicTable.innerHTML = '';
    
    // Create and append elements to the grid
    elements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = `element ${getCategoryClass(element.category, categoryClasses)}`;
        
        // Set the grid position based on the period and group
        elementDiv.style.gridColumn = element.group || 1;
        elementDiv.style.gridRow = element.period || 1;
        
        // Fill with element data
        elementDiv.innerHTML = `
            <div class="number">${element.number}</div>
            <div class="symbol">${element.symbol}</div>
            <div class="name">${element.name}</div>
        `;
        
        // Add click event to show details
        elementDiv.addEventListener('click', () => showElementDetails(element));
        
        // Add to the periodic table grid
        periodicTable.appendChild(elementDiv);
    });
      // Special handling for Lanthanides (57-71) and Actinides (89-103)
    // We'll set them in their own rows below the main table
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
    });
    
    // Add placeholders for Lanthanides and Actinides in the main table
    const lanthanideMarker = document.createElement('div');
    lanthanideMarker.className = 'element lanthanide';
    lanthanideMarker.style.gridColumn = 3;
    lanthanideMarker.style.gridRow = 6;
    lanthanideMarker.innerHTML = `
        <div class="symbol">La-Lu</div>
        <div class="name">57-71</div>
    `;
    lanthanideMarker.addEventListener('click', () => {
        document.querySelectorAll('.element.lanthanide').forEach(el => {
            el.classList.add('highlighted');
            setTimeout(() => el.classList.remove('highlighted'), 2000);
        });
    });
    periodicTable.appendChild(lanthanideMarker);
    
    const actinideMarker = document.createElement('div');
    actinideMarker.className = 'element actinide';
    actinideMarker.style.gridColumn = 3;
    actinideMarker.style.gridRow = 7;
    actinideMarker.innerHTML = `
        <div class="symbol">Ac-Lr</div>
        <div class="name">89-103</div>
    `;
    actinideMarker.addEventListener('click', () => {
        document.querySelectorAll('.element.actinide').forEach(el => {
            el.classList.add('highlighted');
            setTimeout(() => el.classList.remove('highlighted'), 2000);
        });
    });
    periodicTable.appendChild(actinideMarker);
}

// Helper function to get the CSS class for an element category
function getCategoryClass(category, categoryClasses) {
    return categoryClasses[category.toLowerCase()] || 'unknown';
}

// Function to show element details
function showElementDetails(element) {
    const detailsDiv = document.getElementById('element-details');
    
    // Format the details
    let detailsHTML = `
        <h2>${element.name} (${element.symbol})</h2>
        <p><strong>Atomic Number:</strong> ${element.number}</p>
        <p><strong>Atomic Mass:</strong> ${element.atomic_mass} u</p>
        <p><strong>Category:</strong> ${element.category}</p>
        <p><strong>Period:</strong> ${element.period}</p>
        <p><strong>Group:</strong> ${element.group || 'N/A'}</p>
        <p><strong>Phase at Room Temperature:</strong> ${element.phase}</p>
    `;
    
    // Add additional properties if available
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
      // Update the details div
    detailsDiv.innerHTML = detailsHTML;
    
    // Highlight this element
    document.querySelectorAll('.element.selected').forEach(el => el.classList.remove('selected'));
    const selectedElement = findElementByNumber(element.number);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
}

// Find element by atomic number
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
