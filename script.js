// 1. Define DOM element variables
const gameContainer = document.getElementById('game-container');
const monster = document.getElementById('monster');
const startButton = document.getElementById('start-button');
const candyArea = document.getElementById('candy-area');
const heartsStack = document.getElementById('hearts-stack'); // Represents lives
const ground = document.getElementById('ground');

// End Game Panel Elements
const endGamePanel = document.getElementById('end-game-panel');
const endGameMessage = document.getElementById('end-game-message');
const finalScoreText = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again-button');


// 2. Create a list of Chinese words
const allWords = [
    { chinese: '苹果', pinyin: 'píngguǒ', english: 'apple' },
    { chinese: '香蕉', pinyin: 'xiāngjiāo', english: 'banana' },
    { chinese: '猫', pinyin: 'māo', english: 'cat' },
    { chinese: '狗', pinyin: 'gǒu', english: 'dog' },
    { chinese: '鸟', pinyin: 'niǎo', english: 'bird' },
    { chinese: '鱼', pinyin: 'yú', english: 'fish' },
    { chinese: '红色', pinyin: 'hóngsè', english: 'red' },
    { chinese: '蓝色', pinyin: 'lánsè', english: 'blue' },
    { chinese: '绿色', pinyin: 'lǜsè', english: 'green' },
    { chinese: '黄色', pinyin: 'huángsè', english: 'yellow' },
    { chinese: '一', pinyin: 'yī', english: 'one' },
    { chinese: '二', pinyin: 'èr', english: 'two' },
    { chinese: '三', pinyin: 'sān', english: 'three' },
    { chinese: '太阳', pinyin: 'tàiyáng', english: 'sun' },
    { chinese: '月亮', pinyin: 'yuèliang', english: 'moon' },
    { chinese: '星星', pinyin: 'xīngxing', english: 'star' },
    { chinese: '花', pinyin: 'huā', english: 'flower' },
    { chinese: '树', pinyin: 'shù', english: 'tree' },
    { chinese: '云', pinyin: 'yún', english: 'cloud' },
    { chinese: '水', pinyin: 'shuǐ', english: 'water' },
    { chinese: '火', pinyin: 'huǒ', english: 'fire' },
    { chinese: '山', pinyin: 'shān', english: 'mountain' },
    { chinese: '大', pinyin: 'dà', english: 'big' },
    { chinese: '小', pinyin: 'xiǎo', english: 'small' },
    { chinese: '多', pinyin: 'duō', english: 'many/much' },
    { chinese: '少', pinyin: 'shǎo', english: 'few/little' },
    { chinese: '爱', pinyin: 'ài', english: 'love' },
    { chinese: '家', pinyin: 'jiā', english: 'home/family' },
    { chinese: '你好', pinyin: 'nǐ hǎo', english: 'hello' },
    { chinese: '谢谢', pinyin: 'xièxie', english: 'thank you' }
];

// 3. Game state variables
let gameWords = [];
let score = 0;
let candiesGenerated = 0;
let totalCandiesInGame = 10;
let gameInProgress = false;
let candyDropInterval;
let lives = 3;
const confettiColors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];


// 4. selectRandomWords() function
function selectRandomWords() {
    gameWords = [];
    const wordsCopy = [...allWords];
    for (let i = 0; i < totalCandiesInGame; i++) {
        if (wordsCopy.length === 0) break;
        const randomIndex = Math.floor(Math.random() * wordsCopy.length);
        gameWords.push(wordsCopy.splice(randomIndex, 1)[0]);
    }
}

// Function to animate candy fall
function animateCandyFall(candyElement) {
    if (!gameInProgress || candyElement.isClicked) return;

    let fallSpeed = 1.5; // Increased fall speed
    const groundOffsetTop = ground.offsetTop;

    function fall() {
        if (!gameInProgress || candyElement.isClicked) {
            cancelAnimationFrame(candyElement.fallAnimationId);
            return;
        }

        const currentTop = parseFloat(candyElement.style.top);
        const candyHeight = candyElement.offsetHeight;

        if (currentTop + candyHeight < groundOffsetTop) {
            candyElement.style.top = `${currentTop + fallSpeed}px`;
            candyElement.fallAnimationId = requestAnimationFrame(fall);
        } else {
            candyElement.style.top = `${groundOffsetTop - candyHeight}px`;
            candyElement.isOnGround = true;
            
            if (gameInProgress) {
                lives--;
                updateHeartsDisplay();
                if (lives <= 0) {
                    endGame();
                } else {
                    checkGameEnd();
                }
            }
        }
    }
    candyElement.fallAnimationId = requestAnimationFrame(fall);
}

// Function to handle candy click
function candyClicked(event) {
    if (!gameInProgress) return;
    const candy = event.target.closest('.candy');
    if (!candy || candy.isClicked) return;

    candy.isClicked = true;
    cancelAnimationFrame(candy.fallAnimationId);

    const monsterRect = monster.getBoundingClientRect();
    const candyRect = candy.getBoundingClientRect();
    const gameContainerRect = gameContainer.getBoundingClientRect();

    const targetX = monsterRect.left - gameContainerRect.left + (monsterRect.width / 2) - (candyRect.width / 2);
    const targetY = monsterRect.top - gameContainerRect.top + (monsterRect.height / 2) - (candyRect.height / 2);

    candy.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in'; // Slightly faster
    candy.style.transform = `translate(${targetX - candy.offsetLeft}px, ${targetY - candy.offsetTop}px) scale(0.3)`; // Scale smaller
    candy.style.opacity = '0';

    setTimeout(() => {
        if (candy.parentNode) {
            candy.parentNode.removeChild(candy);
        }
        score++;
        checkGameEnd();
    }, 400); // Match transition duration
}

