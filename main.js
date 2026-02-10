const form = document.getElementById('pet-form');
const nameInput = document.getElementById('pet-name');
const genderInput = document.getElementById('pet-gender');
const yearSelect = document.getElementById('birth-year');
const monthSelect = document.getElementById('birth-month');
const daySelect = document.getElementById('birth-day');
const resultTable = document.querySelector('#result-table tbody');
const resultText = document.getElementById('result-text');
const resultCards = document.getElementById('result-cards');
const captureBtn = document.getElementById('capture-btn');
const resetBtn = document.getElementById('reset-btn');
const resultSection = document.getElementById('result-section');

const STORAGE_KEY = 'pet-saju-data-v1';

const elements = [
  { key: '목', name: '목', vibe: '다정한 성장', note: '새싹처럼 호기심이 반짝이는 기질이에요.' },
  { key: '화', name: '화', vibe: '따뜻한 열정', note: '애정 표현이 부드럽게 올라오는 기운이에요.' },
  { key: '토', name: '토', vibe: '포근한 안정', note: '편안함과 안정감을 찾는 기운이에요.' },
  { key: '금', name: '금', vibe: '선명한 집중', note: '놀이와 집중력이 또렷해지는 기운이에요.' },
  { key: '수', name: '수', vibe: '잔잔한 치유', note: '깊은 감정과 휴식 욕구가 커지는 기운이에요.' },
];

const heavenlyStems = [
  { label: '갑', element: '목' },
  { label: '을', element: '목' },
  { label: '병', element: '화' },
  { label: '정', element: '화' },
  { label: '무', element: '토' },
  { label: '기', element: '토' },
  { label: '경', element: '금' },
  { label: '신', element: '금' },
  { label: '임', element: '수' },
  { label: '계', element: '수' },
];

const earthlyBranches = [
  { label: '자', element: '수' },
  { label: '축', element: '토' },
  { label: '인', element: '목' },
  { label: '묘', element: '목' },
  { label: '진', element: '토' },
  { label: '사', element: '화' },
  { label: '오', element: '화' },
  { label: '미', element: '토' },
  { label: '신', element: '금' },
  { label: '유', element: '금' },
  { label: '술', element: '토' },
  { label: '해', element: '수' },
];

const solarTermCalendar = [
  { name: '소한', month: 1, day: 6 },
  { name: '대한', month: 1, day: 20 },
  { name: '입춘', month: 2, day: 4 },
  { name: '우수', month: 2, day: 19 },
  { name: '경칩', month: 3, day: 5 },
  { name: '춘분', month: 3, day: 20 },
  { name: '청명', month: 4, day: 4 },
  { name: '곡우', month: 4, day: 20 },
  { name: '입하', month: 5, day: 5 },
  { name: '소만', month: 5, day: 21 },
  { name: '망종', month: 6, day: 6 },
  { name: '하지', month: 6, day: 21 },
  { name: '소서', month: 7, day: 7 },
  { name: '대서', month: 7, day: 23 },
  { name: '입추', month: 8, day: 7 },
  { name: '처서', month: 8, day: 23 },
  { name: '백로', month: 9, day: 7 },
  { name: '추분', month: 9, day: 23 },
  { name: '한로', month: 10, day: 8 },
  { name: '상강', month: 10, day: 23 },
  { name: '입동', month: 11, day: 7 },
  { name: '소설', month: 11, day: 22 },
  { name: '대설', month: 12, day: 7 },
  { name: '동지', month: 12, day: 21 },
];

const today = new Date();

const guides = {
  action: {
    목: '짧은 산책과 냄새 맡기 놀이는 기운을 부드럽게 순환시켜줘요.',
    화: '따뜻한 칭찬과 눈맞춤이 감정을 편안하게 데워줘요.',
    토: '폭신한 방석과 안정적인 루틴이 마음을 가라앉혀줘요.',
    금: '짧고 집중된 놀이가 에너지를 또렷하게 모아줘요.',
    수: '조용한 휴식과 수분 보충이 회복에 좋아요.',
  },
  diet: {
    목: '가벼운 간식과 수분 간식을 조금 곁들여 주세요.',
    화: '흥분을 줄이고 천천히 먹을 수 있는 분위기가 좋아요.',
    토: '따뜻한 환경에서 식사 리듬을 고정해 주세요.',
    금: '규칙적인 식사와 칭찬이 안정감을 줘요.',
    수: '물 섭취를 조금 더 신경 써 주세요.',
  },
};

