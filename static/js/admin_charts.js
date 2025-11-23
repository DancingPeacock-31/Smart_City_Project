document.addEventListener('DOMContentLoaded', () => {
    // Define the color palette
    const colors = {
        blue: '#1e88e5',
        yellow: '#fbc02d',
        green: '#4caf50',
        red: '#e53935',
        cyan: '#29b6f6',
        purple: '#8e24aa',
        orange: '#fb8c00',
    };

    /**
     * Checks if a canvas exists within a card body, and creates it if it doesn't.
     * @param {string} cardBodyId The ID of the card-body div.
     * @param {string} chartId The ID to assign to the new canvas.
     * @returns {HTMLElement|null} The canvas element or null if the card body doesn't exist.
     */
    const createCanvas = (cardBodyId, chartId) => {
        const cardBody = document.getElementById(cardBodyId);
        if (!cardBody) {
            console.error(`Card body with ID #${cardBodyId} not found.`);
            return null;
        }

        let canvas = document.getElementById(chartId);
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = chartId;
            cardBody.appendChild(canvas);
        }
        return canvas.getContext('2d');
    };
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                position: 'top',
            },
        }
    };

    // 1. Complaints by Status -> Pie Chart
    const statusCtx = createCanvas('statusCardBody', 'statusChart');
    if (statusCtx) {
        const pending = parseInt(document.getElementById('totalPending')?.textContent || '0');
        const inProgress = parseInt(document.getElementById('totalInProgress')?.textContent || '0');
        const resolved = parseInt(document.getElementById('totalResolved')?.textContent || '0');

        new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: ['Pending', 'In Progress', 'Resolved'],
                datasets: [{
                    label: 'Complaints by Status',
                    data: [pending, inProgress, resolved],
                    backgroundColor: [colors.yellow, colors.cyan, colors.green],
                    hoverOffset: 4
                }]
            },
            options: defaultOptions
        });
    }

    // --- Data Scraping from Table for Service and Location Charts ---
    const complaintsTable = document.getElementById('complaintsTable');
    if (complaintsTable) {
        const serviceCounts = {};
        const locationCounts = {};
        
        // Scrape data from the table (Service is 3rd col, Location is 5th col)
        complaintsTable.querySelectorAll('tbody tr').forEach(row => {
            const serviceCell = row.cells[2];
            const locationCell = row.cells[4];

            if (serviceCell) {
                const service = serviceCell.textContent.trim();
                serviceCounts[service] = (serviceCounts[service] || 0) + 1;
            }
            if (locationCell) {
                const location = locationCell.textContent.trim();
                locationCounts[location] = (locationCounts[location] || 0) + 1;
            }
        });

        // 2. Complaints by Service -> Bar Chart
        const serviceCtx = createCanvas('serviceCardBody', 'serviceChart');
        if (serviceCtx) {
            const serviceLabels = Object.keys(serviceCounts);
            const serviceData = Object.values(serviceCounts);

            new Chart(serviceCtx, {
                type: 'bar',
                data: {
                    labels: serviceLabels,
                    datasets: [{
                        label: 'Number of Complaints',
                        data: serviceData,
                        backgroundColor: colors.blue,
                    }]
                },
                options: {
                    ...defaultOptions,
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        // 3. Complaints by Location -> Horizontal Bar Chart
        const locationCtx = createCanvas('locationCardBody', 'locationChart');
        if (locationCtx) {
            const locationLabels = Object.keys(locationCounts);
            const locationData = Object.values(locationCounts);
            
            new Chart(locationCtx, {
                type: 'bar',
                data: {
                    labels: locationLabels,
                    datasets: [{
                        label: 'Number of Complaints',
                        data: locationData,
                        backgroundColor: colors.purple,
                    }]
                },
                options: {
                    ...defaultOptions,
                    indexAxis: 'y', // Horizontal bar chart
                    scales: { x: { beginAtZero: true } }
                }
            });
        }
    }
});