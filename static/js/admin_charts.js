document.addEventListener('DOMContentLoaded', function () {
    // Data passed from the template
    // statusData and serviceData are available globally in the template

    // 1. Complaints by Status: Doughnut Chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    const statusLabels = statusData.map(item => item[0]);
    const statusCounts = statusData.map(item => item[1]);

    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: statusLabels,
            datasets: [{
                label: 'Complaints by Status',
                data: statusCounts,
                backgroundColor: [
                    'rgba(255, 193, 7, 0.7)',  // Pending (Yellow)
                    'rgba(23, 162, 184, 0.7)', // In Progress (Blue)
                    'rgba(40, 167, 69, 0.7)'   // Resolved (Green)
                ],
                borderColor: [
                    'rgba(255, 193, 7, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(40, 167, 69, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Complaints by Status'
                }
            }
        }
    });

    // 2. Complaints by Service: Horizontal Bar Chart
    const serviceCtx = document.getElementById('serviceChart').getContext('2d');
    const serviceLabels = serviceData.map(item => item[0]);
    const serviceCounts = serviceData.map(item => item[1]);

    new Chart(serviceCtx, {
        type: 'bar',
        data: {
            labels: serviceLabels,
            datasets: [{
                label: 'Complaints by Service',
                data: serviceCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // This makes the bar chart horizontal
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Complaints by Service'
                }
            }
        }
    });

    // 3. Complaints by Service: Polar Area Chart
    const polarCtx = document.getElementById('polarChart').getContext('2d');
    
    new Chart(polarCtx, {
        type: 'polarArea',
        data: {
            labels: serviceLabels,
            datasets: [{
                label: 'Complaints Distribution',
                data: serviceCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Service Distribution'
                }
            }
        }
    });

    // 4. Complaints Over Time: Line Chart
    const timeCtx = document.getElementById('timeChart').getContext('2d');
    const timeLabels = timeData.map(item => item[0]);
    const timeCounts = timeData.map(item => item[1]);

    new Chart(timeCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Complaints per Month',
                data: timeCounts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Complaints Over Time'
                }
            }
        }
    });

    // 5. Complaints by Location: Bar Chart
    const locationCtx = document.getElementById('locationChart').getContext('2d');
    const locationLabels = locationData.map(item => item[0]);
    const locationCounts = locationData.map(item => item[1]);

    new Chart(locationCtx, {
        type: 'bar',
        data: {
            labels: locationLabels,
            datasets: [{
                label: 'Complaints by Location',
                data: locationCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.7)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Top Complaint Locations'
                }
            }
        }
    });

    // 6. Average Resolution Time: Bar Chart
    const resolutionTimeCtx = document.getElementById('resolutionTimeChart').getContext('2d');
    const resolutionTimeLabels = resolutionTimeData.map(item => item[0]);
    const resolutionTimeValues = resolutionTimeData.map(item => item[1]);

    new Chart(resolutionTimeCtx, {
        type: 'bar',
        data: {
            labels: resolutionTimeLabels,
            datasets: [{
                label: 'Average Resolution Time (Days)',
                data: resolutionTimeValues,
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Average Resolution Time by Service'
                }
            }
        }
    });
});