const API_URL = window.location.origin;
const predictForm = document.getElementById('predictForm');
const resultContainer = document.getElementById('result');
const submitBtn = document.querySelector('.submit-btn');

predictForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        city: parseInt(document.getElementById('city').value),
        locality: parseInt(document.getElementById('locality').value),
        cuisines: parseInt(document.getElementById('cuisines').value),
        aggregate_rating: parseFloat(document.getElementById('aggregate_rating').value),
        votes: parseInt(document.getElementById('votes').value)
    };

    // Show loading state
    submitBtn.disabled = true;
    resultContainer.innerHTML = `
        <div class="result-message result-loading">
            <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
            </svg>
            <span>Predicting price...</span>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            resultContainer.innerHTML = `
                <div class="result-message result-success">
                    <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                        <div style="font-size: 12px; opacity: 0.9;">Predicted Price</div>
                        <div class="price-value">₹${result.predicted_price}</div>
                    </div>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `
                <div class="result-message result-error">
                    <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <span>${result.detail || 'An error occurred'}</span>
                </div>
            `;
        }
    } catch (error) {
        resultContainer.innerHTML = `
            <div class="result-message result-error">
                <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>Error: ${error.message}</span>
            </div>
        `;
    } finally {
        submitBtn.disabled = false;
    }
});