const copy = {
  placeholders: {
    result: '반려동물 정보를 입력하면 오늘의 해석이 자연스럽게 보여요.',
    cards: {
      emotion: '정보를 입력하면 반려동물의 마음 흐름이 채워집니다.',
      health: '정보를 입력하면 건강 흐름이 채워집니다.',
      bond: '정보를 입력하면 주인과의 교감 흐름이 채워집니다.',
    },
  },
  table: {
    elementMeaning: '반려동물의 기질과 반응을 이루는 기본 에너지예요.',
    ganziMeaning: '태어난 날의 간지 흐름을 보여줘요.',
    termMeaning: '계절의 기운이 마음 결에 영향을 줘요.',
    ganziDesc: '간지 흐름이 오늘의 리듬과 균형에 영향을 줘요.',
    termDesc: '절기의 계절 기운이 감정의 결을 부드럽게 만들어줘요.',
  },
  sections: {
    analysis: '오행 리듬',
    emotion: '감정',
    health: '건강운',
    bond: '유대감',
    bonus: '보너스 조언',
  },
};

const interpret = {
  emotionLines: [
    '오늘 마음속 생각은 “주인이 나를 보고 있을까?”에 가까워요. 관심을 받고 싶다는 마음이 커집니다.',
    '지금은 “조금 더 가까이 있고 싶어”라는 마음이 강해요. 작은 손길에도 기대감이 커집니다.',
    '오늘의 생각은 “지금이 편안한 시간이야”로 이어지기 쉬워요. 안정감을 확인하려는 마음이 커집니다.',
    '머릿속에는 “오늘은 나를 알아봐 줬으면 좋겠어”라는 메시지가 흐르고 있어요.',
    '지금은 “조금 놀아볼까?”라는 생각이 도드라져요. 짧은 놀이에 대한 기대감이 커집니다.',
    '오늘의 속마음은 “조용히 쉬면서도 곁에 있고 싶어”에 가까워요.',
    '“나를 안심시켜 줘”라는 감각이 있어요. 익숙한 루틴이 마음을 편하게 해줘요.',
    '작은 신호에도 반응하고 싶어지는 날이에요. 눈빛과 몸짓이 섬세해져요.',
    '지금은 “내가 하는 걸 봐줘”라는 생각이 커요. 주인의 반응을 기다리는 마음이 길어집니다.',
    '오늘은 “내가 선택할게”라는 기분이 살아나요. 스스로 움직이거나 자리를 고르는 행동이 늘 수 있어요.',
    '“살짝 기대도 될까?”라는 마음이 오르며 가까운 거리에서 안정감을 찾으려 합니다.',
    '“오늘은 차분히 지켜보고 싶어”라는 생각이 강해져요. 느린 리듬이 더 잘 맞는 날입니다.',
  ],
  emotionTail: [
    '그래서 조용히 곁에 머물거나 부드럽게 애교를 부리는 행동이 늘 수 있어요.',
    '작은 칭찬에도 기분이 쉽게 올라오는 하루예요.',
    '마음이 차분하게 정리되어 잠시 쉬고 싶다는 신호가 자연스럽게 나올 수 있어요.',
    '주변 소리와 냄새에 더 섬세하게 반응할 수 있어요.',
    '느린 리듬이 가장 잘 어울리는 날이에요.',
    '짧은 눈맞춤만으로도 기분이 금세 풀릴 수 있어요.',
    '오늘은 부드러운 손길이 마음을 안정시키는 데 특히 잘 맞아요.',
    '과한 자극보다는 익숙한 리듬이 더 편안하게 느껴질 거예요.',
  ],
  healthLines: [
    '몸의 리듬이 안정되는 날이라 가벼운 활동과 충분한 휴식이 균형을 만들어줘요.',
    '과한 흥분보다는 규칙적인 놀이가 컨디션에 잘 맞아요.',
    '짧고 빈번한 휴식이 도움이 됩니다.',
    '체력의 흐름이 고르게 퍼져 가벼운 움직임이 좋아요.',
    '무리한 운동보다는 짧게 여러 번 나눠주는 활동이 잘 맞아요.',
    '컨디션이 들쑥날쑥하지 않게 리듬을 잡아주는 날이에요.',
    '회복력이 안정적으로 이어져 기본 컨디션을 유지하기 좋아요.',
    '오늘은 가볍게 움직이고 충분히 쉬는 조합이 가장 적절해요.',
  ],
  healthTail: [
    '수분과 영양 보완을 더하면 컨디션이 더 편안하게 유지됩니다.',
    '조용한 휴식 공간을 마련하면 안정감이 커져요.',
    '짧은 놀이와 휴식을 번갈아 주면 균형이 잘 맞습니다.',
    '가벼운 산책과 휴식을 섞으면 회복이 빨라져요.',
    '평소보다 낮은 강도의 활동이 컨디션 유지에 더 좋아요.',
    '따뜻한 자리와 규칙적인 리듬이 몸의 균형을 잡아줘요.',
    '에너지 기복을 줄이기 위해 루틴을 조금 더 고정해 주세요.',
  ],
  bondLines: [
    '따뜻한 교감이 커지고, 유대감이 단단하게 잡혀요.',
    '다정함이 돋보이고 신뢰가 차분히 쌓이는 날이에요.',
    '마음의 거리감이 줄어들고 부드럽게 연결돼요.',
    '소통의 리듬이 살아나 교감이 자연스럽게 이어져요.',
    '작은 반응에도 마음이 열리기 쉬워 신뢰가 깊어질 수 있어요.',
    '함께 있는 시간이 길지 않아도 유대감이 잘 채워지는 날이에요.',
    '일상적인 루틴 속에서도 충분히 교감이 쌓이는 흐름이에요.',
  ],
  bondTail: [
    '짧은 칭찬이나 눈맞춤만으로도 신뢰가 깊어질 수 있어요.',
    '작은 손길 하나에도 크게 반응할 수 있으니 천천히 리듬을 맞춰보세요.',
    '목소리 톤을 부드럽게 맞추면 유대감이 더 촘촘해질 거예요.',
    '익숙한 놀이를 반복해주면 안정적인 유대감이 깊어집니다.',
    '오늘은 기다려주는 태도가 큰 신뢰로 돌아올 수 있어요.',
    '짧은 교감이라도 자주 이어주면 더 편안해질 거예요.',
  ],
  bonusLines: [
    '강한 기운을 억지로 누르기보다 약한 기운을 보완하는 루틴을 더하면 균형이 부드럽게 맞춰져요.',
    '우세한 기운을 살리면서 약한 기운을 채워주면 감정과 컨디션이 더 안정돼요.',
    '오늘은 작은 배려가 큰 안정감으로 돌아오는 날입니다.',
    '약한 기운을 보완하는 작은 행동을 반복해보세요.',
    '평소 루틴을 조금 더 정돈하면 전체 흐름이 편안해져요.',
    '부드러운 리듬을 유지하면 오늘의 기운이 가장 잘 살아나요.',
    '짧고 잦은 교감이 오늘의 안정감을 키워줄 수 있어요.',
  ],
};

