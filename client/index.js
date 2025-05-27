import { initializeAudio, flipSound, boopSound, chimeSound } from './audio.js';

import {
    LESSON_WORDS,
    NUM_WORDS_TO_DISPLAY,
    LESSON_WEIGHTS,
    LESSON_SENTENCES,
    NUM_SENTENCES_TO_DISPLAY,
    SHORT_SENTENCE_THRESHOLD,
    PASTEL_COLORS,
    WORD_CARD_BACKGROUND_COLOR
} from './constants.js';

const SCREEN_COLORS = {
    panelBackground: 'rgba(255, 240, 150, 0.95)', // Soft Yellow
    panelBorder: '#FFA500', // Orange
    titleText: '#D9534F', // Friendly red/orange
    buttonBackground: '#5CB85C', // Green
    buttonBorder: '#4CAE4C', // Darker Green
    buttonText: '#FFFFFF', // White
    endButtonBackground: '#FF8C00', // Dark Orange for "Play Again"
    endButtonBorder: '#CD6600' // Darker Orange
};

// --- Global State ---
let currentSelectedLessonId = "all_random";
let currentSelectedLessonName = "所有课程 (随机)";
let isCardEffectAnimating = false; // Flag to prevent spamming card effects
let currentActiveMode = 'learn'; // 'learn' or 'play'

const GAME_STATES = {
    READY: 'READY',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    END: 'END'
};
let currentGameState = GAME_STATES.READY;
let startButtonRect = null; // To store dimensions and position of the start button
let pauseButtonRect = null; // To store dimensions and position of the pause button
let playAgainButtonRect = null; // To store dimensions and position of the play again button
let gameTimer = null;
let remainingTime = 0; // in seconds
const GAME_DURATION = 5; // 5 seconds

// --- DOM Elements ---
let lessonSelectorTrigger;
let currentLessonNameDisplay;
let lessonGridPopup;
let lessonGridPopupContent;
let popupOverlay;
let refreshButton;
let pageRefreshOverlay; 
let learnModeButton;
let playModeButton;
let learnContentArea;
let miniGameSection;
let gameCanvas; // Added for the mini-game

// --- Helper Functions ---
function getRandomElements(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getWeightedRandomElements(lessonDataSource, itemKey, count, weightMap) {
    const weightedList = [];
    lessonDataSource.forEach(lessonEntry => {
        const items = lessonEntry[itemKey];
        if (items && Array.isArray(items)) {
            let currentWeight = parseInt(String(weightMap[lessonEntry.lesson.toString()]), 10);
            if (isNaN(currentWeight) || currentWeight < 0) {
                currentWeight = 0;
            }
            if (currentWeight > 0) {
                for (let i = 0; i < currentWeight; i++) {
                    weightedList.push(...items);
                }
            }
        }
    });

    if (weightedList.length === 0) {
        return [];
    }

    // Fisher-Yates shuffle on the weighted list
    for (let i = weightedList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [weightedList[i], weightedList[j]] = [weightedList[j], weightedList[i]];
    }

    const result = [];
    const selectedItemsSet = new Set();
    for (const item of weightedList) {
        if (result.length >= count) break;
        if (!selectedItemsSet.has(item)) { // Ensure uniqueness
            result.push(item);
            selectedItemsSet.add(item);
        }
    }
    return result;
}

// --- Title Bar Setup ---
function setupTitleBar() { /* Static HTML, no JS needed here unless dynamic title changes are required */ }

// --- Word Section (Flip Animation Cards) ---
function createWordCard(word, index) {
    const card = document.createElement('div');
    card.className = 'flip-card'; card.setAttribute('role', 'button'); card.setAttribute('tabindex', '0');
    const cardInner = document.createElement('div'); cardInner.className = 'flip-card-inner';
    const cardFront = document.createElement('div'); cardFront.className = 'flip-card-front'; cardFront.textContent = word;
    const cardBack = document.createElement('div'); cardBack.className = 'flip-card-back';
    cardBack.style.backgroundColor = PASTEL_COLORS[index % PASTEL_COLORS.length];
    const rainbowIconSVG = `<svg viewBox="0 0 32 17" class="mini-rainbow-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>Mini Rainbow</title><path d="M2 15 A 14 14 0 0 1 30 15" stroke="#FF0000" stroke-width="3" fill="none"/><path d="M5 15 A 11 11 0 0 1 27 15" stroke="#FFA500" stroke-width="3" fill="none"/><path d="M8 15 A 8 8 0 0 1 24 15" stroke="#FFFF00" stroke-width="3" fill="none"/><path d="M11 15 A 5 5 0 0 1 21 15" stroke="#008000" stroke-width="3" fill="none"/></svg>`;
    cardBack.innerHTML = rainbowIconSVG;
    card.setAttribute('aria-label', `Word card, back shown. Click to flip and reveal ${word}.`);
    cardInner.appendChild(cardFront); cardInner.appendChild(cardBack); card.appendChild(cardInner);

    card.addEventListener('click', () => {
        if (!card.classList.contains('flipped')) {
            if (typeof Tone !== 'undefined' && Tone.context && Tone.context.state === 'running' && flipSound) {
                flipSound.triggerAttackRelease("C5", "16n", Tone.now());
            }
            card.classList.add('flipped');
            card.setAttribute('aria-label', `Word: ${word}.`);
            card.style.cursor = 'default';
        } else {
            if (isCardEffectAnimating) return;

            isCardEffectAnimating = true;
            const effectDuration = 600;
            const randomEffect = Math.random() < 0.5 ? 'wiggle' : 'sparkle';

            if (randomEffect === 'wiggle') {
                if (typeof Tone !== 'undefined' && Tone.context && Tone.context.state === 'running' && boopSound) {
                    boopSound.triggerAttackRelease("C6", "32n", Tone.now());
                }
                card.classList.add('card-wiggle');
                setTimeout(() => {
                    card.classList.remove('card-wiggle');
                    isCardEffectAnimating = false;
                }, effectDuration);
            } else {
                if (typeof Tone !== 'undefined' && Tone.context && Tone.context.state === 'running' && chimeSound) {
                    chimeSound.triggerAttackRelease("A5", "16n", Tone.now());
                }
                card.classList.add('sparkling');
                setTimeout(() => {
                    card.classList.remove('sparkling');
                    isCardEffectAnimating = false;
                }, effectDuration);
            }
        }
    });

    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            card.click();
        }
    });
    return card;
}

