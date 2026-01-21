const API_URL = window.location.origin;

document.getElementById('predictForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        city: parseInt(document.getElementById('city').value),
        locality: parseInt(document.getElementById('locality').value),
        cuisines: parseInt(document.getElementById('cuisines').value),
        aggregate_rating: parseFloat(document.getElementById('aggregate_rating').value),
        votes: parseInt(document.getElementById('votes').value)
    };

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
            document.getElementById('result').innerHTML = 
                `<p class="success">Predicted Price: ${result.predicted_price}</p>`;
        } else {
            document.getElementById('result').innerHTML = 
                `<p class="error">Error: ${result.detail}</p>`;
        }
    } catch (error) {
        document.getElementById('result').innerHTML = 
            `<p class="error">Error: ${error.message}</p>`;
    }
});
