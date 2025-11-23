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
     * Checks if a canvas exists and creates it if it doesn't.
     * @param {string} cardBodyId The ID of the card-body div.
     * @param {string} chartId The ID for the new canvas.
     * @returns {CanvasRenderingContext2D|null} The 2D context or null.
     */
    const createCanvas = (cardBodyId, chartId) => {
        const cardBody = document.getElementById(cardBodyId);
        if (!cardBody) {
            console.error(`[ChartJS] Card body with ID #${cardBodyId} not found.`);
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
        },
        scales: {
            y: { beginAtZero: true },
            x: { grid: { display: false } }
        }
    };
    
    /**
     * Parses JSON data from a card body's data attribute safely.
     * @param {string} cardBodyId The ID of the card-body div.
     * @param {string} dataAttribute The name of the data attribute (e.g., 'status').
     * @returns {Array} The parsed data as an array, or an empty array if parsing fails or data is not an array.
     */
    const getChartData = (cardBodyId, dataAttribute) => {
        const cardBody = document.getElementById(cardBodyId);
        if (!cardBody || cardBody.dataset[dataAttribute] === undefined) {
            console.error(`[ChartJS] Data attribute 'data-${dataAttribute}' not found on #${cardBodyId}.`);
            return [];
        }
        try {
            const data = JSON.parse(cardBody.dataset[dataAttribute]);
            if (!Array.isArray(data)) {
                console.warn(`[ChartJS] Data for 'data-${dataAttribute}' is not an array.`, data);
                return [];
            }
            return data;
        } catch (e) {
            console.error(`[ChartJS] Failed to parse JSON from 'data-${dataAttribute}' on #${cardBodyId}.`, e);
            return [];
        }
    };

    // 1. Complaints by Status -> Donut Chart
    const statusCtx = createCanvas('reportStatusCardBody', 'reportStatusChart');
    if (statusCtx) {
        const statusData = getChartData('reportStatusCardBody', 'status');
        if (statusData.length > 0) {
            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: statusData.map(d => d.status),
                    datasets: [{
                        label: 'Complaints by Status',
                        data: statusData.map(d => d.count),
                        backgroundColor: [colors.yellow, colors.cyan, colors.green, colors.red],
                        hoverOffset: 4
                    }]
                },
                options: {...defaultOptions, scales: {}} // No scales for doughnut
            });
        }
    }

    // 2. Complaints by Service -> Bar Chart
    const serviceCtx = createCanvas('reportServiceCardBody', 'reportServiceChart');
    if (serviceCtx) {
        const serviceData = getChartData('reportServiceCardBody', 'service');
        if (serviceData.length > 0) {
            new Chart(serviceCtx, {
                type: 'bar',
                data: {
                    labels: serviceData.map(d => d.service_name),
                    datasets: [{
                        label: 'Number of Complaints',
                        data: serviceData.map(d => d.count),
                        backgroundColor: colors.blue,
                    }]
                },
                options: defaultOptions
            });
        }
    }
    
    // 3. Complaints Over Time -> Line Chart
    const timeCtx = createCanvas('reportTimeCardBody', 'reportTimeChart');
    if (timeCtx) {
        const timeData = getChartData('reportTimeCardBody', 'time');
        if (timeData.length > 0) {
            new Chart(timeCtx, {
                type: 'line',
                data: {
                    labels: timeData.map(d => d.month),
                    datasets: [{
                        label: 'Complaints per Month',
                        data: timeData.map(d => d.count),
                        borderColor: colors.purple,
                        backgroundColor: 'rgba(142, 36, 170, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: defaultOptions
            });
        }
    }
    
    // 4. Complaints by Location -> Bar Chart
    const locationCtx = createCanvas('reportLocationCardBody', 'reportLocationChart');
    if (locationCtx) {
        const locationData = getChartData('reportLocationCardBody', 'location');
        if (locationData.length > 0) {
            new Chart(locationCtx, {
                type: 'bar',
                data: {
                    labels: locationData.map(d => d.location),
                    datasets: [{
                        label: 'Number of Complaints',
                        data: locationData.map(d => d.count),
                        backgroundColor: colors.cyan,
                    }]
                },
                options: defaultOptions
            });
        }
    }
    
    // 5. Average Resolution Time -> Line Chart
    const resolutionCtx = createCanvas('reportResolutionCardBody', 'reportResolutionChart');
    if (resolutionCtx) {
        const resolutionData = getChartData('reportResolutionCardBody', 'resolution');
        if (resolutionData.length > 0) {
            new Chart(resolutionCtx, {
                type: 'line',
                data: {
                    labels: resolutionData.map(d => d.service_name),
                    datasets: [{
                        label: 'Average Resolution Time (Days)',
                        data: resolutionData.map(d => d.avg_resolution_time || 0),
                        borderColor: colors.orange,
                        backgroundColor: 'rgba(251, 140, 0, 0.1)',
                        fill: true,
                        stepped: false,
                    }]
                },
                options: defaultOptions
            });
        }
    }
});