function populateWordSection(wordsToDisplay) {
    const wordGrid = document.getElementById('word-grid');
    if (!wordGrid) { console.error("populateWordSection - #word-grid NOT found."); return; }
    wordGrid.innerHTML = '';
    if (!wordsToDisplay || wordsToDisplay.length === 0) {
        wordGrid.textContent = "请选择课程或当前权重设置下没有可显示的词语。"; return;
    }
    wordsToDisplay.forEach((word, index) => { wordGrid.appendChild(createWordCard(word, index)); });
}

// --- Sentence Section (Scratch-Off) ---
function createSentenceScratchOff(sentence, index) {
    const container = document.createElement('div'); container.className = 'sentence-container relative';
    const textElement = document.createElement('p'); textElement.className = 'sentence-text-underneath'; textElement.textContent = sentence;
    container.appendChild(textElement);
    const canvas = document.createElement('canvas'); canvas.className = 'sentence-canvas';
    container.appendChild(canvas);
    setTimeout(() => setupScratchCanvas(canvas, textElement, container), 0);
    return container;
}

function setupScratchCanvas(canvas, textElement, sentenceContainer) {
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.error("setupScratchCanvas - Canvas context not available."); return; }
    if (!sentenceContainer || sentenceContainer.clientWidth === 0 || sentenceContainer.clientHeight === 0) {
        setTimeout(() => setupScratchCanvas(canvas, textElement, sentenceContainer), 50);
        return;
    }
    canvas.width = sentenceContainer.clientWidth;
    canvas.height = sentenceContainer.clientHeight;

    textElement.style.visibility = 'visible';
    ctx.fillStyle = '#C0C0C0'; // Scratchable layer color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let isScratching = false;
    let backgroundChanged = false;
    const scratchRadius = Math.max(15, canvas.width / 20);

    function getScratchPosition(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        let x, y;
        if (event instanceof TouchEvent && event.touches && event.touches[0]) {
            x = (event.touches[0].clientX - rect.left) * scaleX;
            y = (event.touches[0].clientY - rect.top) * scaleY;
        } else if (event instanceof MouseEvent) {
            x = (event.clientX - rect.left) * scaleX;
            y = (event.clientY - rect.top) * scaleY;
        } else {
            x = 0; y = 0;
        }
        return { x, y };
    }

    function scratch(e) {
        if (!isScratching) return;
        e.preventDefault();
        if (!backgroundChanged) {
            sentenceContainer.style.backgroundColor = WORD_CARD_BACKGROUND_COLOR;
            backgroundChanged = true;
        }
        const { x, y } = getScratchPosition(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, scratchRadius, 0, Math.PI * 2, false);
        ctx.fill();
    }

    const startScratching = (e) => { isScratching = true; scratch(e); };
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('touchstart', startScratching, { passive: false });
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', scratch, { passive: false });
    const stopScratching = () => { isScratching = false; };
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('mouseleave', stopScratching);
    canvas.addEventListener('touchend', stopScratching);
    canvas.addEventListener('touchcancel', stopScratching);
}

function populateSentenceSection(sentencesToDisplay) {
    const sentenceList = document.getElementById('sentence-list');
    if (!sentenceList) { console.error("populateSentenceSection - #sentence-list NOT found."); return; }
    sentenceList.innerHTML = '';
    if (!sentencesToDisplay || sentencesToDisplay.length === 0) {
        sentenceList.textContent = "请选择课程或当前权重设置下没有可显示的句子。"; return;
    }
    sentencesToDisplay.forEach((sentence, index) => { sentenceList.appendChild(createSentenceScratchOff(sentence, index)); });
}

// --- Lesson Selection Logic (Popup Grid) ---
function updateCurrentLessonDisplay() {
    if (currentLessonNameDisplay) {
        currentLessonNameDisplay.textContent = currentSelectedLessonName;
    }
}

function toggleLessonGridPopup() {
    if (!lessonGridPopup || !popupOverlay || !lessonSelectorTrigger) return;
    const isActive = lessonGridPopup.classList.contains('active');
    if (isActive) {
        lessonGridPopup.classList.remove('active');
        popupOverlay.classList.remove('active');
        lessonSelectorTrigger.classList.remove('popup-open');
        lessonSelectorTrigger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', handleClickOutsidePopup);
    } else {
        populateLessonGridPopupContent();
        lessonGridPopup.classList.add('active');
        popupOverlay.classList.add('active');
        lessonSelectorTrigger.classList.add('popup-open');
        lessonSelectorTrigger.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
            document.addEventListener('click', handleClickOutsidePopup);
        }, 0);
    }
}

function handleClickOutsidePopup(event) {
    if (lessonGridPopup && !lessonGridPopup.contains(event.target) && event.target !== lessonSelectorTrigger && (!lessonSelectorTrigger || !lessonSelectorTrigger.contains(event.target))) {
        toggleLessonGridPopup();
    }
}