// 5. createCandy(wordData) function
function createCandy(wordData) {
    const candy = document.createElement('div');
    candy.classList.add('candy');
    candy.innerHTML = wordData.chinese;
    candy.dataset.chinese = wordData.chinese;
    candy.dataset.pinyin = wordData.pinyin;
    candy.dataset.english = wordData.english;
    candy.isClicked = false;
    candy.isOnGround = false;

    const candyAreaWidth = candyArea.offsetWidth;
    
    // Temporarily append to measure, then remove, then append properly
    // This ensures offsetWidth is available if candyArea is not displayed or candy is complex
    candyArea.appendChild(candy); 
    const candyWidth = candy.offsetWidth || 30; 
    // candyArea.removeChild(candy); // No need to remove if already in correct parent. measurement is done.

    const randomLeft = Math.floor(Math.random() * (candyAreaWidth - candyWidth));
    candy.style.left = `${randomLeft < 0 ? 0 : randomLeft}px`;
    candy.style.top = '-30px'; // Start off-screen slightly for smoother entry

    // The candy is already in candyArea from the measurement step above.
    candy.addEventListener('click', candyClicked);
    animateCandyFall(candy);
    return candy;
}

// Function to update hearts display based on 'lives'
function updateHeartsDisplay() {
    heartsStack.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const lifeHeart = document.createElement('div');
        lifeHeart.classList.add('heart');
        lifeHeart.textContent = '❤️';
        heartsStack.appendChild(lifeHeart);
    }
}

// Check game end condition
function checkGameEnd() {
    if (!gameInProgress) return;

    const activeCandies = Array.from(candyArea.querySelectorAll('.candy')).filter(
        c => !c.isClicked && !c.isOnGround
    );

    if (candiesGenerated >= totalCandiesInGame && activeCandies.length === 0) {
        endGame();
    }
}

// Function to trigger confetti effect
function triggerConfettiEffect() {
    const numConfetti = 100; // Number of confetti particles
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight; // Used in CSS animation calc

    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-particle');
        
        confetti.style.left = Math.random() * containerWidth + 'px';
        // Top is handled by animation starting from -20px
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        // Vary animation duration and delay for more natural fall
        const randomDuration = 2.5 + Math.random() * 1.5; // 2.5s to 4s
        const randomDelay = Math.random() * 1; // 0s to 1s delay
        confetti.style.animationDuration = randomDuration + 's';
        confetti.style.animationDelay = randomDelay + 's';
        
        // Add a random horizontal sway factor to the animation if desired (more complex)
        // For now, using CSS transform for rotation and vertical fall.

        gameContainer.appendChild(confetti);

        // Remove confetti after animation ends
        confetti.addEventListener('animationend', () => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        });
    }
}


// endGame function
function endGame() {
    if (!gameInProgress) return;

    gameInProgress = false;
    clearInterval(candyDropInterval);

    const allCandies = candyArea.querySelectorAll('.candy');
    allCandies.forEach(candy => {
        if (candy.fallAnimationId) {
            cancelAnimationFrame(candy.fallAnimationId);
        }
        // Optionally, make remaining candies disappear or fall quickly
        if (!candy.isClicked && candy.parentNode) {
             candy.style.transition = 'opacity 0.5s ease';
             candy.style.opacity = '0';
             setTimeout(() => candy.parentNode.removeChild(candy), 500);
        }
    });

    finalScoreText.textContent = `你得到了 ${score} 颗糖果!`;
    endGamePanel.classList.remove('celebration');
    monster.classList.remove('monster-happy'); // Ensure happy class is removed initially

    if (lives <= 0) {
        endGameMessage.textContent = "糟糕！爱心用完了！";
    } else if (score >= 8) { // Threshold for huge celebration
        endGameMessage.textContent = "太棒了！你真是个汉字小英雄！";
        endGamePanel.classList.add('celebration');
        monster.classList.add('monster-happy'); // Add happy class for monster animation
        triggerConfettiEffect(); // Trigger confetti
    } else if (score >= 4) {
        endGameMessage.textContent = "真不错！继续努力！";
    } else {
        endGameMessage.textContent = "加油！下次会更好！";
    }

    endGamePanel.style.display = 'flex';
    startButton.style.display = 'none';
}


// 6. startGame() function
function startGame() {
    gameInProgress = true;
    startButton.style.display = 'none';
    endGamePanel.style.display = 'none';
    monster.classList.remove('monster-happy'); // Reset monster animation class
    
    // Remove any leftover confetti if game restarts quickly
    const existingConfetti = gameContainer.querySelectorAll('.confetti-particle');
    existingConfetti.forEach(c => c.parentNode.removeChild(c));

    candyArea.innerHTML = '';

    score = 0;
    candiesGenerated = 0;
    lives = 3;
    updateHeartsDisplay();

    selectRandomWords();

    candyDropInterval = setInterval(() => {
        if (!gameInProgress) {
            clearInterval(candyDropInterval);
            return;
        }
        if (candiesGenerated < totalCandiesInGame) {
            if (gameWords[candiesGenerated]) {
                createCandy(gameWords[candiesGenerated]);
                candiesGenerated++;
            } else {
                clearInterval(candyDropInterval);
            }
        } else {
            clearInterval(candyDropInterval);
            checkGameEnd();
        }
    }, 2500); // Slightly faster candy generation (was 3000)
}

// 7. Event Listener for Start Button
startButton.addEventListener('click', startGame);

// Event Listener for Play Again Button
playAgainButton.addEventListener('click', () => {
    // endGamePanel.style.display = 'none'; // startGame will hide it
    startGame();
});

// Initial setup
updateHeartsDisplay();
endGamePanel.style.display = 'none';
startButton.style.display = 'block';
// console.log("Game script v1.1 loaded. Added celebrations and polish."); // Final version, removing log
