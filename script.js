const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const timer = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
    "Programming is the art of telling another human what one wants the computer to do. It's about thinking clearly and solving problems.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep moving forward and never give up.",
];

let timeLeft = 60;
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let currentText = '';

function getRandomText() {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
}

function calculateWPM(inputText, timeElapsed) {
    const words = inputText.trim().split(/\s+/).length;
    const minutes = timeElapsed / 60;
    return Math.round(words / minutes);
}

function calculateAccuracy(original, input) {
    if (input.length === 0) return 0;
    
    const originalWords = original.trim().split(/\s+/);
    const inputWords = input.trim().split(/\s+/);
    let correctWords = 0;

    inputWords.forEach((word, index) => {
        if (index < originalWords.length && word === originalWords[index]) {
            correctWords++;
        }
    });

    return Math.round((correctWords / inputWords.length) * 100);
}

function updateTimer() {
    timeLeft--;
    timer.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
        endTest();
    }
}

function updateDisplay() {
    const input = inputField.value;
    let displayHTML = '';
    
    for (let i = 0; i < currentText.length; i++) {
        if (i < input.length) {
            if (currentText[i] === input[i]) {
                displayHTML += `<span class="correct">${currentText[i]}</span>`;
            } else {
                displayHTML += `<span class="incorrect">${currentText[i]}</span>`;
            }
        } else {
            displayHTML += `<span class="remaining">${currentText[i]}</span>`;
        }
    }
    
    textDisplay.innerHTML = displayHTML;
}

function startTest() {
    currentText = getRandomText();
    textDisplay.innerHTML = currentText;
    inputField.value = '';
    inputField.disabled = false;
    inputField.focus();
    
    timeLeft = 60;
    startTime = new Date();
    isTestActive = true;
    
    timerInterval = setInterval(updateTimer, 1000);
    updateDisplay(); // Initial display update
    
    startButton.disabled = true;
    resetButton.disabled = false;
}

function endTest() {
    clearInterval(timerInterval);
    inputField.disabled = true;
    isTestActive = false;

    const timeElapsed = (new Date() - startTime) / 1000;
    const wpm = calculateWPM(inputField.value, timeElapsed);
    const accuracy = calculateAccuracy(currentText, inputField.value);

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
}

function resetTest() {
    clearInterval(timerInterval);
    timeLeft = 60;
    timer.textContent = 'Time: 60s';
    currentText = 'Click "Start Test" to begin';
    textDisplay.innerHTML = currentText;
    inputField.value = '';
    inputField.disabled = true;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '0';
    startButton.disabled = false;
    resetButton.disabled = true;
    isTestActive = false;
}

// Event Listeners
startButton.addEventListener('click', startTest);
resetButton.addEventListener('click', resetTest);

inputField.addEventListener('input', () => {
    if (isTestActive) {
        updateDisplay();
        const timeElapsed = (new Date() - startTime) / 1000;
        const wpm = calculateWPM(inputField.value, timeElapsed);
        const accuracy = calculateAccuracy(currentText, inputField.value);
        
        wpmDisplay.textContent = wpm;
        accuracyDisplay.textContent = accuracy;
    }
});

// Initial setup
resetTest();