function populateLessonGridPopupContent() {
    if (!lessonGridPopupContent) return;
    lessonGridPopupContent.innerHTML = '';

    const allRandomButton = document.createElement('button');
    allRandomButton.className = 'lesson-popup-button';
    allRandomButton.textContent = "所有课程 (随机)";
    if (currentSelectedLessonId === "all_random") {
        allRandomButton.classList.add('current');
    }
    allRandomButton.addEventListener('click', () => handleLessonGridButtonClick("all_random", "所有课程 (随机)"));
    lessonGridPopupContent.appendChild(allRandomButton);

    LESSON_WORDS.forEach(lesson => {
        const button = document.createElement('button');
        button.className = 'lesson-popup-button';
        button.textContent = lesson.name;
        if (lesson.lesson.toString() === currentSelectedLessonId) {
            button.classList.add('current');
        }
        button.addEventListener('click', () => handleLessonGridButtonClick(lesson.lesson.toString(), lesson.name));
        lessonGridPopupContent.appendChild(button);
    });
}

function handleLessonGridButtonClick(lessonId, lessonName) {
    currentSelectedLessonId = lessonId;
    currentSelectedLessonName = lessonName;

    loadLessonContent(currentSelectedLessonId);
    updateCurrentLessonDisplay();
    toggleLessonGridPopup();
}

function loadLessonContent(selectedLessonId) {
    // This function only loads content for the "learn" mode.
    // If "play" mode is active, the content will be loaded but not visible.
    let wordsForDisplay;
    let sentencesForDisplay;
    let potentialExtraSentence = undefined;
    const baseSentencesToFetch = NUM_SENTENCES_TO_DISPLAY;

    if (selectedLessonId === "all_random") {
        wordsForDisplay = getWeightedRandomElements(LESSON_WORDS, 'words', NUM_WORDS_TO_DISPLAY, LESSON_WEIGHTS);
    } else {
        const selectedLessonWordsData = LESSON_WORDS.find(l => l.lesson.toString() === selectedLessonId);
        wordsForDisplay = selectedLessonWordsData ? getRandomElements(selectedLessonWordsData.words, NUM_WORDS_TO_DISPLAY) : [];
    }

    if (selectedLessonId === "all_random") {
        const randomSentences = getWeightedRandomElements(LESSON_SENTENCES, 'sentences', baseSentencesToFetch + 1, LESSON_WEIGHTS);
        sentencesForDisplay = randomSentences.slice(0, baseSentencesToFetch);
        if (randomSentences.length > baseSentencesToFetch) {
            potentialExtraSentence = randomSentences[baseSentencesToFetch];
        }
    } else {
        const selectedLessonSentencesData = LESSON_SENTENCES.find(l => l.lesson.toString() === selectedLessonId);
        if (selectedLessonSentencesData && selectedLessonSentencesData.sentences) {
            const allLessonSentences = [...selectedLessonSentencesData.sentences];
            sentencesForDisplay = getRandomElements(allLessonSentences, baseSentencesToFetch);
            if (allLessonSentences.length > sentencesForDisplay.length) {
                 const remainingSentences = allLessonSentences.filter(s => !sentencesForDisplay.includes(s));
                 if (remainingSentences.length > 0) {
                    potentialExtraSentence = getRandomElements(remainingSentences, 1)[0];
                 }
            }
        } else {
            sentencesForDisplay = [];
        }
    }

    if (sentencesForDisplay && sentencesForDisplay.length === baseSentencesToFetch) {
        const allShort = sentencesForDisplay.every(s => s.length <= SHORT_SENTENCE_THRESHOLD);
        if (allShort && potentialExtraSentence) {
            if (!sentencesForDisplay.includes(potentialExtraSentence)) {
                 sentencesForDisplay.push(potentialExtraSentence);
            }
        }
    }
    if (sentencesForDisplay && sentencesForDisplay.length > baseSentencesToFetch + 1) {
        sentencesForDisplay = sentencesForDisplay.slice(0, baseSentencesToFetch + 1);
    }

    populateWordSection(wordsForDisplay);
    populateSentenceSection(sentencesForDisplay);
}

// --- Mode Switcher Logic ---
function switchMode(newMode) {
    currentActiveMode = newMode;

    if (!learnModeButton || !playModeButton || !learnContentArea || !miniGameSection) {
        console.error("switchMode - One or more mode-related DOM elements not found.");
        return;
    }

    if (newMode === 'learn') {
        learnModeButton.classList.add('active-mode');
        learnModeButton.setAttribute('aria-pressed', 'true');
        playModeButton.classList.remove('active-mode');
        playModeButton.setAttribute('aria-pressed', 'false');

        learnContentArea.classList.remove('hidden-view');
        miniGameSection.classList.add('hidden-view');
    } else if (newMode === 'play') {
        playModeButton.classList.add('active-mode');
        playModeButton.setAttribute('aria-pressed', 'true');
        learnModeButton.classList.remove('active-mode');
        learnModeButton.setAttribute('aria-pressed', 'false');
        
        miniGameSection.classList.remove('hidden-view');
        learnContentArea.classList.add('hidden-view');
        setGameState(GAME_STATES.READY); // Explicitly set to READY
        // drawMiniGame(gameCanvas); // This will be called by setGameState
    }
}

// --- Game State Management ---
function setGameState(newState) {
    if (currentGameState === newState) return; // Avoid redundant updates

    const oldState = currentGameState;
    currentGameState = newState;
    console.log(`Game state changed from ${oldState} to: ${newState}`);

    // If the game is active, trigger a redraw.
    // The drawMiniGame function will handle drawing based on the new currentGameState.
    if (currentActiveMode === 'play' && gameCanvas) {
        drawMiniGame(gameCanvas); // Initial draw for the new state
    }

    // Game timer logic based on state transitions
    if (newState === GAME_STATES.RUNNING && oldState === GAME_STATES.READY) {
        remainingTime = GAME_DURATION;
        startGameTimer();
    } else if (newState === GAME_STATES.RUNNING && oldState === GAME_STATES.PAUSED) { // Resuming
        startGameTimer();
    } else if (newState === GAME_STATES.PAUSED || newState === GAME_STATES.END) {
        stopGameTimer();
    }
}

