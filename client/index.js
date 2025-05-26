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

// --- Global State ---
let currentSelectedLessonId = "all_random";
let currentSelectedLessonName = "所有课程 (随机)";
let isCardEffectAnimating = false; // Flag to prevent spamming card effects
let currentActiveMode = 'learn'; // 'learn' or 'play'

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
    }
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
                        // Placeholder for refreshing game content if/when it becomes dynamic
                        console.log("Refreshing play mode (currently static).");
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
        const sentenceList = document.getElementById('sentence-list');
        if (currentActiveMode === 'learn' && sentenceList && sentenceList.innerHTML !== '' && sentenceList.textContent && !sentenceList.textContent.startsWith("请选择课程")) {
             if (!lessonGridPopup || !lessonGridPopup.classList.contains('active')) {
                const currentSentencesElements = Array.from(sentenceList.querySelectorAll('.sentence-text-underneath'))
                                                    .map(el => el.textContent || "");
                populateSentenceSection(currentSentencesElements);
            }
        }
    });
});