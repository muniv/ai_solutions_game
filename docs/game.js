// 게임 상태 관리
class GameState {
    constructor() {
        this.time = 60; // 60초 시작
        this.score = 0;
        this.currentOrder = null;
        this.selectedIngredients = [];
        this.isGameActive = false;
        this.highScore = this.loadHighScore();
    }

    loadHighScore() {
        return parseInt(localStorage.getItem('aiHeroesHighScore')) || 0;
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('aiHeroesHighScore', this.highScore.toString());
        }
    }
}

// 주문 시스템
class OrderSystem {
    constructor() {
        // 새로운 데이터/알고리즘 조합
        this.dataTypes = [
            { icon: '📝', label: '상품 리뷰 텍스트' },
            { icon: '🖼', label: '의료 X-ray 이미지' },
            { icon: '📹', label: 'CCTV 영상' },
            { icon: '📈', label: 'POS 매출표' },
            { icon: '🗺', label: 'GPS 위치 기록' },
            { icon: '🏭', label: 'IoT 센서 로그' },
            { icon: '🏫', label: '학생 성적표' },
            { icon: '🛒', label: '고객 행동 로그' }
        ];
        this.algoTypes = [
            { icon: '🤖', label: '분류' },
            { icon: '📊', label: '예측' },
            { icon: '🧩', label: '군집' },
            { icon: '🕵️‍♂️', label: '이상탐지' },
            { icon: '🗂', label: '추천' }
        ];
        
        // 실제 AI 업계에서 자주 쓰는 문제들
        this.orders = [
            // 상품 리뷰 텍스트
            { pair: ['📝', '🤖'], problem: '리뷰 감정을 긍정/부정으로 분류하고 싶어요!' },
            { pair: ['📝', '🕵️‍♂️'], problem: '특이한 리뷰를 감지하고 싶어요!' },
            { pair: ['📝', '🗂'], problem: '리뷰 기반으로 상품을 추천하고 싶어요!' },
            
            // 의료 X-ray 이미지
            { pair: ['🖼', '🤖'], problem: 'X-ray에서 질병을 자동으로 분류하고 싶어요!' },
            { pair: ['🖼', '🕵️‍♂️'], problem: 'X-ray에서 이상 징후를 감지하고 싶어요!' },
            
            // CCTV 영상
            { pair: ['📹', '🤖'], problem: 'CCTV에서 사람/차량을 분류하고 싶어요!' },
            { pair: ['📹', '🕵️‍♂️'], problem: 'CCTV에서 이상 행동을 감지하고 싶어요!' },
            
            // POS 매출표
            { pair: ['📈', '📊'], problem: '매출을 예측하고 싶어요!' },
            { pair: ['📈', '🧩'], problem: '매출 패턴을 군집화하고 싶어요!' },
            { pair: ['📈', '🕵️‍♂️'], problem: '매출 이상을 감지하고 싶어요!' },
            
            // GPS 위치 기록
            { pair: ['🗺', '🧩'], problem: '고객 방문 위치 패턴을 군집화하고 싶어요!' },
            { pair: ['🗺', '🗂'], problem: '위치 기반으로 상점을 추천하고 싶어요!' },
            { pair: ['🗺', '🕵️‍♂️'], problem: '이상한 이동 패턴을 감지하고 싶어요!' },
            
            // IoT 센서 로그
            { pair: ['🏭', '🕵️‍♂️'], problem: '공장 센서에서 이상을 감지하고 싶어요!' },
            { pair: ['🏭', '📊'], problem: '센서 데이터로 고장을 예측하고 싶어요!' },
            { pair: ['🏭', '🧩'], problem: '센서 패턴을 군집화하고 싶어요!' },
            
            // 학생 성적표
            { pair: ['🏫', '📊'], problem: '학생 성적을 예측하고 싶어요!' },
            { pair: ['🏫', '🧩'], problem: '학생을 학습 유형별로 군집화하고 싶어요!' },
            { pair: ['🏫', '🕵️‍♂️'], problem: '성적 이상을 감지하고 싶어요!' },
            
            // 고객 행동 로그
            { pair: ['🛒', '🗂'], problem: '고객별로 상품을 추천하고 싶어요!' },
            { pair: ['🛒', '🧩'], problem: '고객 구매 패턴을 군집화하고 싶어요!' },
            { pair: ['🛒', '🕵️‍♂️'], problem: '이상한 구매 행동을 감지하고 싶어요!' }
        ];
        
        // 재료 타입 매핑 (이모지 → 타입)
        this.ingredientTypes = Object.fromEntries([
            ...this.dataTypes.map(d => [d.icon, 'data']),
            ...this.algoTypes.map(a => [a.icon, 'algo'])
        ]);

        // 키보드 단축키 매핑 (새로운 조합에 맞춰)
        this.keyboardMapping = {
            '1': '📝', // 1번 키 = 상품 리뷰 텍스트
            '2': '🖼', // 2번 키 = 의료 X-ray 이미지
            '3': '📹', // 3번 키 = CCTV 영상
            '4': '📈', // 4번 키 = POS 매출표
            '5': '🗺', // 5번 키 = GPS 위치 기록
            '6': '🏭', // 6번 키 = IoT 센서 로그
            '7': '🏫', // 7번 키 = 학생 성적표
            '8': '🛒', // 8번 키 = 고객 행동 로그
            'q': '🤖', // q번 키 = 분류
            'w': '📊', // w번 키 = 예측
            'e': '🧩', // e번 키 = 군집
            'r': '🕵️‍♂️', // r번 키 = 이상탐지
            't': '🗂'  // t번 키 = 추천
        };

        // 고객 문제 대사 (새로운 조합에 맞춰)
        this.customerProblems = {
            '📝🤖': [
                '"리뷰가 긍정인지 부정인지 자동으로 분류하고 싶어요!"',
                '"고객 리뷰의 감정을 분석하고 싶어요!"',
                '"리뷰 텍스트를 카테고리별로 나누고 싶어요!"'
            ],
            '📝🕵️‍♂️': [
                '"악성 리뷰를 자동으로 찾아내고 싶어요!"',
                '"스팸 리뷰를 감지하고 싶어요!"',
                '"의심스러운 리뷰를 걸러내고 싶어요!"'
            ],
            '📝🗂': [
                '"리뷰 내용으로 상품을 추천하고 싶어요!"',
                '"고객 리뷰 기반 추천 시스템을 만들고 싶어요!"',
                '"리뷰 패턴으로 맞춤 상품을 추천하고 싶어요!"'
            ],
            '🖼🤖': [
                '"X-ray에서 질병을 자동으로 진단하고 싶어요!"',
                '"의료 영상을 분류해서 질병을 찾고 싶어요!"',
                '"X-ray 이미지에서 병변을 자동으로 찾고 싶어요!"'
            ],
            '🖼🕵️‍♂️': [
                '"X-ray에서 이상 징후를 감지하고 싶어요!"',
                '"의료 영상에서 비정상 패턴을 찾고 싶어요!"',
                '"X-ray에서 위험 신호를 자동으로 감지하고 싶어요!"'
            ],
            '📹🤖': [
                '"CCTV에서 사람과 차량을 구분하고 싶어요!"',
                '"영상에서 객체를 자동으로 분류하고 싶어요!"',
                '"CCTV 영상을 카테고리별로 나누고 싶어요!"'
            ],
            '📹🕵️‍♂️': [
                '"CCTV에서 이상 행동을 감지하고 싶어요!"',
                '"영상에서 비정상 상황을 찾고 싶어요!"',
                '"CCTV에서 위험 상황을 자동으로 감지하고 싶어요!"'
            ],
            '📈📊': [
                '"매출을 예측하고 싶어요!"',
                '"다음 달 매출을 알고 싶어요!"',
                '"매출 트렌드를 예측하고 싶어요!"'
            ],
            '📈🧩': [
                '"매출 패턴을 그룹별로 나누고 싶어요!"',
                '"유사한 매출 패턴을 찾고 싶어요!"',
                '"매출 클러스터를 분석하고 싶어요!"'
            ],
            '📈🕵️‍♂️': [
                '"매출 이상을 자동으로 감지하고 싶어요!"',
                '"비정상적인 매출 패턴을 찾고 싶어요!"',
                '"매출 사기나 오류를 감지하고 싶어요!"'
            ],
            '🗺🧩': [
                '"고객 방문 패턴을 그룹별로 나누고 싶어요!"',
                '"유사한 이동 패턴을 찾고 싶어요!"',
                '"위치 기반 고객 세분화를 하고 싶어요!"'
            ],
            '🗺🗂': [
                '"위치 기반으로 상점을 추천하고 싶어요!"',
                '"고객 위치에 맞는 매장을 추천하고 싶어요!"',
                '"지역별 맞춤 추천을 하고 싶어요!"'
            ],
            '🗺🕵️‍♂️': [
                '"이상한 이동 패턴을 감지하고 싶어요!"',
                '"비정상적인 위치 데이터를 찾고 싶어요!"',
                '"GPS 데이터에서 이상을 감지하고 싶어요!"'
            ],
            '🏭🕵️‍♂️': [
                '"공장 센서에서 이상을 감지하고 싶어요!"',
                '"기계 고장 징후를 미리 찾고 싶어요!"',
                '"센서 데이터에서 비정상을 감지하고 싶어요!"'
            ],
            '🏭📊': [
                '"센서 데이터로 고장을 예측하고 싶어요!"',
                '"기계 수명을 예측하고 싶어요!"',
                '"센서 패턴으로 고장 시점을 예측하고 싶어요!"'
            ],
            '🏭🧩': [
                '"센서 패턴을 그룹별로 나누고 싶어요!"',
                '"유사한 센서 패턴을 찾고 싶어요!"',
                '"센서 데이터 클러스터를 분석하고 싶어요!"'
            ],
            '🏫📊': [
                '"학생 성적을 예측하고 싶어요!"',
                '"학업 성취도를 예측하고 싶어요!"',
                '"성적 향상 가능성을 예측하고 싶어요!"'
            ],
            '🏫🧩': [
                '"학생을 학습 유형별로 그룹화하고 싶어요!"',
                '"유사한 학습 패턴을 찾고 싶어요!"',
                '"학생 클러스터를 분석하고 싶어요!"'
            ],
            '🏫🕵️‍♂️': [
                '"성적 이상을 감지하고 싶어요!"',
                '"비정상적인 성적 패턴을 찾고 싶어요!"',
                '"성적 데이터에서 이상을 감지하고 싶어요!"'
            ],
            '🛒🗂': [
                '"고객별로 맞춤 상품을 추천하고 싶어요!"',
                '"구매 패턴으로 상품을 추천하고 싶어요!"',
                '"개인화 추천 시스템을 만들고 싶어요!"'
            ],
            '🛒🧩': [
                '"고객 구매 패턴을 그룹별로 나누고 싶어요!"',
                '"유사한 구매 행동을 찾고 싶어요!"',
                '"고객 세분화를 하고 싶어요!"'
            ],
            '🛒🕵️‍♂️': [
                '"이상한 구매 행동을 감지하고 싶어요!"',
                '"구매 사기를 감지하고 싶어요!"',
                '"비정상적인 구매 패턴을 찾고 싶어요!"'
            ]
        };

        // AI 히어로 응답
        this.heroResponses = {
            correct: [
                '"완벽한 조합이네요! 바로 만들어드릴게요!"',
                '"이상적인 솔루션입니다! 금방 완성됩니다!"',
                '"완벽해요! 마법의 AI 솔루션을 제조하겠습니다!"',
                '"훌륭한 선택이에요! 최고의 결과를 보장합니다!"'
            ],
            incorrect: [
                '"음... 다른 조합을 시도해보시겠어요?"',
                '"이 조합은 조금 어려울 것 같아요..."',
                '"다른 재료를 선택해보시는 건 어떨까요?"',
                '"이 조합은 예상과 다르네요..."'
            ]
        };

        // 힌트 시스템
        this.hints = {
            '📝🤖': '상품 리뷰 텍스트 + 분류 알고리즘',
            '📝🕵️‍♂️': '상품 리뷰 텍스트 + 이상탐지 알고리즘',
            '📝🗂': '상품 리뷰 텍스트 + 추천 알고리즘',
            '🖼🤖': '의료 X-ray 이미지 + 분류 알고리즘',
            '🖼🕵️‍♂️': '의료 X-ray 이미지 + 이상탐지 알고리즘',
            '📹🤖': 'CCTV 영상 + 분류 알고리즘',
            '📹🕵️‍♂️': 'CCTV 영상 + 이상탐지 알고리즘',
            '📈📊': 'POS 매출표 + 예측 알고리즘',
            '📈🧩': 'POS 매출표 + 군집 알고리즘',
            '📈🕵️‍♂️': 'POS 매출표 + 이상탐지 알고리즘',
            '🗺🧩': 'GPS 위치 기록 + 군집 알고리즘',
            '🗺🗂': 'GPS 위치 기록 + 추천 알고리즘',
            '🗺🕵️‍♂️': 'GPS 위치 기록 + 이상탐지 알고리즘',
            '🏭🕵️‍♂️': 'IoT 센서 로그 + 이상탐지 알고리즘',
            '🏭📊': 'IoT 센서 로그 + 예측 알고리즘',
            '🏭🧩': 'IoT 센서 로그 + 군집 알고리즘',
            '🏫📊': '학생 성적표 + 예측 알고리즘',
            '🏫🧩': '학생 성적표 + 군집 알고리즘',
            '🏫🕵️‍♂️': '학생 성적표 + 이상탐지 알고리즘',
            '🛒🗂': '고객 행동 로그 + 추천 알고리즘',
            '🛒🧩': '고객 행동 로그 + 군집 알고리즘',
            '🛒🕵️‍♂️': '고객 행동 로그 + 이상탐지 알고리즘'
        };

        // 조합 결과 시스템
        this.solutionResults = {
            '📝🤖': { emoji: '📊', text: '감정분석기' },
            '📝🕵️‍♂️': { emoji: '🛡️', text: '스팸탐지기' },
            '📝🗂': { emoji: '🎯', text: '추천엔진' },
            '🖼🤖': { emoji: '🔬', text: '의료진단기' },
            '🖼🕵️‍♂️': { emoji: '⚠️', text: '이상감지기' },
            '📹🤖': { emoji: '👁️', text: '객체인식기' },
            '📹🕵️‍♂️': { emoji: '🚨', text: '보안감지기' },
            '📈📊': { emoji: '📈', text: '매출예측기' },
            '📈🧩': { emoji: '📊', text: '패턴분석기' },
            '📈🕵️‍♂️': { emoji: '💡', text: '이상탐지기' },
            '🗺🧩': { emoji: '🗺️', text: '위치분석기' },
            '🗺🗂': { emoji: '📍', text: '위치추천기' },
            '🗺🕵️‍♂️': { emoji: '🚔', text: '이동감지기' },
            '🏭🕵️‍♂️': { emoji: '⚙️', text: '센서감지기' },
            '🏭📊': { emoji: '🔧', text: '고장예측기' },
            '🏭🧩': { emoji: '🏭', text: '센서분석기' },
            '🏫📊': { emoji: '📚', text: '성적예측기' },
            '🏫🧩': { emoji: '👥', text: '학습분류기' },
            '🏫🕵️‍♂️': { emoji: '📋', text: '성적감지기' },
            '🛒🗂': { emoji: '🛍️', text: '개인추천기' },
            '🛒🧩': { emoji: '👤', text: '고객분류기' },
            '🛒🕵️‍♂️': { emoji: '🔍', text: '구매감지기' }
        };
    }