// --- Game Timer Functions ---
function startGameTimer() {
    stopGameTimer(); // Clear any existing timer before starting a new one
    gameTimer = setInterval(() => {
        if (currentGameState === GAME_STATES.RUNNING) { // Only decrement if running
            remainingTime--;
            if (remainingTime <= 0) {
                remainingTime = 0; // Ensure it doesn't go negative
                setGameState(GAME_STATES.END);
                return; // Exit interval callback as setGameState(END) will handle drawing
            }
            // Redraw to update timer display and other game elements if still RUNNING
            if (gameCanvas && currentActiveMode === 'play' && currentGameState === GAME_STATES.RUNNING) {
                 drawMiniGame(gameCanvas);
            }
        }
    }, 1000);
}

function stopGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

// --- Drawing Functions for Timer and End State ---
function drawTimerDisplay(ctx, canvas) {
    if (!ctx || !canvas) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = `bold ${canvas.width * 0.04}px "Ma Shan Zheng", "KaiTi", sans-serif`; // Responsive font size
    ctx.textAlign = 'center'; // Align to center for top-center position
    const timerText = `时间: ${remainingTime}s`; // "Time: Xs"
    // Position at top-center, with a small margin from the top
    ctx.fillText(timerText, canvas.width / 2, canvas.height * 0.05); 
    ctx.textAlign = 'left'; // Reset alignment for other functions
}

function drawGameStateIndicator(ctx, canvas) {
    if (!ctx || !canvas) return;
    // Using a more theme-appropriate color and font
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Dark semi-transparent
    ctx.font = '16px "Ma Shan Zheng", "KaiTi", sans-serif'; // Theme-appropriate font
    ctx.textAlign = 'left'; // Reset alignment
    
    const margin = 10;
    const textToDraw = `状态: ${currentGameState}`; // Using Chinese for "State"

    // Optional: background for readability
    const textMetrics = ctx.measureText(textToDraw);
    const textWidth = textMetrics.width;
    // Approximate height based on font size (reliable enough for this purpose)
    const textHeight = parseInt(ctx.font, 10) || 16; 
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // Semi-transparent white background
    // Adjusted padding for the background box
    ctx.fillRect(margin - 5, canvas.height - margin - textHeight - 2, textWidth + 10, textHeight + 7); 

    ctx.fillStyle = '#333333'; // Dark gray for text, better contrast on light background
    ctx.fillText(textToDraw, margin, canvas.height - margin - 2); // Adjusted Y for text baseline
}

// --- Core Drawing Logic ---
function drawMonsterAndScene(ctx, canvas) {
    // Proportional dimensions (copied from original drawMiniGame)
    const groundHeight = canvas.height * 0.1;
    const grassBladeHeight = groundHeight * 0.2; // Base height, will be varied
    const grassBladeWidth = Math.max(2, canvas.width * 0.01);
    const grassBladeSpacing = canvas.width * 0.015; // Adjusted spacing for potentially wider/varied blades
    const monsterWidth = canvas.width * 0.12;
    const monsterHeight = canvas.height * 0.20;
    const monsterX = (canvas.width - monsterWidth) / 2;
    const monsterY = canvas.height - groundHeight - monsterHeight;
    const monsterCornerRadius = monsterWidth * 0.45; // Increased for rounder body
    const eyeRadius = Math.max(3, monsterWidth * 0.15); // Increased eye radius
    const eyeOffsetX = monsterWidth * 0.3;
    const eyeOffsetY = monsterHeight * 0.33; // Adjusted Y position slightly for larger eyes if needed
    const smileLineWidth = Math.max(2, monsterWidth * 0.07); // Increased smile line width
    const smileRadius = monsterWidth * 0.25; // May need adjustment
    const smileCenterYOffset = monsterHeight * 0.15; // May need adjustment

    // Draw Ground
    ctx.fillStyle = '#8B4513'; // SaddleBrown
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    // Draw Grass
    ctx.fillStyle = '#7CFC00'; // LawnGreen
    for (let i = 0; i < canvas.width; i += (grassBladeWidth + grassBladeSpacing)) {
        // Draw slightly tapered or rounded blades
        const bladeBaseY = canvas.height - groundHeight;
        const bladeTopY = bladeBaseY - grassBladeHeight * (0.8 + Math.random() * 0.4); // Vary height
        const bladeTopWidth = grassBladeWidth * 0.6;
        const bladeBaseX = i;
        
        ctx.beginPath();
        ctx.moveTo(bladeBaseX, bladeBaseY);
        ctx.lineTo(bladeBaseX + grassBladeWidth, bladeBaseY);
        ctx.lineTo(bladeBaseX + grassBladeWidth - (grassBladeWidth - bladeTopWidth) / 2, bladeTopY);
        ctx.lineTo(bladeBaseX + (grassBladeWidth - bladeTopWidth) / 2, bladeTopY);
        ctx.closePath();
        ctx.fill();
    }

    // Draw Monster Body
    ctx.fillStyle = '#87CEFA'; // LightSkyBlue
    ctx.beginPath();
    ctx.moveTo(monsterX + monsterCornerRadius, monsterY);
    ctx.lineTo(monsterX + monsterWidth - monsterCornerRadius, monsterY);
    ctx.quadraticCurveTo(monsterX + monsterWidth, monsterY, monsterX + monsterWidth, monsterY + monsterCornerRadius);
    ctx.lineTo(monsterX + monsterWidth, monsterY + monsterHeight - monsterCornerRadius);
    ctx.quadraticCurveTo(monsterX + monsterWidth, monsterY + monsterHeight, monsterX + monsterWidth - monsterCornerRadius, monsterY + monsterHeight);
    ctx.lineTo(monsterX + monsterCornerRadius, monsterY + monsterHeight);
    ctx.quadraticCurveTo(monsterX, monsterY + monsterHeight, monsterX, monsterY + monsterHeight - monsterCornerRadius);
    ctx.lineTo(monsterX, monsterY + monsterCornerRadius);
    ctx.quadraticCurveTo(monsterX, monsterY, monsterX + monsterCornerRadius, monsterY);
    ctx.closePath();
    ctx.fill();

    // Draw Monster Eyes
    ctx.fillStyle = '#FFFFFF'; // White
    ctx.beginPath();
    ctx.arc(monsterX + eyeOffsetX, monsterY + eyeOffsetY, eyeRadius, 0, Math.PI * 2, true);
    ctx.fill();

    // Pupil for the first eye
    let pupilRadius = eyeRadius * 0.5;
    let pupilX = monsterX + eyeOffsetX;
    let pupilY = monsterY + eyeOffsetY;
    ctx.fillStyle = '#000000'; // Black for pupil
    ctx.beginPath();
    ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2, true);
    ctx.fill();
    // Tiny highlight for the first eye
    ctx.fillStyle = '#FFFFFF'; // White for highlight
    ctx.beginPath();
    ctx.arc(pupilX + pupilRadius * 0.3, pupilY - pupilRadius * 0.3, pupilRadius * 0.3, 0, Math.PI * 2, true);
    ctx.fill();

    // Original white part of the second eye
    ctx.fillStyle = '#FFFFFF'; // White
    ctx.beginPath();
    ctx.arc(monsterX + monsterWidth - eyeOffsetX, monsterY + eyeOffsetY, eyeRadius, 0, Math.PI * 2, true);
    ctx.fill();
    
    // Pupil for the second eye
    pupilX = monsterX + monsterWidth - eyeOffsetX; // Update pupilX for the second eye
    // pupilY remains the same
    ctx.fillStyle = '#000000'; // Black for pupil
    ctx.beginPath();
    ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2, true);
    ctx.fill();
    // Tiny highlight for the second eye
    ctx.fillStyle = '#FFFFFF'; // White for highlight
    ctx.beginPath();
    ctx.arc(pupilX + pupilRadius * 0.3, pupilY - pupilRadius * 0.3, pupilRadius * 0.3, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw Monster Smile
    ctx.strokeStyle = '#FFFFFF'; // White stroke for smile
    ctx.lineWidth = smileLineWidth;
    ctx.beginPath();
    ctx.arc(monsterX + monsterWidth / 2, monsterY + monsterHeight / 2 + smileCenterYOffset, smileRadius, 0, Math.PI, false);
    ctx.stroke();
}

