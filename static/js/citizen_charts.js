document.addEventListener('DOMContentLoaded', function() {
    // Complaints by Status Chart
    const statusChartCanvas = document.getElementById('statusChart');
    if (statusChartCanvas) {
        const statusData = JSON.parse(statusChartCanvas.dataset.status);
        const labels = Object.keys(statusData);
        const data = Object.values(statusData);

        new Chart(statusChartCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Complaints by Status',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
});
