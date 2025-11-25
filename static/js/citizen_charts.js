document.addEventListener('DOMContentLoaded', function() {
    // Complaints by Status Chart
    const statusChartCanvas = document.getElementById('statusChart');
    if (statusChartCanvas) {
        const statusData = JSON.parse(statusChartCanvas.dataset.status);
        const labels = Object.keys(statusData);
        const data = Object.values(statusData);

        const colorMap = {
            'Pending': 'rgba(220, 53, 69, 0.8)',   // Red
            'In Progress': 'rgba(255, 193, 7, 0.8)', // Yellow
            'Resolved': 'rgba(40, 167, 69, 0.8)'     // Green
        };

        const backgroundColors = labels.map(label => colorMap[label] || 'rgba(201, 203, 207, 0.7)'); // Default to grey

        // Register the plugin
        Chart.register(ChartDataLabels);

        new Chart(statusChartCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Complaints by Status',
                    data: data,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold'
                        },
                        formatter: (value) => {
                            return value;
                        }
                    }
                }
            }
        });
    }
});
