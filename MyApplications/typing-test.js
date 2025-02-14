// DOM Elements
const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const timer = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const feedbackMessage = document.getElementById('feedback-message');

// Sample texts for typing
const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "A journey of a thousand miles begins with a single step.",
    "Actions speak louder than words.",
    "Practice makes perfect.",
    "Where there's a will, there's a way.",
    "Knowledge is power, but wisdom is divine.",
    "Time and tide wait for no man.",
    "Life is what happens while you're busy making other plans."
];

// Variables
let timeLeft = 60;
let timerInterval = null;
let currentText = '';
let startTime = null;
let totalTypedChars = 0;
let correctTypedChars = 0;
let isTestActive = false;

// Functions
function getRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

function displayText(text) {
    textDisplay.innerHTML = text.split('').map((char, index) => 
        `<span class="char" id="char-${index}">${char}</span>`
    ).join('');
}

function updateCharacterStatus(index, isCorrect) {
    const charElement = document.getElementById(`char-${index}`);
    if (!charElement) return;

    charElement.classList.remove('correct', 'incorrect', 'current');
    
    if (index === inputField.value.length) {
        charElement.classList.add('current');
    } else if (index < inputField.value.length) {
        charElement.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
}

function updateFeedback(isCorrect, message) {
    feedbackMessage.className = 'feedback-message ' + (isCorrect ? 'success' : 'error');
    feedbackMessage.textContent = message;
}

function calculateWPM() {
    if (!startTime || !isTestActive) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = totalTypedChars / 5; // standard word length
    return Math.round(wordsTyped / timeElapsed);
}

function calculateAccuracy() {
    if (totalTypedChars === 0) return 100;
    return Math.round((correctTypedChars / totalTypedChars) * 100);
}

function updateStats() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    wpmDisplay.textContent = `WPM: ${wpm}`;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function startTest() {
    timeLeft = 60;
    currentText = getRandomText();
    displayText(currentText);
    inputField.value = '';
    inputField.disabled = false;
    inputField.focus();
    startButton.disabled = true;
    resetButton.disabled = false;
    isTestActive = true;
    startTime = Date.now();
    totalTypedChars = 0;
    correctTypedChars = 0;
    feedbackMessage.textContent = '';
    startTimer();
}

function endTest() {
    clearInterval(timerInterval);
    inputField.disabled = true;
    isTestActive = false;
    updateStats();
    updateFeedback(true, `Test completed! WPM: ${calculateWPM()}, Accuracy: ${calculateAccuracy()}%`);
}

function resetTest() {
    clearInterval(timerInterval);
    timeLeft = 60;
    timer.textContent = 'Time: 60s';
    inputField.value = '';
    inputField.disabled = true;
    startButton.disabled = false;
    resetButton.disabled = true;
    isTestActive = false;
    feedbackMessage.textContent = '';
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 100%';
    displayText('');
}

// Event Listeners
startButton.addEventListener('click', startTest);
resetButton.addEventListener('click', resetTest);

inputField.addEventListener('input', (e) => {
    if (!isTestActive) return;

    const typedText = e.target.value;
    totalTypedChars = typedText.length;
    correctTypedChars = 0;

    // Update each character's status
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            const isCorrect = typedText[i] === currentText[i];
            if (isCorrect) correctTypedChars++;
            updateCharacterStatus(i, isCorrect);
        } else {
            updateCharacterStatus(i, null);
        }
    }

    // Update current character indicator
    if (typedText.length < currentText.length) {
        updateCharacterStatus(typedText.length, null);
    }

    // Real-time feedback
    if (typedText.length > 0) {
        const lastCharCorrect = typedText[typedText.length - 1] === currentText[typedText.length - 1];
        if (!lastCharCorrect) {
            updateFeedback(false, 'Incorrect character! Keep going!');
        } else {
            feedbackMessage.textContent = '';
        }
    }

    // Check if text is completed
    if (typedText === currentText) {
        updateFeedback(true, 'Perfect! Get ready for the next text!');
        setTimeout(() => {
            if (isTestActive) {
                currentText = getRandomText();
                displayText(currentText);
                inputField.value = '';
                feedbackMessage.textContent = '';
            }
        }, 1500);
    }

    updateStats();
});