function pad(num) {
  return String(num).padStart(2, '0');
}

function initSelects() {
  const currentYear = today.getFullYear();
  const startYear = 1980;
  yearSelect.innerHTML = '<option value="" disabled selected>년도</option>';
  for (let y = currentYear; y >= startYear; y -= 1) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = `${y}년`;
    yearSelect.appendChild(option);
  }

  monthSelect.innerHTML = '<option value="" disabled selected>월</option>';
  for (let m = 1; m <= 12; m += 1) {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = `${m}월`;
    monthSelect.appendChild(option);
  }

  updateDays();
}

function updateDays() {
  const year = Number(yearSelect.value);
  const month = Number(monthSelect.value);
  const days = year && month ? new Date(year, month, 0).getDate() : 31;
  daySelect.innerHTML = '<option value="" disabled selected>일</option>';
  for (let d = 1; d <= days; d += 1) {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = `${d}일`;
    daySelect.appendChild(option);
  }
}

function seedFromInput(name, gender, year, month, day) {
  let seed = year + month * 31 + day * 17;
  for (const char of name) {
    seed += char.charCodeAt(0);
  }
  seed += gender === 'female' ? 13 : gender === 'male' ? 7 : 5;
  return seed;
}

function toJulianDay(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getStemBranchIndex(baseIndex, offset, length) {
  return (baseIndex + offset + length) % length;
}

function getGanziFromOffset(offset) {
  const stem = heavenlyStems[getStemBranchIndex(0, offset, heavenlyStems.length)];
  const branch = earthlyBranches[getStemBranchIndex(0, offset, earthlyBranches.length)];
  return { label: `${stem.label}${branch.label}`, elements: [stem.element, branch.element] };
}

function calcYearGanzi(year) {
  const baseYear = 1984;
  const offset = year - baseYear;
  const stem = heavenlyStems[getStemBranchIndex(0, offset, heavenlyStems.length)];
  const branch = earthlyBranches[getStemBranchIndex(0, offset, earthlyBranches.length)];
  return { label: `${stem.label}${branch.label}`, elements: [stem.element, branch.element] };
}

function calcDayGanzi(year, month, day) {
  const baseDay = toJulianDay(1984, 2, 2);
  const target = toJulianDay(year, month, day);
  const offset = target - baseDay;
  return getGanziFromOffset(offset);
}

function calcMonthGanzi(year, month) {
  const yearStemIndex = getStemBranchIndex(0, year - 1984, heavenlyStems.length);
  const monthStemIndex = (yearStemIndex * 2 + month + 1) % heavenlyStems.length;
  const monthBranchIndex = (month + 1) % earthlyBranches.length;
  const stem = heavenlyStems[monthStemIndex];
  const branch = earthlyBranches[monthBranchIndex];
  return { label: `${stem.label}${branch.label}`, elements: [stem.element, branch.element] };
}

function elementScore(elementsList) {
  const score = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  elementsList.flat().forEach((item) => {
    score[item] += 1;
  });
  return score;
}

function elementSummary(score) {
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][0];
  const secondary = sorted[1][0];
  const low = sorted[sorted.length - 1][0];
  return { dominant, secondary, low };
}

