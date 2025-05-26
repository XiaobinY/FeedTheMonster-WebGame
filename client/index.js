
// Constants are now inlined here
const LESSON_WORDS = [
    { lesson: 1, name: "第一课", words: ["大人", "小人", "大哭", "大口", "大笑", "小口"] },
    { lesson: 2, name: "第二课", words: ["爸爸", "妈妈", "上天", "天上", "太大", "太小", "一天", "一月", "二天", "二月", "上上下下"] },
    { lesson: 3, name: "第三课", words: ["天地", "大地", "太阳", "月亮", "星星", "天亮", "大火", "大水", "火星", "水星", "三天", "三月", "下地", "地上", "地下"] },
    { lesson: 4, name: "第四课", words: ["土地", "大山", "小山", "土山", "石山", "火山", "土星", "木星", "好人", "田地", "水田", "我有", "我爸", "我妈", "我哭", "我笑"] },
    { lesson: 5, name: "第五课", words: ["大牛", "小牛", "水牛", "山羊", "小羊", "小心", "中心", "心中", "四月", "四天"] },
    { lesson: 6, name: "第六课", words: ["聪明", "明亮", "明天", "明月", "眉头", "鼻头", "石头", "木头", "心头", "小手", "小花", "大树", "小树", "树木", "五月", "五天", "手心"] },
    { lesson: 7, name: "第七课", words: ["花草", "小草", "草地", "树叶", "一日", "大风", "大雨", "小雨", "下雨", "风雨", "雨水", "我的", "六月", "六日", "六天"] },
    { lesson: 8, name: "第八课", words: ["白云", "白天", "明白", "红花", "红日", "火红", "火花", "是的", "我是", "大家", "我家", "人家", "孩子", "鼻子", "叶子", "七月", "七日", "七天", "红太阳"] },
    { lesson: 9, name: "第九课", words: ["爷爷", "奶奶", "多少", "唱歌", "爱笑", "爱哭", "爱唱", "不爱", "不哭", "不笑", "不唱", "是不是", "不是", "好不好", "不好", "八月", "八日", "八天"] },
    { lesson: 10, name: "第十课", words: ["宝宝", "在家", "不在", "游水", "朋友", "友人", "花儿", "儿子", "歌儿", "儿歌", "九月", "九日", "九天"] },
    { lesson: "复习一", name: "课后复习一", words: ["宝贝", "生人", "生水", "学习", "上学", "看书", "看戏", "游戏", "生字", "生气", "气人", "十月", "十日", "十天", "好孩子", "小朋友", "下雨天", "好朋友", "小人书", "小学生", "中学生", "大学生", "唱儿歌", "小红花"] },
    { lesson: 11, name: "第十一课", words: ["看见", "会见", "学会", "早上", "大雪", "小雪", "雪花", "白雪", "雪人", "雪山", "雪地", "下雪天", "小鸡", "大鸡", "绿草", "绿叶", "黄花", "黄牛", "青草"] },
    { lesson: 12, name: "第十二课", words: ["小鱼", "飞鸟", "飞跑", "飞人", "不要", "不吃", "爱吃", "小鸟", "黄鸟", "做游戏", "要不要"] },
    { lesson: 13, name: "第十三课", words: ["我们", "他们", "人们", "孩子们", "朋友们", "学生们", "春季", "春天", "春风", "春雨", "夏季", "夏天", "三个人", "都不是", "秋季", "秋天", "秋风", "冬季", "冬天", "四季", "都是"] },
    { lesson: 14, name: "第十四课", words: ["大狗", "小狗", "黄狗", "黑狗", "大猫", "小猫", "花猫", "白猫", "蓝天", "蓝猫", "落下", "落叶", "真是", "真的", "真心", "天真", "开心", "开会", "开花", "开门", "也要", "也是", "也不要", "也不是"] },
    { lesson: 15, name: "第十五课", words: ["大马", "小马", "白马", "黑马", "大米", "小米", "白米", "黑米", "哥哥", "大哥", "姐姐", "大姐", "小姐", "黑天", "天黑", "出来", "出去"] },
    { lesson: 16, name: "第十六课", words: ["跳着", "吃着", "看着", "说着", "来了", "去了", "吃了", "你们", "又要", "又去", "又哭", "又说", "又笑", "弟弟", "小弟", "姐妹", "妹妹", "小妹"] },
    { lesson: 17, name: "第十七课", words: ["就是", "还是", "还有", "得了", "得到", "来到", "去到", "到了", "东西", "东风", "快乐", "起来", "一起"] },
    { lesson: 18, name: "第十八课", words: ["游玩", "玩球", "玩水", "玩游戏", "大球", "气球", "很好", "很大", "很小", "高大", "高山", "高个子", "跳高", "小鸭子", "哈哈笑"] },
    { lesson: 19, name: "第十九课", words: ["地方", "上方", "爬山", "爬树", "高兴", "方向", "向着", "捉迷藏", "对着", "对了", "不对", "对不对", "大叫", "叫着", "不能", "对不起", "能不能"] },
    { lesson: 20, name: "第二十课", words: ["变了", "不变", "变成", "问好", "问人", "再见", "再说", "再去", "再来", "急得", "着急", "大门", "开门", "门口", "一只", "三只"] },
    { lesson: "复习三", name: "课后复习三", words: ["回家", "回来", "回去", "回头", "公公", "公鸡", "打人", "白兔", "兔子", "过来", "过去", "来过", "去过", "好吗", "去吗", "来吗", "游泳", "很高兴", "真快乐", "好开心", "好得很", "对不起", "笑哈哈", "一会儿"] }
];
const NUM_WORDS_TO_DISPLAY = 16;
const LESSON_WEIGHTS = {
    "1": 1, "2": 1, "3": 1, "4": 1, "5": 1,
    "6": 1, "7": 1, "8": 1, "9": 1, "10": 1,
    "复习一": 1,
    "11": 3, "12": 3, "13": 3,
    "14": 6, "15": 6, "16": 6,
    "17": 0, "18": 0, "19": 0, "20": 0,
    "复习三": 0
};
const LESSON_SENTENCES = [
    { lesson: 4, name: "第四课", sentences: ["我有好爸爸、好妈妈。", "天上有太阳、月亮、星星。", "地上有土、石、山、水田。", "爸爸上山,妈妈下山。"] },
    { lesson: 5, name: "第五课", sentences: ["地上有小草和大树。", "草地上有水牛和小山羊。", "爸爸和妈妈心中有我。", "我心中有爸爸和妈妈。"] },
    { lesson: 6, name: "第六课", sentences: ["我有小手。", "头上有眉、目、耳、鼻和口。", "眉下有目,鼻下有口。", "树上有花和叶。"] },
    { lesson: 7, name: "第七课", sentences: ["天上有明亮的太阳和月亮。", "我有爸爸和妈妈。", "明日有大风,下大雨。", "石头上有小草和小花。"] },
    { lesson: 8, name: "第八课", sentences: ["我是爸爸、妈妈的好孩子。", "天是太阳、月亮、星星的家。", "白天,天上有红太阳;地上有红花、白花和小草。", "爷爷、奶奶家有大水牛和小山羊。"] },
    { lesson: 9, name: "第九课", sentences: ["明天多云, 有小雨。", "聪聪爱唱歌。", "我家有爷爷、奶奶、爸爸、妈妈和我。", "爷爷爱我,奶奶爱我,爸爸爱我,妈妈爱我。我爱爷爷,我爱奶奶,我爱爸爸,我爱妈妈。"] },
    { lesson: 10, name: "第十课", sentences: ["我是宝宝,我在家爱唱儿歌。", "我不爱哭,我爱笑。", "我的好朋友是聪聪。", "小头爸爸和大头儿子玩游戏。"] },
    { lesson: "复习一", name: "课后复习一", sentences: ["小宝是爱学习的好孩子。", "爷爷爱看书,奶奶爱看戏,爸爸爱看书,妈妈爱唱歌。", "我爱爷爷、奶奶、爸爸和妈妈。我是大家的好宝贝。", "心心和小叶子是好朋友。", "我爱看书,我爱学习。我是聪明的孩子。", "天上有太阳、月亮、星星和白云;地上有土、石、山、水、花和树木。", "不爱生气、不爱哭的孩子是好孩子。我爱笑,我是好孩子。", "下雨天,我和明明在我家看小人书。", "我的好朋友聪聪是小学生,聪聪天天上学。", "爸爸的爸爸是爷爷。爸爸是爷爷的儿子,我是爸爸的儿子。"] },
    { lesson: 11, name: "第十一课", sentences: ["我学会好多生字。", "树上有爱唱歌的小黄鸟。", "天下大雪。早上,我看见地上有好多白雪。", "我和妈妈、爸爸去奶奶家。在奶奶家,我看见大山、水田和水牛。"] },
    { lesson: 12, name: "第十二课", sentences: ["我看见水中有好多鱼,有大鱼,有小鱼。", "小鸟在天上飞,小羊在地上跑。", "小羊和小牛在青青的草地上吃草。", "爷爷、奶奶和爸爸爱吃鱼,我和妈妈不爱吃鱼。", "我和明明在他家做游戏。"] },
    { lesson: 13, name: "第十三课", sentences: ["小朋友们天天都唱歌,做游戏。", "我爱学习,我天天都学生字。", "我们家有五个人:爷爷、奶奶、爸爸、妈妈和我。", "小鸡都在地上游戏,小鱼都在水中游戏,小鸟都在天上游戏。", "春天,大地青青的; 夏天,大地绿绿的; 秋天,大地黄黄的; 冬天,大地白白的。"] },
    { lesson: 14, name: "第十四课", sentences: ["我家的小白狗和小花猫是好朋友。", "蓝蓝的天上有白白的云。", "青青的草地上有红花、黄花和蓝花。", "四季是春季、夏季、秋季、冬季。春季草青,夏季花开,秋季叶落,冬季雪飞。", "我学会好多生字,爸爸、妈妈都说我是个爱学习的好孩子。"] },
    { lesson: 15, name: "第十五课", sentences: ["山羊、黄牛都爱吃青草,大白马也爱吃青草。小鸡不吃青草,他爱吃米。", "小黑马的爸爸是黑马,妈妈是白马。哥哥和姐姐也都是黑马。", "下雪天,雪花飞。天是白的,地是白的,树是白的。我们的雪人也是白的。真好看!", "太阳出来天亮了,蓝天、白云真好看。太阳下山天黑了,星星、月亮出来了。"] },
    { lesson: 16, name: "第十六课", sentences: ["来,来,来,来上学,大家来上学。去,去,去,去游戏,大家去游戏。", "天上小鸟飞,地上牛羊吃青草。水中鱼儿游,猫狗笑着跑又跳。", "你的弟弟和我的妹妹都在我家学生字,他们学会了好多生字。", "小弟和小妹吃着大米花,跑来跑去地说:“你们要不要吃大米花?真好吃。”"] },
    { lesson: 17, name: "第十七课", sentences: ["天上的白云飞得真快,小鸟飞不快,就哭了起来。妈妈说:“不要哭,不要哭!你是好孩子。”小鸟就不哭了。", "我看见天上有很多很多气球,有大气球、小气球,有红气球、黄气球,有蓝气球、白气球,还有绿气球。真好看!", "我有四个好朋友,他们是小云、明明、小红和小叶子。我们大家一起学习,一起唱歌,一起游戏。我们在一起真快乐!", "我们家有七个人:爷爷、奶奶、爸爸和妈妈四个大人,还有哥哥、姐姐和我三个小孩子。哥哥、姐姐和我都是爱学习的好孩子。"] },
    { lesson: 18, name: "第十八课", sentences: ["小黄牛和小山羊一起在山上游玩,它们玩得哈哈大笑,很是开心。", "小鸟和小鸡、小鸭在一起玩。小鸟说:“我要飞到很高的树上去玩,你们也飞上去玩,好不好?”小鸭说:“我飞不上去。”小鸡说:“我也飞不上去。”小鸟也就不飞了,还是和小鸡、小鸭一起在地上玩。他们真是好朋友。"] },
    { lesson: 19, name: "第十九课", sentences: ["小狗不会爬树,向小白猫学习。小白猫在树上看着小狗爬树,见小狗爬不上去,就乐得哈哈大笑。你说,小白猫做得对不对?", "我在田方家里看见了小红姐姐、东东哥哥、牛牛弟弟和白雪妹妹。我们在一起玩“捉迷藏”的游戏。大家高兴得又唱又跳。"] },
    { lesson: 20, name: "第二十课", sentences: ["我家门口的树上有一只爱唱歌的小黄鸟。他天天都要唱很多好听的歌。", "我问爸爸“早上好”,爸爸对我笑;我问妈妈“早上好”,妈妈说我是好宝宝。", "小鸟在天上飞,叫白云和它一起落到树上。白云说:“我不能落,我一落到树上,就会变成水,不能再飞了。”"] },
    { lesson: "复习三", name: "课后复习三", sentences: ["回家", "回来", "回去", "回头", "公公", "公鸡", "打人", "白兔", "兔子", "过来", "过去", "来过", "去过", "好吗", "去吗", "来吗", "游泳", "很高兴", "真快乐", "好开心", "好得很", "对不起", "笑哈哈", "一会儿"] }
];
const NUM_SENTENCES_TO_DISPLAY = 4; // Base number of sentences
const SHORT_SENTENCE_THRESHOLD = 15; // Characters to consider a sentence "short"
const PASTEL_COLORS = [
    "#FFB3B3", "#FFD699", "#FFFFB3", "#B3FFB3", "#B3B3FF", "#D9B3FF",
    "#FFC0CB", "#DDA0DD", "#ADD8E6", "#F0E68C", "#90EE90", "#FFA07A",
    "#FFDAC1", "#E2F0CB", "#C7CEEA", "#FFD1DC", "#B4E0E0", "#FCE8B2",
    "#FFC4E1", "#D9E2FF", "#C4F0C4", "#FFECC4", "#E9D1FF", "#D1FFE9"
];
const WORD_CARD_BACKGROUND_COLOR = '#FFF8DC';

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


// --- Sound Effects (Tone.js) ---
let flipSound;
let boopSound; // For wiggle effect
let chimeSound; // For sparkle effect

async function initializeAudio() {
    if (typeof Tone === 'undefined') {
        console.warn("initializeAudio: Tone.js not loaded yet. Sounds will be unavailable.");
        return false; // Indicate failure
    }

    try {
        if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log("Audio context started by initializeAudio.");
        }

        flipSound = flipSound || new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.1 },
            volume: -10
        }).toDestination();

        boopSound = boopSound || new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
            volume: -15
        }).toDestination();

        chimeSound = chimeSound || new Tone.Synth({
            oscillator: { type: 'triangle8' },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.05, release: 0.2 },
            volume: -12,
            harmonicity: 1.2
        }).toDestination();
        return true; // Indicate success

    } catch (synthError) {
        console.error("initializeAudio - Synth initialization or Tone.start() FAILED:", synthError);
        return false; // Indicate failure
    }
}


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