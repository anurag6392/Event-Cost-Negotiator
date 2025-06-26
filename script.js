document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('estimation-results');
    
    // Service pricing data
    const servicePrices = {
        venue: 5000,
        catering: 3000,
        decor: 2000,
        photography: 1500,
        entertainment: 2500
    };
    
    // Negotiation strategies
    const negotiationStrategies = [
        {
            name: "Package Discount",
            description: "Bundle multiple services for a 10% discount",
            condition: (selectedServices) => selectedServices.length >= 3,
            apply: (total) => total * 0.9,
            savings: (total) => total * 0.1,
            successRate: "High (80%)"
        },
        {
            name: "Seasonal Promotion",
            description: "Apply current seasonal discount of 8%",
            condition: () => true,
            apply: (total) => total * 0.92,
            savings: (total) => total * 0.08,
            successRate: "Medium (60%)"
        },
        {
            name: "Vendor Loyalty",
            description: "5% discount for choosing multiple services from preferred vendors",
            condition: (selectedServices) => selectedServices.length >= 2,
            apply: (total) => total * 0.95,
            savings: (total) => total * 0.05,
            successRate: "High (75%)"
        },
        {
            name: "Early Booking",
            description: "7% discount for booking 3+ months in advance",
            condition: () => Math.random() > 0.5, // Simulate random availability
            apply: (total) => total * 0.93,
            savings: (total) => total * 0.07,
            successRate: "Medium (50%)"
        }
    ];
    
    calculateBtn.addEventListener('click', function() {
        // Get selected services
        const selectedServices = Array.from(document.querySelectorAll('input[name="service"]:checked'))
            .map(service => service.value);
        
        // Get client budget
        const clientBudget = parseInt(document.getElementById('client-budget').value) || 0;
        
        if (selectedServices.length === 0) {
            alert('Please select at least one service');
            return;
        }
        
        // Show loading state
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cog fa-spin"></i>
                <p>Calculating costs and negotiating options...</p>
            </div>
        `;
        
        // Simulate processing delay
        setTimeout(() => {
            calculateCosts(selectedServices, clientBudget);
        }, 1500);
    });
    
    function calculateCosts(selectedServices, clientBudget) {
        // Calculate base cost
        let baseCost = 0;
        selectedServices.forEach(service => {
            baseCost += servicePrices[service];
        });
        
        // Apply event type multiplier (simulated)
        const eventTypeMultiplier = 1.1; // 10% premium
        let totalCost = baseCost * eventTypeMultiplier;
        
        // Apply negotiation strategies
        const applicableStrategies = negotiationStrategies.filter(strategy => 
            strategy.condition(selectedServices)
        );
        
        // Sort strategies by potential savings (descending)
        applicableStrategies.sort((a, b) => 
            b.savings(totalCost) - a.savings(totalCost)
        );
        
        // Generate results HTML
        let html = `
            <div class="estimate-card">
                <div class="estimate-header">
                    <span class="estimate-title">Estimated Cost</span>
                    <span class="estimate-price">$${totalCost.toLocaleString()}</span>
                </div>
                <div class="estimate-details">
                    <p>Base cost: $${baseCost.toLocaleString()}</p>
                    <p>Event premium: +10%</p>
                    <p>Your budget: $${clientBudget.toLocaleString()}</p>
                    <p class="${totalCost <= clientBudget ? 'success' : 'danger'}">
                        ${totalCost <= clientBudget ? 'Within budget!' : 'Over budget by $' + (totalCost - clientBudget).toLocaleString()}
                    </p>
                </div>
                
                <div class="negotiation-options">
                    <h3><i class="fas fa-comments-dollar"></i> Negotiation Options</h3>
        `;
        
        if (applicableStrategies.length > 0) {
            applicableStrategies.forEach(strategy => {
                const newTotal = strategy.apply(totalCost);
                const savings = strategy.savings(totalCost);
                
                html += `
                    <div class="negotiation-option">
                        <h4>${strategy.name}</h4>
                        <p>${strategy.description}</p>
                        <div class="negotiation-meta">
                            <span>New total: <strong>$${newTotal.toLocaleString()}</strong></span>
                            <span>Savings: <strong class="success">$${savings.toLocaleString()}</strong></span>
                        </div>
                        <div class="negotiation-meta">
                            <span>Success rate: ${strategy.successRate}</span>
                            <span class="${newTotal <= clientBudget ? 'success' : 'warning'}">
                                ${newTotal <= clientBudget ? 'Within budget!' : 'Still over budget'}
                            </span>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No negotiation options available for current selection</p>
                </div>
            `;
        }
        
        html += `</div></div>`;
        resultsDiv.innerHTML = html;
    }
});