function getSolarTermIndex(date) {
  const year = date.getFullYear();
  const items = solarTermCalendar.map((term, index) => ({
    index,
    date: new Date(year, term.month - 1, term.day),
  }));
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (date >= items[i].date) {
      return items[i].index;
    }
  }
  return 23;
}

function pick(list, seed, offset) {
  return list[(seed + offset) % list.length];
}

function renderPlaceholders() {
  resultTable.innerHTML = `
    <tr>
      <td>오행</td>
      <td>-</td>
      <td>${copy.table.elementMeaning}</td>
    </tr>
    <tr>
      <td>만세력</td>
      <td>-</td>
      <td>${copy.table.ganziMeaning}</td>
    </tr>
    <tr>
      <td>절기</td>
      <td>-</td>
      <td>${copy.table.termMeaning}</td>
    </tr>
  `;

  resultCards.innerHTML = `
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-6.5-4.4-8.5-7.4C1.3 10.6 2.2 7.2 5 6c2-0.8 4.1 0.1 5 1.7 0.9-1.6 3-2.5 5-1.7 2.8 1.2 3.7 4.6 1.5 7.6C18.5 16.6 12 21 12 21z" />
          </svg>
        </span>
        <h3>감정</h3>
      </div>
      <p>${copy.placeholders.cards.emotion}</p>
    </div>
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 19c3-5 7-5 10 0" />
            <path d="M5 11c2-3 4-3 6 0" />
            <path d="M13 11c2-3 4-3 6 0" />
            <circle cx="12" cy="7" r="3" />
          </svg>
        </span>
        <h3>건강운</h3>
      </div>
      <p>${copy.placeholders.cards.health}</p>
    </div>
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 12c0-2.8 2.2-5 5-5h5" />
            <path d="M17 12c0 2.8-2.2 5-5 5H7" />
            <path d="M5 12h14" />
          </svg>
        </span>
        <h3>유대감</h3>
      </div>
      <p>${copy.placeholders.cards.bond}</p>
    </div>
  `;

  resultText.innerHTML = `<p>${copy.placeholders.result}</p>`;
}

function buildCards(name, element, term, summary) {
  return `
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-6.5-4.4-8.5-7.4C1.3 10.6 2.2 7.2 5 6c2-0.8 4.1 0.1 5 1.7 0.9-1.6 3-2.5 5-1.7 2.8 1.2 3.7 4.6 1.5 7.6C18.5 16.6 12 21 12 21z" />
          </svg>
        </span>
        <h3>감정</h3>
      </div>
      <p>${name} · ${element.vibe} · ${term}</p>
    </div>
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 19c3-5 7-5 10 0" />
            <path d="M5 11c2-3 4-3 6 0" />
            <path d="M13 11c2-3 4-3 6 0" />
            <circle cx="12" cy="7" r="3" />
          </svg>
        </span>
        <h3>건강운</h3>
      </div>
      <p>${summary.dominant} ↑, ${summary.low} ↓</p>
    </div>
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 12c0-2.8 2.2-5 5-5h5" />
            <path d="M17 12c0 2.8-2.2 5-5 5H7" />
            <path d="M5 12h14" />
          </svg>
        </span>
        <h3>유대감</h3>
      </div>
      <p>${summary.secondary} · 교감 강화</p>
    </div>
  `;
}

