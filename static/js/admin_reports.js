document.addEventListener('DOMContentLoaded', function () {
    // Complaints by Status
    const statusChartCanvas = document.getElementById('statusChart');
    if (statusChartCanvas) {
        const statusData = JSON.parse(statusChartCanvas.dataset.status);
        const labels = statusData.map(item => item.status);
        const data = statusData.map(item => item.count);
        new Chart(statusChartCanvas, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#ffc107', '#0dcaf0', '#198754', '#dc3545']
                }]
            }
        });
    }

    // Complaints by Service
    const serviceChartCanvas = document.getElementById('serviceChart');
    if(serviceChartCanvas) {
        const serviceData = JSON.parse(serviceChartCanvas.dataset.service);
        const labels = serviceData.map(item => item.service_name);
        const data = serviceData.map(item => item.count);
        new Chart(serviceChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Complaints',
                    data: data,
                    backgroundColor: '#0d6efd'
                }]
            }
        });
    }


    // Complaints Over Time
    const timeChartCanvas = document.getElementById('timeChart');
    if (timeChartCanvas) {
        const timeData = JSON.parse(timeChartCanvas.dataset.time);
        const labels = timeData.map(item => item.month);
        const data = timeData.map(item => item.count);
        new Chart(timeChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Complaints',
                    data: data,
                    borderColor: '#6f42c1',
                    fill: false,
                    tension: 0.1
                }]
            }
        });
    }

    // Complaints by Location
    const locationChartCanvas = document.getElementById('locationChart');
    if (locationChartCanvas) {
        const locationData = JSON.parse(locationChartCanvas.dataset.location);
        const labels = locationData.map(item => item.location);
        const data = locationData.map(item => item.count);
        new Chart(locationChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Complaints',
                    data: data,
                    backgroundColor: '#d63384'
                }]
            }
        });
    }

    // Average Resolution Time
    const resolutionChartCanvas = document.getElementById('resolutionChart');
    if(resolutionChartCanvas) {
        const resolutionData = JSON.parse(resolutionChartCanvas.dataset.resolution);
        const labels = resolutionData.map(item => item.service_name);
        const data = resolutionData.map(item => item.avg_resolution_time || 0);
        new Chart(resolutionChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Days',
                    data: data,
                    backgroundColor: '#fd7e14'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