function drawReadyScreen(ctx, canvas) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Keep the semi-transparent overlay for focus
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Panel dimensions
    const panelWidth = canvas.width * 0.7;
    const panelHeight = canvas.height * 0.6;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    const cornerRadius = 20;

    // Draw panel
    ctx.fillStyle = SCREEN_COLORS.panelBackground;
    ctx.strokeStyle = SCREEN_COLORS.panelBorder;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(panelX + cornerRadius, panelY);
    ctx.lineTo(panelX + panelWidth - cornerRadius, panelY);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY, panelX + panelWidth, panelY + cornerRadius);
    ctx.lineTo(panelX + panelWidth, panelY + panelHeight - cornerRadius);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY + panelHeight, panelX + panelWidth - cornerRadius, panelY + panelHeight);
    ctx.lineTo(panelX + cornerRadius, panelY + panelHeight);
    ctx.quadraticCurveTo(panelX, panelY + panelHeight, panelX, panelY + panelHeight - cornerRadius);
    ctx.lineTo(panelX, panelY + cornerRadius);
    ctx.quadraticCurveTo(panelX, panelY, panelX + cornerRadius, panelY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Title
    const titleText = '喂饱小怪兽';
    ctx.font = `bold ${canvas.width * 0.06}px "Ma Shan Zheng", "KaiTi", sans-serif`;
    ctx.fillStyle = SCREEN_COLORS.titleText;
    ctx.textAlign = 'center';
    ctx.fillText(titleText, canvas.width / 2, panelY + panelHeight * 0.25);

    // Start Button
    const buttonText = '开始';
    const buttonWidth = panelWidth * 0.5;
    const buttonHeight = panelHeight * 0.2;
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = panelY + panelHeight * 0.55; // Positioned lower in the panel
    const buttonCornerRadius = 10;

    // Store button dimensions for click detection
    startButtonRect = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };

    ctx.fillStyle = SCREEN_COLORS.buttonBackground;
    ctx.strokeStyle = SCREEN_COLORS.buttonBorder;
    ctx.lineWidth = 3;
    // Draw button background
    ctx.beginPath();
    ctx.moveTo(buttonX + buttonCornerRadius, buttonY);
    ctx.lineTo(buttonX + buttonWidth - buttonCornerRadius, buttonY);
    ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + buttonCornerRadius);
    ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - buttonCornerRadius);
    ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - buttonCornerRadius, buttonY + buttonHeight);
    ctx.lineTo(buttonX + buttonCornerRadius, buttonY + buttonHeight);
    ctx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - buttonCornerRadius);
    ctx.lineTo(buttonX, buttonY + buttonCornerRadius);
    ctx.quadraticCurveTo(buttonX, buttonY, buttonX + buttonCornerRadius, buttonY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Button text
    ctx.font = `bold ${buttonHeight * 0.5}px "Ma Shan Zheng", "KaiTi", sans-serif`;
    ctx.fillStyle = SCREEN_COLORS.buttonText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(buttonText, buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    ctx.textBaseline = 'alphabetic'; // Reset baseline
}

function drawPauseButton(ctx, canvas) {
    const padding = canvas.width * 0.02; // Use a relative padding
    const buttonSize = Math.min(40, canvas.width * 0.08); // Size with a max cap
    const buttonX = canvas.width - buttonSize - padding;
    const buttonY = padding;

    // Store button dimensions for click detection
    pauseButtonRect = { x: buttonX, y: buttonY, width: buttonSize, height: buttonSize };

    // Button background
    ctx.fillStyle = 'rgba(200, 200, 200, 0.8)'; // Light grey, slightly transparent
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.9)'; // Darker grey border
    ctx.lineWidth = 2;
    ctx.beginPath();
    const cornerRadius = buttonSize * 0.2; // Relative corner radius
    ctx.moveTo(buttonX + cornerRadius, buttonY);
    ctx.lineTo(buttonX + buttonSize - cornerRadius, buttonY);
    ctx.quadraticCurveTo(buttonX + buttonSize, buttonY, buttonX + buttonSize, buttonY + cornerRadius);
    ctx.lineTo(buttonX + buttonSize, buttonY + buttonSize - cornerRadius);
    ctx.quadraticCurveTo(buttonX + buttonSize, buttonY + buttonSize, buttonX + buttonSize - cornerRadius, buttonY + buttonSize);
    ctx.lineTo(buttonX + cornerRadius, buttonY + buttonSize);
    ctx.quadraticCurveTo(buttonX, buttonY + buttonSize, buttonX, buttonY + buttonSize - cornerRadius);
    ctx.lineTo(buttonX, buttonY + cornerRadius);
    ctx.quadraticCurveTo(buttonX, buttonY, buttonX + cornerRadius, buttonY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pause icon ("||")
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Dark icon color
    const iconBarWidth = buttonSize * 0.15;
    const iconBarHeight = buttonSize * 0.4;
    const iconBarSpacing = buttonSize * 0.1; // Spacing between the two bars
    const totalIconWidth = (iconBarWidth * 2) + iconBarSpacing;
    
    const bar1X = buttonX + (buttonSize - totalIconWidth) / 2;
    const barY = buttonY + (buttonSize - iconBarHeight) / 2;
    ctx.fillRect(bar1X, barY, iconBarWidth, iconBarHeight);
    ctx.fillRect(bar1X + iconBarWidth + iconBarSpacing, barY, iconBarWidth, iconBarHeight);
}

function drawResumeButton(ctx, canvas) {
    const padding = canvas.width * 0.02;
    const buttonSize = Math.min(40, canvas.width * 0.08);
    const buttonX = canvas.width - buttonSize - padding;
    const buttonY = padding;

    // Store button dimensions for click detection (using pauseButtonRect)
    pauseButtonRect = { x: buttonX, y: buttonY, width: buttonSize, height: buttonSize };

    // Button background (same style as pause button)
    ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const cornerRadius = buttonSize * 0.2;
    ctx.moveTo(buttonX + cornerRadius, buttonY);
    ctx.lineTo(buttonX + buttonSize - cornerRadius, buttonY);
    ctx.quadraticCurveTo(buttonX + buttonSize, buttonY, buttonX + buttonSize, buttonY + cornerRadius);
    ctx.lineTo(buttonX + buttonSize, buttonY + buttonSize - cornerRadius);
    ctx.quadraticCurveTo(buttonX + buttonSize, buttonY + buttonSize, buttonX + buttonSize - cornerRadius, buttonY + buttonSize);
    ctx.lineTo(buttonX + cornerRadius, buttonY + buttonSize);
    ctx.quadraticCurveTo(buttonX, buttonY + buttonSize, buttonX, buttonY + buttonSize - cornerRadius);
    ctx.lineTo(buttonX, buttonY + cornerRadius);
    ctx.quadraticCurveTo(buttonX, buttonY, buttonX + cornerRadius, buttonY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Resume icon (Play triangle "►")
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Dark icon color
    const triangleHeight = buttonSize * 0.4;
    const triangleSideLength = triangleHeight * (2 / Math.sqrt(3)); // Equilateral triangle
    const triangleCenterX = buttonX + buttonSize / 2;
    const triangleCenterY = buttonY + buttonSize / 2;

    ctx.beginPath();
    // Pointing right:
    // Top vertex: (centerX - height/sqrt(3)/2, centerY - height/2)
    // Bottom-left vertex: (centerX - height/sqrt(3)/2, centerY + height/2)
    // Bottom-right vertex: (centerX + height/sqrt(3), centerY) - this is for pointing up
    
    // Corrected for right-pointing triangle:
    // Left-Top: (centerX - triangleHeight*0.3), (centerY - triangleHeight/2)
    // Left-Bottom: (centerX - triangleHeight*0.3), (centerY + triangleHeight/2)
    // Right-Middle: (centerX + triangleHeight*0.6), centerY
    
    const point1X = triangleCenterX - (triangleHeight * 0.25); // Shift left part of triangle a bit to the left from center
    const point1Y = triangleCenterY - (triangleHeight / 2);
    
    const point2X = point1X;
    const point2Y = triangleCenterY + (triangleHeight / 2);
    
    const point3X = triangleCenterX + (triangleHeight * 0.5); // Point extends to the right
    const point3Y = triangleCenterY;

    ctx.moveTo(point1X, point1Y);
    ctx.lineTo(point2X, point2Y);
    ctx.lineTo(point3X, point3Y);
    ctx.closePath();
    ctx.fill();
}

function drawMiniGame(canvas) {
    if (!canvas) {
        console.warn("drawMiniGame called without a canvas element.");
        return;
    }

    if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
        // Canvas is not visible or has no dimensions, defer drawing.
        console.warn("Canvas dimensions are 0, deferring drawMiniGame.");
        requestAnimationFrame(() => {
            // Attempt to redraw. It's crucial that 'canvas' is still the correct element.
            // If game state or mode could change by the next frame, this might need more robust handling,
            // but for now, a simple deferred call should work for the tab switch issue.
            if (currentActiveMode === 'play') { // Only redraw if still in play mode
                drawMiniGame(canvas);
            }
        });
        return; // Stop current drawing execution.
    }
    // Match canvas internal resolution to its display size
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to get 2D context from canvas.");
        return;
    }
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset all button rects at the beginning of each draw call
    startButtonRect = null;
    pauseButtonRect = null;
    playAgainButtonRect = null;

    if (currentGameState === GAME_STATES.READY) {
        drawReadyScreen(ctx, canvas);
    } else if (currentGameState === GAME_STATES.RUNNING) {
        drawMonsterAndScene(ctx, canvas);
        drawPauseButton(ctx, canvas);
        drawTimerDisplay(ctx, canvas);
    } else if (currentGameState === GAME_STATES.PAUSED) {
        drawMonsterAndScene(ctx, canvas); 
        drawResumeButton(ctx, canvas);
        drawTimerDisplay(ctx, canvas);
    } else if (currentGameState === GAME_STATES.END) {
        drawMonsterAndScene(ctx, canvas); // Show the final scene (monster, ground etc.)
        drawTimerDisplay(ctx, canvas); // Show timer at 0
        drawEndScreen(ctx, canvas); // Draw the "Play Again" screen
    }

    // Draw game state indicator (should be on top of everything)
    drawGameStateIndicator(ctx, canvas);
}