    getRandomOrder() {
        return this.orders[Math.floor(Math.random() * this.orders.length)];
    }

    getCustomerProblem(orderObj) {
        return orderObj.problem;
    }

    getHeroResponse(isCorrect) {
        const responses = isCorrect ? this.heroResponses.correct : this.heroResponses.incorrect;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHint(orderObj) {
        const pairKey = orderObj.pair.join('');
        return this.hints[pairKey] || '이 조합에 대한 힌트가 준비 중이에요!';
    }

    getSolutionResult(selected) {
        const pairKey = selected.sort().join('');
        return this.solutionResults[pairKey] || { emoji: '🧪', text: 'AI솔루션' };
    }

    isValidCombination(selected) {
        if (selected.length !== 2) return false;
        const [a, b] = selected;
        const t1 = this.ingredientTypes[a];
        const t2 = this.ingredientTypes[b];
        return (t1 === 'data' && t2 === 'algo') || (t1 === 'algo' && t2 === 'data');
    }

    checkOrderMatch(selected, orderObj) {
        if (selected.length !== 2) return false;
        const s = [...selected].sort().join('');
        const o = [...orderObj.pair].sort().join('');
        return s === o;
    }

    getIconByKey(key) {
        return this.keyboardMapping[key];
    }
}

// UI 관리
class UIManager {
    constructor() {
        // 손님 말풍선
        this.customerProblem = document.getElementById('customer-problem');
        this.customerBubble = document.querySelector('.customer-bubble');
        this.customerAvatar = document.querySelector('.customer-avatar');
        this.customerWrap = document.querySelector('.customer-wrap');
        // 버튼
        this.noBtn = document.getElementById('no-btn');
        // 재료
        this.ingredients = document.querySelectorAll('.ingredient');
        // 점수/타이머
        this.timeElement = document.getElementById('time');
        this.scoreElement = document.getElementById('score');
        // 피드백/모달
        this.feedbackBubble = document.getElementById('feedback-bubble');
        this.feedbackText = document.getElementById('feedback-text');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.finalScoreElement = document.getElementById('final-score');
        this.highScoreElement = document.getElementById('high-score');
        this.restartBtn = document.getElementById('restart-btn');
        this.homeBtn = document.getElementById('home-btn');
        // 힌트
        this.hintArea = document.getElementById('hint-area');
        this.hintContent = document.getElementById('hint-content');
    }