function buildInterpretation(name, element, ganziLabel, term, summary, score, seedValue) {
  const todayLabel = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  return `
    <p><strong>${name}</strong> (${todayLabel}) · <strong>${element.name}</strong></p>
    <p><strong>${copy.sections.analysis}</strong> : ${summary.dominant}·${summary.secondary} 기운이 돋보이고 ${summary.low} 기운이 약해요. ${guides.action[summary.low]}</p>
    <p><strong>${copy.sections.emotion}</strong> : ${pick(interpret.emotionLines, seedValue, 1)} ${pick(interpret.emotionTail, seedValue, 2)}</p>
    <p><strong>${copy.sections.health}</strong> : ${pick(interpret.healthLines, seedValue, 3)} ${pick(interpret.healthTail, seedValue, 4)} ${guides.diet[summary.low]}</p>
    <p><strong>${copy.sections.bond}</strong> : ${pick(interpret.bondLines, seedValue, 5)} ${pick(interpret.bondTail, seedValue, 6)}</p>
    <p><strong>${copy.sections.bonus}</strong> : ${pick(interpret.bonusLines, seedValue, 7)} 오행 점수는 목 ${score.목} · 화 ${score.화} · 토 ${score.토} · 금 ${score.금} · 수 ${score.수} 입니다.</p>
  `;
}

function saveInputs() {
  const payload = {
    name: nameInput.value.trim(),
    gender: genderInput.value,
    year: yearSelect.value,
    month: monthSelect.value,
    day: daySelect.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadInputs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.name) nameInput.value = data.name;
    if (data.gender) genderInput.value = data.gender;
    if (data.year) yearSelect.value = data.year;
    if (data.month) monthSelect.value = data.month;
    updateDays();
    if (data.day) daySelect.value = data.day;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function resetInputs() {
  nameInput.value = '';
  genderInput.value = '';
  yearSelect.value = '';
  monthSelect.value = '';
  updateDays();
  localStorage.removeItem(STORAGE_KEY);
  renderPlaceholders();
}

async function captureResult() {
  if (!window.html2canvas) {
    alert('이미지 저장 기능을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
    return;
  }
  captureBtn.disabled = true;
  captureBtn.textContent = '이미지 생성 중...';
  try {
    const canvas = await window.html2canvas(resultSection, {
      backgroundColor: '#fffaf6',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = 'pet-saju-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    alert('이미지 저장 중 오류가 발생했어요. 다시 시도해주세요.');
  } finally {
    captureBtn.disabled = false;
    captureBtn.textContent = '결과 이미지 저장';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const gender = genderInput.value;
  const year = Number(yearSelect.value);
  const month = Number(monthSelect.value);
  const day = Number(daySelect.value);

  if (!name || !gender || !year || !month || !day) {
    resultText.innerHTML = '<p>모든 정보를 채워주면 해석을 시작할 수 있어요.</p>';
    return;
  }

  const seed = seedFromInput(name, gender, year, month, day);
  const element = elements[seed % elements.length];

  const yearGanzi = calcYearGanzi(year);
  const monthGanzi = calcMonthGanzi(year, month);
  const dayGanzi = calcDayGanzi(year, month, day);
  const ganziLabel = `${yearGanzi.label} ${monthGanzi.label} ${dayGanzi.label}`;

  const termIndex = getSolarTermIndex(new Date(year, month - 1, day));
  const term = solarTermCalendar[termIndex].name;
  const allElements = [yearGanzi.elements, monthGanzi.elements, dayGanzi.elements, [element.key]];
  const score = elementScore(allElements);
  const summary = elementSummary(score);
  const seedValue = seed + score.목 * 3 + score.화 * 5 + score.토 * 7 + score.금 * 11 + score.수 * 13;

  resultTable.innerHTML = `
    <tr>
      <td>오행</td>
      <td>${element.name}</td>
      <td>${element.vibe} · ${element.note}</td>
    </tr>
    <tr>
      <td>만세력</td>
      <td>${ganziLabel}</td>
      <td>${copy.table.ganziDesc}</td>
    </tr>
    <tr>
      <td>절기</td>
      <td>${term}</td>
      <td>${copy.table.termDesc}</td>
    </tr>
  `;

  resultCards.innerHTML = buildCards(name, element, term, summary);
  resultText.innerHTML = buildInterpretation(name, element, ganziLabel, term, summary, score, seedValue);
  saveInputs();
});

yearSelect.addEventListener('change', () => {
  updateDays();
  saveInputs();
});

monthSelect.addEventListener('change', () => {
  updateDays();
  saveInputs();
});

daySelect.addEventListener('change', saveInputs);
nameInput.addEventListener('input', saveInputs);
genderInput.addEventListener('change', saveInputs);
resetBtn.addEventListener('click', resetInputs);
captureBtn.addEventListener('click', captureResult);

initSelects();
loadInputs();
renderPlaceholders();
