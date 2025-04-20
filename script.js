document.addEventListener('DOMContentLoaded', loadMeals);

function addMeal() {
    const mealInput = document.getElementById('mealInput').value;
    if (mealInput.trim() === '') return;

    const mealList = document.getElementById('mealList');
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" checked>
        <span>${mealInput}</span>
        <button onclick="removeMeal(this)"></button>
    `;
    mealList.appendChild(li);

    saveMeals();
    document.getElementById('mealInput').value = '';
}

function removeMeal(button) {
    const li = button.parentElement;
    li.remove();
    saveMeals();
}

function selectRandomMeal() {
    const mealList = document.getElementById('mealList').children;
    const selectedMeals = [];
    for (let meal of mealList) {
        if (meal.querySelector('input[type="checkbox"]').checked) {
            selectedMeals.push(meal.querySelector('span').textContent);
        }
    }
    if (selectedMeals.length === 0) {
        document.getElementById('result').textContent = 'No meals selected!';
        return;
    }

    let result = document.getElementById('result');
    result.textContent = 'Picking...';
    let counter = 0;
    let interval = setInterval(() => {
        result.textContent = `Tonight's dinner is: ${selectedMeals[counter % selectedMeals.length]}`;
        playTone(200, 0.1); // Play a short click sound
        counter++;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * selectedMeals.length);
        result.textContent = `Tonight's dinner is: ${selectedMeals[randomIndex]}`;
        playTone(500, 0.5); // Play a victory sound
    }, 3000);
}

function playTone(frequency, duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
}

function saveMeals() {
    const mealList = document.getElementById('mealList').children;
    const meals = [];
    for (let meal of mealList) {
        meals.push({
            text: meal.querySelector('span').textContent,
            checked: meal.querySelector('input[type="checkbox"]').checked
        });
    }
    localStorage.setItem('meals', JSON.stringify(meals));
}

function loadMeals() {
    const meals = JSON.parse(localStorage.getItem('meals')) || [];
    const mealList = document.getElementById('mealList');
    for (let meal of meals) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${meal.checked ? 'checked' : ''}>
            <span>${meal.text}</span>
            <button onclick="removeMeal(this)"></button>
        `;
        mealList.appendChild(li);
    }
}
