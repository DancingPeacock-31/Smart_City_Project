document.addEventListener('DOMContentLoaded', function() {
    // Complaints by Status Chart
    const statusChartCanvas = document.getElementById('statusChart');
    if (statusChartCanvas) {
        const statusData = JSON.parse(statusChartCanvas.dataset.status);
        const labels = statusData.map(item => item.status);
        const data = statusData.map(item => item.count);

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

    // Complaints by Service Chart
    const serviceChartCanvas = document.getElementById('serviceChart');
    if (serviceChartCanvas) {
        const serviceChartData = JSON.parse(serviceChartCanvas.dataset.service);
        const serviceChartLabels = JSON.parse(serviceChartCanvas.dataset.labels);

        new Chart(serviceChartCanvas, {
            type: 'bar',
            data: {
                labels: serviceChartLabels,
                datasets: [{
                    label: 'Complaints by Service',
                    data: serviceChartData,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Complaints by Location Chart
    const locationChartCanvas = document.getElementById('locationChart');
    if (locationChartCanvas) {
        const locationData = JSON.parse(locationChartCanvas.dataset.location);
        const labels = locationData.map(item => item.location);
        const data = locationData.map(item => item.count);

        new Chart(locationChartCanvas, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Complaints by Location',
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
