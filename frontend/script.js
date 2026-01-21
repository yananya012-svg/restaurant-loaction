const API_URL = window.location.origin;
const form = document.getElementById('predictForm');
const resultContainer = document.getElementById('result');
const submitBtn = document.querySelector('.submit-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        city: parseInt(document.getElementById('city').value),
        locality: parseInt(document.getElementById('locality').value),
        cuisines: parseInt(document.getElementById('cuisines').value),
        aggregate_rating: parseFloat(document.getElementById('aggregate_rating').value),
        votes: parseInt(document.getElementById('votes').value)
    };

    submitBtn.disabled = true;
    resultContainer.innerHTML = `<div class="result-card-inner loading"><svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg><p class="result-label">Analyzing...</p><p class="result-text">Processing your request</p></div>`;

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            resultContainer.innerHTML = `<div class="result-card-inner success"><svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><p class="result-label">Predicted Price</p><div class="result-value">₹${result.predicted_price.toLocaleString('en-IN')}</div></div>`;
        } else {
            resultContainer.innerHTML = `<div class="result-card-inner error"><svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><p class="result-label">Error</p><p class="result-text">${result.detail || 'An error occurred'}</p></div>`;
        }
    } catch (error) {
        resultContainer.innerHTML = `<div class="result-card-inner error"><svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><p class="result-label">Connection Error</p><p class="result-text">${error.message}</p></div>`;
    } finally {
        submitBtn.disabled = false;
    }
});
