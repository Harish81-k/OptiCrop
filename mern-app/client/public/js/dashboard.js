document.addEventListener("DOMContentLoaded", function () {

    const pieCanvas = document.getElementById("pieChart");
    const barCanvas = document.getElementById("barChart");

    if (!pieCanvas || !barCanvas) {
        console.log("Charts not found.");
        return;
    }

    const labels = JSON.parse(pieCanvas.dataset.labels);
    const values = JSON.parse(pieCanvas.dataset.values);

    // Premium, minimalist agrotech palette matching your brand
    const colors = [
        "#1b4332", // Dark Forest Green
        "#40916c", // Muted Green
        "#74c69d", // Sage Green
        "#b7b7a4", // Earthy Gray/Olive
        "#d4a373", // Wheat / Warm Gold
        "#588157", // Fern Green
        "#a3b18a", // Soft Camo Green
        "#344e41", // Deep Seaweed
        "#f4a261", // Muted Terracotta Sand
        "#ccd5ae", // Pale Leaf
        "#e9c46a", // Soft Straw Yellow
        "#2d312e"  // Deep Charcoal
    ];

    const charcoalColor = "#2d312e";
    const borderColor = "#e1e4e2";

    // Global Chart.js Defaults adjustment for typography consistency
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        Chart.defaults.color = charcoalColor;
    }

    // -------------------------
    // PIE CHART
    // -------------------------
    new Chart(pieCanvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Crop Distribution",
                data: values,
                backgroundColor: colors,
                borderColor: "#ffffff", // Crisp separator lines
                borderWidth: 2,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            size: 13,
                            weight: "500"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: charcoalColor,
                    padding: 12,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${context.raw} Predictions`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });

    // -------------------------
    // BAR CHART
    // -------------------------
    new Chart(barCanvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Prediction Count",
                data: values,
                // Using a uniform dark green for an executive bar look, or fallback to variations
                backgroundColor: "#1b4332", 
                hoverBackgroundColor: "#40916c",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 4 // Slightly softer corners matching input structures
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: charcoalColor,
                    padding: 12,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.raw} Predictions`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: borderColor,
                        drawBorder: false
                    },
                    ticks: {
                        stepSize: 1,
                        color: "#6c757d",
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: "Metrics Yield (Count)",
                        color: charcoalColor,
                        font: {
                            size: 12,
                            weight: "500"
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // Clean vertical view
                    },
                    ticks: {
                        color: "#6c757d",
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: "Cultivar Target Profile",
                        color: charcoalColor,
                        font: {
                            size: 12,
                            weight: "500"
                        }
                    }
                }
            },
            animation: {
                duration: 1400,
                easing: "easeOutCubic"
            }
        }
    });

});