    updateCustomerProblem(problem) {
        this.customerProblem.textContent = problem;
    }

    updateTimer(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const dec = Math.floor((time % 1) * 10);
        this.timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${dec}`;
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
    }

    clearSelection() {
        this.ingredients.forEach(ingredient => {
            ingredient.classList.remove('selected');
        });
        this.updateSolutionSlot([]);
    }

    selectIngredient(element, selected) {
        element.classList.add('selected');
        this.updateSolutionSlot(selected);
    }

    getIngredientByIcon(icon) {
        return Array.from(this.ingredients).find(ingredient => 
            ingredient.querySelector('.ingredient-icon').textContent === icon
        );
    }

    showFeedback(message, isPerfect = false) {
        this.feedbackText.textContent = message;
        this.feedbackBubble.className = `feedback-bubble ${isPerfect ? 'perfect' : 'oops'}`;
        this.feedbackBubble.style.display = 'block';
        setTimeout(() => {
            this.feedbackBubble.style.display = 'none';
        }, 2000); // 2초 후 숨김
    }

    showGameOver(finalScore, highScore) {
        this.finalScoreElement.textContent = finalScore;
        this.highScoreElement.textContent = highScore;
        this.gameOverModal.classList.remove('hidden');
    }

    hideGameOver() {
        this.gameOverModal.classList.add('hidden');
    }

    showHint(hintText) {
        this.hintContent.textContent = hintText;
        this.hintArea.style.display = 'block';
        this.hintArea.classList.add('active');
    }

    hideHint() {
        this.hintArea.style.display = 'block';
        this.hintArea.classList.remove('active');
        this.hintContent.textContent = '';
    }

    showCustomerFeedback(message, isPerfect = false) {
        // 말풍선 전환 애니메이션
        this.customerBubble.classList.add('transitioning');
        
        setTimeout(() => {
            // 내용 변경
            this.customerProblem.textContent = message;
            
            // 색상 변경
            this.customerBubble.className = `customer-bubble ${isPerfect ? 'perfect' : 'oops'}`;
            
            // 전환 애니메이션 완료
            this.customerBubble.classList.remove('transitioning');
        }, 300);
    }

    transitionToNewCustomer() {
        // 고객 사라짐 애니메이션
        this.customerAvatar.classList.add('disappearing');
        this.customerBubble.classList.add('transitioning');
        setTimeout(() => {
            // 말풍선 초기화
            this.customerBubble.className = 'customer-bubble';
            this.customerBubble.classList.remove('transitioning');
            this.customerAvatar.classList.remove('disappearing');
        }, 800);
    }

    getRandomCustomerEmoji() {
        const customers = ['🧑‍🎓', '👩‍💼', '👨‍💻', '👩‍🔬', '👨‍🏫', '👩‍⚕️', '👨‍🔧', '👩‍🎨'];
        return customers[Math.floor(Math.random() * customers.length)];
    }

    updateSolutionSlot(selected) {
        const dataSlot = document.getElementById('slot-data');
        const algoSlot = document.getElementById('slot-algo');
        const resultSlot = document.getElementById('slot-result');
        const plus = document.querySelector('.slot-plus');
        const arrow = document.querySelector('.slot-arrow');
        const selectedIcons = selected || [];
        const dataIcons = ['📝','🖼','📹','📈','🗺','🏭','🏫','🛒'];
        const algoIcons = ['🤖','📊','🧩','🕵️‍♂️','🗂'];
        dataSlot.textContent = '';
        algoSlot.textContent = '';
        resultSlot.textContent = '';
        resultSlot.classList.remove('active');
        plus.style.opacity = '1';
        arrow.style.opacity = '1';
        selectedIcons.forEach(icon => {
            if (dataIcons.includes(icon) && !dataSlot.textContent) dataSlot.textContent = icon;
            if (algoIcons.includes(icon) && !algoSlot.textContent) algoSlot.textContent = icon;
        });
    }

    showSolutionResult(selected) {
        // 선택된 조합에 맞는 결과 표시
        const resultContainer = document.getElementById('slot-result-container');
        const resultSlot = document.getElementById('slot-result');
        const resultText = document.getElementById('slot-result-text');
        const plus = document.querySelector('.slot-plus');
        const arrow = document.querySelector('.slot-arrow');
        
        // 조합 결과 가져오기
        const result = window._game.orderSystem.getSolutionResult(selected);
        resultSlot.textContent = result.emoji;
        resultText.textContent = result.text;
        
        resultContainer.classList.add('active');
        plus.style.opacity = '0.3';
        arrow.style.opacity = '0.3';
    }

    clearSolutionResult() {
        const resultContainer = document.getElementById('slot-result-container');
        const resultSlot = document.getElementById('slot-result');
        const resultText = document.getElementById('slot-result-text');
        resultSlot.textContent = '';
        resultText.textContent = '';
        resultContainer.classList.remove('active');
        const plus = document.querySelector('.slot-plus');
        const arrow = document.querySelector('.slot-arrow');
        plus.style.opacity = '1';
        arrow.style.opacity = '1';
    }

    bindIngredientEvents(onClick) {
        this.ingredients = document.querySelectorAll('.ingredient');
        // 기존 이벤트 완전 제거
        this.ingredients.forEach((ingredient, idx) => {
            const newElem = ingredient.cloneNode(true);
            ingredient.parentNode.replaceChild(newElem, ingredient);
        });
        this.ingredients = document.querySelectorAll('.ingredient');
        this.ingredients.forEach(ingredient => {
            ingredient.onclick = null;
            ingredient.addEventListener('click', () => {
                onClick(ingredient);
            });
        });
    }
}

// 메인 게임 클래스
class AISolutionWorkshop {
    constructor() {
        this.gameState = new GameState();
        this.orderSystem = new OrderSystem();
        this.ui = new UIManager();
        this.timerInterval = null;
        this.bindEvents();
    }

    startGame() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.gameState.isGameActive = true;
        this.gameState.time = 60.0;
        this.gameState.score = 0;
        this.gameState.selectedIngredients = [];
        this.ui.updateScore(0);
        this.ui.updateTimer(60.0);
        this.ui.clearSelection();
        this.generateNewOrder();
        this.ui.hideGameOver && this.ui.hideGameOver();
        this.ui.bindIngredientEvents(this.handleIngredientClick.bind(this));
        // 0.1초 단위 타이머
        this.timerInterval = setInterval(() => {
            if (!this.gameState.isGameActive) return;
            this.gameState.time = Math.max(0, +(this.gameState.time - 0.1).toFixed(1));
            this.ui.updateTimer(this.gameState.time);
            if (this.gameState.time <= 0) this.endGame();
        }, 100);
        playBGM();
    }

    endGame() {
        this.gameState.isGameActive = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.gameState.saveHighScore();
        this.ui.showGameOver(this.gameState.score, this.gameState.highScore);
    }

    bindEvents() {
        this.ui.ingredients.forEach(ingredient => {
            ingredient.addEventListener('click', () => {
                if (!this.gameState.isGameActive) return;
                this.handleIngredientClick(ingredient);
            });
        });
        if (this.ui.noBtn) {
            this.ui.noBtn.addEventListener('click', () => {
                if (!this.gameState.isGameActive) return;
                const hint = this.orderSystem.getHint(this.gameState.currentOrder);
                this.ui.showHint(hint);
                setTimeout(() => {
                    this.ui.hideHint();
                }, 3000); // 3초 후 힌트 숨김
            });
        }
        if (this.ui.restartBtn) {
            this.ui.restartBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
        if (this.ui.homeBtn) {
            this.ui.homeBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        
        // 게임 오버 시 화면 클릭으로 재시작
        document.addEventListener('click', (e) => {
            if (!this.gameState.isGameActive && !this.gameOverModal.classList.contains('hidden')) {
                // 모달 외부 클릭 시 게임 재시작
                if (!this.gameOverModal.contains(e.target)) {
                    this.startGame();
                }
            }
        });
    }

    handleKeyboardInput(e) {
        if (!this.gameState.isGameActive) return;

        const key = e.key;
        const icon = this.orderSystem.getIconByKey(key);
        
        if (icon) {
            e.preventDefault();
            const ingredient = this.ui.getIngredientByIcon(icon);
            if (ingredient) {
                this.handleIngredientClick(ingredient);
            }
        }

        // 스페이스바로 게임 시작
        if (key === ' ' && !this.gameState.isGameActive) {
            e.preventDefault();
            this.startGame();
        }
    }

    handleIngredientClick(ingredient) {
        const icon = ingredient.querySelector('.ingredient-icon').textContent.trim();
        const type = this.orderSystem.ingredientTypes[icon];
        const selected = this.gameState.selectedIngredients;

        // 이미 선택된 경우 해제
        if (selected.includes(icon)) {
            this.gameState.selectedIngredients = selected.filter(item => item !== icon);
            ingredient.classList.remove('selected');
            this.ui.updateSolutionSlot(this.gameState.selectedIngredients);
            return;
        }

        // 이미 2개 선택되어 있으면 아무 일도 하지 않음
        if (selected.length >= 2) return;

        // 이미 데이터/알고리즘이 선택되어 있으면 같은 타입은 선택 불가
        if (selected.length === 1) {
            const selectedType = this.orderSystem.ingredientTypes[selected[0]];
            if (selectedType === type) {
                // 같은 타입 2개 선택 방지 (UI도 그대로 유지)
                return;
            }
        }

        // 선택 추가 및 UI 표시
        this.gameState.selectedIngredients.push(icon);
        this.ui.selectIngredient(ingredient, this.gameState.selectedIngredients);

        // 데이터+알고리즘 조합일 때만 자동 제출
        if (this.gameState.selectedIngredients.length === 2 &&
            this.orderSystem.isValidCombination(this.gameState.selectedIngredients)) {
            this.evaluateOrder();
        }
    }

    evaluateOrder() {
        const selected = this.gameState.selectedIngredients.map(x => x.trim());
        const currentOrder = this.gameState.currentOrder.pair.map(x => x.trim());
        if (!this.orderSystem.isValidCombination(selected)) {
            // 잘못된 조합(데이터+데이터, 알고리즘+알고리즘)은 아무 일도 하지 않음 (선택 유지)
            return;
        }
        if (this.orderSystem.checkOrderMatch(selected, this.gameState.currentOrder)) {
            this.showCorrectFeedback();
        } else {
            this.showIncorrectFeedback();
        }
    }

    showCorrectFeedback() {
        const correctMessages = [
            'Perfect! 정말 감사해요!',
            '정확한 조합이에요! 대단해요!',
            '이 조합이 딱 필요했어요!',
            'AI 솔루션이 완벽하게 만들어졌어요!',
            '최고예요! 감사합니다!'
        ];
        const msg = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        this.gameState.score += 100;
        this.gameState.time = Math.min(this.gameState.time + 0.5, 60.0);
        this.ui.updateScore(this.gameState.score);
        this.ui.updateTimer(this.gameState.time);
        this.ui.showSolutionResult(this.gameState.selectedIngredients);
        this.ui.showCustomerFeedback(msg, true);
        setTimeout(() => {
            this.ui.transitionToNewCustomer();
            setTimeout(() => {
                this.gameState.selectedIngredients = [];
                this.ui.clearSelection();
                this.generateNewOrder();
            }, 800);
        }, 2000);
    }

    showIncorrectFeedback() {
        const wrongMessages = [
            '음... 다른 조합을 시도해보시겠어요?',
            '조금 아쉬워요! 다시 한 번 해볼까요?',
            '이 조합은 아닌 것 같아요.',
            '다른 재료로 시도해보면 어떨까요?',
            '조금만 더 고민해보세요!'
        ];
        const msg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        this.gameState.time = Math.max(this.gameState.time - 2, 0);
        this.ui.updateTimer(this.gameState.time);
        this.ui.showSolutionResult(this.gameState.selectedIngredients);
        this.ui.showCustomerFeedback(msg, false);
        // 2초 후 원래 주문 내용으로 돌아가기 및 선택 초기화
        setTimeout(() => {
            const problem = this.orderSystem.getCustomerProblem(this.gameState.currentOrder);
            this.ui.showCustomerFeedback(problem, false);
            this.gameState.selectedIngredients = [];
            this.ui.clearSelection();
            this.ui.clearSolutionResult(); // 결과도 같이 초기화
        }, 2000);
        if (this.gameState.time <= 0) {
            this.endGame();
        }
    }

    generateNewOrder() {
        this.gameState.currentOrder = this.orderSystem.getRandomOrder();
        if (this.ui.displayOrder) this.ui.displayOrder(this.gameState.currentOrder);
        const problem = this.orderSystem.getCustomerProblem ? this.orderSystem.getCustomerProblem(this.gameState.currentOrder) : '';
        if (this.ui.updateCustomerProblem) this.ui.updateCustomerProblem(problem);
        updateCustomerImage(this.gameState.currentOrder);
        this.ui.hideHint(); // 새로운 주문이 나오면 힌트 숨김
        this.ui.clearSolutionResult();
    }
}

// 게임 시작 화면 관리
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const startGameBtn = document.getElementById('start-game-btn');

// 시작 버튼 클릭 이벤트
startGameBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    window._game.startGame();
    playBGM();
});

// 스페이스바나 화면 클릭으로도 시작 가능
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && startScreen.style.display !== 'none') {
        e.preventDefault();
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        window._game.startGame();
        playBGM();
    }
});

document.addEventListener('click', (e) => {
    if (startScreen.style.display !== 'none' && e.target === startScreen) {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        window._game.startGame();
        playBGM();
    }
});

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    window._game = new AISolutionWorkshop();
    // 자동 시작 제거 - 시작 화면에서만 시작
});

// 데이터 이모지 → 이미지 파일명 매핑
const customerImageMap = {
    '📝': 'customer_review.png',
    '🖼': 'customer_xray.png',
    '📹': 'customer_cctv.png',
    '📈': 'customer_sales.png',
    '🗺': 'customer_gps.png',
    '🏭': 'customer_sensor.png',
    '🏫': 'customer_student.png',
    '🛒': 'customer_log.png'
};

function updateCustomerImage(order) {
    const dataIcon = order.pair[0];
    const imgFile = customerImageMap[dataIcon] || 'customer_review.png';
    const imgElem = document.querySelector('.customer-avatar img');
    if (imgElem) imgElem.src = `assets/${imgFile}`;
}

// BGM 제어
const bgm = document.getElementById('bgm');
const bgmToggleBtn = document.getElementById('bgm-toggle');

function playBGM() {
    if (bgm) {
        bgm.volume = 0.3;
        bgm.play();
        if (bgmToggleBtn) bgmToggleBtn.textContent = '⏸️ 음악 일시정지';
    }
}
function pauseBGM() {
    if (bgm) {
        bgm.pause();
        if (bgmToggleBtn) bgmToggleBtn.textContent = '▶️ 음악 재생';
    }
}
if (bgmToggleBtn) {
    bgmToggleBtn.onclick = function() {
        if (bgm.paused) {
            playBGM();
        } else {
            pauseBGM();
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    playBGM();
}); 