// --- Drawing End Screen ---
function drawEndScreen(ctx, canvas) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Panel dimensions (same as drawReadyScreen for consistency)
    const panelWidth = canvas.width * 0.7;
    const panelHeight = canvas.height * 0.6;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;
    const cornerRadius = 20;

    // Draw panel
    ctx.fillStyle = SCREEN_COLORS.panelBackground;
    ctx.strokeStyle = SCREEN_COLORS.panelBorder;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(panelX + cornerRadius, panelY);
    ctx.lineTo(panelX + panelWidth - cornerRadius, panelY);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY, panelX + panelWidth, panelY + cornerRadius);
    ctx.lineTo(panelX + panelWidth, panelY + panelHeight - cornerRadius);
    ctx.quadraticCurveTo(panelX + panelWidth, panelY + panelHeight, panelX + panelWidth - cornerRadius, panelY + panelHeight);
    ctx.lineTo(panelX + cornerRadius, panelY + panelHeight);
    ctx.quadraticCurveTo(panelX, panelY + panelHeight, panelX, panelY + panelHeight - cornerRadius);
    ctx.lineTo(panelX, panelY + cornerRadius);
    ctx.quadraticCurveTo(panelX, panelY, panelX + cornerRadius, panelY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Title
    const titleText = '太棒了!'; // "Well done!"
    ctx.font = `bold ${canvas.width * 0.06}px "Ma Shan Zheng", "KaiTi", sans-serif`;
    ctx.fillStyle = SCREEN_COLORS.titleText;
    ctx.textAlign = 'center';
    ctx.fillText(titleText, canvas.width / 2, panelY + panelHeight * 0.25);

    // "Play Again" Button
    const buttonText = '再玩一次';
    const buttonWidth = panelWidth * 0.5; 
    const buttonHeight = panelHeight * 0.2; 
    const buttonX = (canvas.width - buttonWidth) / 2;
    const buttonY = panelY + panelHeight * 0.55; 
    const buttonCornerRadius = 10;

    // Store button dimensions for click detection
    playAgainButtonRect = { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };

    ctx.fillStyle = SCREEN_COLORS.endButtonBackground;
    ctx.strokeStyle = SCREEN_COLORS.endButtonBorder;
    ctx.lineWidth = 3;
    // Draw button background
    ctx.beginPath();
    ctx.moveTo(buttonX + buttonCornerRadius, buttonY);
    ctx.lineTo(buttonX + buttonWidth - buttonCornerRadius, buttonY);
    ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + buttonCornerRadius);
    ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - buttonCornerRadius);
    ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - buttonCornerRadius, buttonY + buttonHeight);
    ctx.lineTo(buttonX + buttonCornerRadius, buttonY + buttonHeight);
    ctx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - buttonCornerRadius);
    ctx.lineTo(buttonX, buttonY + buttonCornerRadius);
    ctx.quadraticCurveTo(buttonX, buttonY, buttonX + buttonCornerRadius, buttonY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Button text
    ctx.font = `bold ${buttonHeight * 0.5}px "Ma Shan Zheng", "KaiTi", sans-serif`;
    ctx.fillStyle = SCREEN_COLORS.buttonText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(buttonText, buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    ctx.textBaseline = 'alphabetic'; // Reset baseline
}

// --- Event Handlers for Game Canvas ---
function handleGameCanvasClick(event) {
    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (currentGameState === GAME_STATES.READY && startButtonRect) {
        if (x >= startButtonRect.x && x <= startButtonRect.x + startButtonRect.width &&
            y >= startButtonRect.y && y <= startButtonRect.y + startButtonRect.height) {
            setGameState(GAME_STATES.RUNNING);
            return; // Click handled
        }
    } else if (currentGameState === GAME_STATES.RUNNING && pauseButtonRect) {
        if (x >= pauseButtonRect.x && x <= pauseButtonRect.x + pauseButtonRect.width &&
            y >= pauseButtonRect.y && y <= pauseButtonRect.y + pauseButtonRect.height) {
            setGameState(GAME_STATES.PAUSED);
            return; // Click handled
        }
    } else if (currentGameState === GAME_STATES.PAUSED && pauseButtonRect) {
        if (x >= pauseButtonRect.x && x <= pauseButtonRect.x + pauseButtonRect.width &&
            y >= pauseButtonRect.y && y <= pauseButtonRect.y + pauseButtonRect.height) {
            setGameState(GAME_STATES.RUNNING); // Resume game
            return; // Click handled
        }
    } else if (currentGameState === GAME_STATES.END && playAgainButtonRect) {
        if (x >= playAgainButtonRect.x && x <= playAgainButtonRect.x + playAgainButtonRect.width &&
            y >= playAgainButtonRect.y && y <= playAgainButtonRect.y + playAgainButtonRect.height) {
            setGameState(GAME_STATES.READY);
            return; // Click handled
        }
    }
}

function handleGameCanvasMouseMove(event) {
    if (!gameCanvas) return; // Ensure canvas exists

    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    let isOverButton = false;

    if (currentGameState === GAME_STATES.READY && startButtonRect) {
        if (x >= startButtonRect.x && x <= startButtonRect.x + startButtonRect.width &&
            y >= startButtonRect.y && y <= startButtonRect.y + startButtonRect.height) {
            isOverButton = true;
        }
    } else if (currentGameState === GAME_STATES.RUNNING && pauseButtonRect) {
        if (x >= pauseButtonRect.x && x <= pauseButtonRect.x + pauseButtonRect.width &&
            y >= pauseButtonRect.y && y <= pauseButtonRect.y + pauseButtonRect.height) {
            isOverButton = true;
        }
    } else if (currentGameState === GAME_STATES.PAUSED && pauseButtonRect) { 
        if (x >= pauseButtonRect.x && x <= pauseButtonRect.x + pauseButtonRect.width &&
            y >= pauseButtonRect.y && y <= pauseButtonRect.y + pauseButtonRect.height) {
            isOverButton = true;
        }
    } else if (currentGameState === GAME_STATES.END && playAgainButtonRect) {
        if (x >= playAgainButtonRect.x && x <= playAgainButtonRect.x + playAgainButtonRect.width &&
            y >= playAgainButtonRect.y && y <= playAgainButtonRect.y + playAgainButtonRect.height) {
            isOverButton = true;
        }
    }

    gameCanvas.style.cursor = isOverButton ? 'pointer' : 'default';
}

// --- Initialization ---
window.addEventListener('load', () => {
    lessonSelectorTrigger = document.getElementById('lesson-selector-trigger');
    currentLessonNameDisplay = document.getElementById('current-lesson-name-display');
    lessonGridPopup = document.getElementById('lesson-grid-popup');
    lessonGridPopupContent = document.getElementById('lesson-grid-popup-content');
    popupOverlay = document.getElementById('popup-overlay');
    refreshButton = document.getElementById('refresh-content-button');
    pageRefreshOverlay = document.getElementById('page-refresh-overlay');

    learnModeButton = document.getElementById('learn-mode-button');
    playModeButton = document.getElementById('play-mode-button');
    learnContentArea = document.getElementById('learn-content');
    miniGameSection = document.getElementById('mini-game-section');
    gameCanvas = document.getElementById('gameCanvas'); // Initialize gameCanvas

    initializeAudio(); 
    setupTitleBar();
    updateCurrentLessonDisplay();

    if (lessonSelectorTrigger) {
        lessonSelectorTrigger.addEventListener('click', toggleLessonGridPopup);
    }
    if (popupOverlay) {
        popupOverlay.addEventListener('click', toggleLessonGridPopup);
    }

    if (learnModeButton) {
        learnModeButton.addEventListener('click', () => switchMode('learn'));
    }
    if (playModeButton) {
        playModeButton.addEventListener('click', () => switchMode('play'));
    }
    
    // Set initial mode
    switchMode(currentActiveMode); 

    if (refreshButton) {
        const MIN_ANIMATION_DURATION = 700; 

        refreshButton.addEventListener('click', () => {
            if (refreshButton.classList.contains('is-refreshing')) {
                return; 
            }

            refreshButton.classList.add('is-refreshing');
            refreshButton.disabled = true;
            if (pageRefreshOverlay) pageRefreshOverlay.classList.add('active'); 
            const startTime = Date.now();

            (async () => {
                try {
                    if (typeof Tone !== 'undefined' && Tone.context && Tone.context.state !== 'running') {
                        await Tone.start();
                        console.log("Audio context started on refresh click.");
                    } else if (typeof Tone === 'undefined' || !flipSound) { 
                        await initializeAudio(); 
                    }

                    if (currentActiveMode === 'learn') {
                        loadLessonContent(currentSelectedLessonId);
                    } else if (currentActiveMode === 'play') {
                        if (gameCanvas) { // Add a check for gameCanvas
                            drawMiniGame(gameCanvas);
                        }
                    }

                } catch (e) {
                    console.error("Error during refresh process (audio or content loading):", e);
                    if (currentActiveMode === 'learn') {
                         loadLessonContent(currentSelectedLessonId); // Still try to load content
                    }
                } finally {
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = MIN_ANIMATION_DURATION - elapsedTime;

                    const finalizeRefresh = () => {
                        if (refreshButton) {
                            refreshButton.classList.remove('is-refreshing');
                            refreshButton.disabled = false;
                        }
                        if (pageRefreshOverlay) pageRefreshOverlay.classList.remove('active'); 
                    };

                    if (remainingTime > 0) {
                        setTimeout(finalizeRefresh, remainingTime);
                    } else {
                        finalizeRefresh();
                    }
                }
            })();
        });
    } else {
        console.error("Refresh button #refresh-content-button NOT found.");
    }

    loadLessonContent(currentSelectedLessonId); // Initial content load for learn mode

    window.addEventListener('resize', () => {
        if (currentActiveMode === 'learn') {
            const sentenceList = document.getElementById('sentence-list');
            if (sentenceList && sentenceList.innerHTML !== '' && sentenceList.textContent && !sentenceList.textContent.startsWith("请选择课程")) {
                if (!lessonGridPopup || !lessonGridPopup.classList.contains('active')) {
                    const currentSentencesElements = Array.from(sentenceList.querySelectorAll('.sentence-text-underneath'))
                                                        .map(el => el.textContent || "");
                    populateSentenceSection(currentSentencesElements);
                }
            }
        } else if (currentActiveMode === 'play' && gameCanvas) {
            // Redraw mini-game on resize, current state will determine what's drawn
            drawMiniGame(gameCanvas); 
        }
    });

    if (gameCanvas) {
        gameCanvas.addEventListener('click', handleGameCanvasClick);
        gameCanvas.addEventListener('mousemove', handleGameCanvasMouseMove);
    }
});