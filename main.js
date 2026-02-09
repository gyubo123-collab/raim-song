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
  { name: '목', vibe: '다정한 성장', note: '새싹 같은 호기심이 반짝이는 기질이에요.' },
  { name: '화', vibe: '따뜻한 열정', note: '애정 표현이 풍부하게 흐르는 기운이에요.' },
  { name: '토', vibe: '포근한 안정', note: '포근한 품처럼 편안함을 추구하는 기운이에요.' },
  { name: '금', vibe: '선명한 집중', note: '놀이와 집중력이 또렷해지는 기운이에요.' },
  { name: '수', vibe: '잔잔한 치유', note: '깊은 감정과 휴식 욕구가 커지는 기운이에요.' },
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
  const baseYear = 1984; // 갑자년
  const offset = year - baseYear;
  const stem = heavenlyStems[getStemBranchIndex(0, offset, heavenlyStems.length)];
  const branch = earthlyBranches[getStemBranchIndex(0, offset, earthlyBranches.length)];
  return { label: `${stem.label}${branch.label}`, elements: [stem.element, branch.element] };
}

function calcDayGanzi(year, month, day) {
  const baseDay = toJulianDay(1984, 2, 2); // 갑자일 기준(간이)
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

function actionGuide(lowElement) {
  const guides = {
    목: '짧은 산책과 냄새 맡기 놀이로 기운을 순환시켜주세요.',
    화: '따뜻한 칭찬과 눈맞춤으로 감정을 데워주세요.',
    토: '폭신한 방석과 안정적인 루틴을 만들어주세요.',
    금: '짧고 선명한 장난감 놀이로 집중력을 살려주세요.',
    수: '조용한 휴식과 충분한 수분 제공이 도움이 돼요.',
  };
  return guides[lowElement] || '부드러운 스킨십과 휴식으로 균형을 보완해주세요.';
}

function dietGuide(lowElement) {
  const guides = {
    목: '가벼운 간식과 수분 간식을 적당히 제공해보세요.',
    화: '과도한 흥분을 피하고 편안한 속도의 식사를 도와주세요.',
    토: '따뜻한 환경에서 식사 시간을 안정적으로 유지해보세요.',
    금: '규칙적인 식사 리듬과 칭찬을 함께 주세요.',
    수: '수분 섭취를 조금 더 챙겨주면 좋아요.',
  };
  return guides[lowElement] || '기본 식사 리듬을 지켜주면 좋아요.';
}

function getSolarTerm(date) {
  const year = date.getFullYear();
  const items = solarTermCalendar.map((term) => ({
    name: term.name,
    date: new Date(year, term.month - 1, term.day),
  }));
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (date >= items[i].date) {
      return items[i].name;
    }
  }
  return '동지';
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
      <p>${name}는 ${element.vibe}의 흐름이 커져요. ${term}의 계절감이 섬세함을 더해 눈빛과 몸짓이 부드러워집니다.</p>
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
      <p>오늘은 ${summary.dominant} 기운이 활발해 활력이 올라요. ${summary.low} 기운 보완을 위해 ${actionGuide(summary.low)}</p>
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
      <p>부드러운 목소리와 일정한 루틴이 잘 통해요. ${summary.secondary} 기운이 다정함을 키워줘 관계가 더 촘촘해집니다.</p>
    </div>
  `;
}

function buildInterpretation(name, element, ganziLabel, term, summary, score) {
  const todayLabel = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const balanceLine = `오행 분포는 ${summary.dominant}·${summary.secondary} 기운이 도드라지고 ${summary.low} 기운이 상대적으로 약해요.`;
  return `
    <p><strong>${name}</strong>의 오늘(${todayLabel})은 <strong>${element.name}</strong> 기운이 중심이에요. ${element.note}</p>
    <p><strong>오행 리듬</strong> : ${balanceLine} 균형을 위해 ${actionGuide(summary.low)}</p>
    <p><strong>감정</strong> : ${element.vibe}의 흐름이 커져서 눈빛과 몸짓에 애정이 더 드러나요. ${term} 절기의 계절감이 더해져 감정 표현이 섬세해집니다.</p>
    <p><strong>건강운</strong> : ${ganziLabel}의 리듬이 몸의 균형을 잡아주는 날이에요. ${dietGuide(summary.low)} 조용한 휴식 공간을 마련하면 안정감이 커져요.</p>
    <p><strong>주인과의 유대감</strong> : 오늘은 ${element.name} 기운이 대화처럼 흐르기 때문에, 부드러운 목소리와 스킨십이 특히 잘 통해요. 함께 있는 시간을 조금만 늘려도 유대감이 깊어질 거예요.</p>
    <p><strong>보너스 조언</strong> : 오행 균형 점수는 목 ${score.목} · 화 ${score.화} · 토 ${score.토} · 금 ${score.금} · 수 ${score.수} 입니다. ${summary.dominant} 기운이 강한 날엔 칭찬과 안정 루틴이 최고의 선물이 돼요.</p>
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
      <p>정보를 입력하면 감정 카드가 채워집니다.</p>
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
      <p>정보를 입력하면 건강운 카드가 채워집니다.</p>
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
      <p>정보를 입력하면 유대감 카드가 채워집니다.</p>
    </div>
  `;
  resultText.innerHTML = '<p>반려동물 정보를 입력하면 해석이 표시됩니다.</p>';
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
  const ganziLabel = `${yearGanzi.label}년 ${monthGanzi.label}월 ${dayGanzi.label}일`;

  const term = getSolarTerm(new Date(year, month - 1, day));
  const allElements = [yearGanzi.elements, monthGanzi.elements, dayGanzi.elements, [element.name]];
  const score = elementScore(allElements);
  const summary = elementSummary(score);

  resultTable.innerHTML = `
    <tr>
      <td>오행</td>
      <td>${element.name}</td>
      <td>${element.vibe} · ${element.note}</td>
    </tr>
    <tr>
      <td>만세력</td>
      <td>${ganziLabel}</td>
      <td>간이 만세력 기반의 간지 흐름으로 오늘의 리듬을 읽어요.</td>
    </tr>
    <tr>
      <td>절기</td>
      <td>${term}</td>
      <td>${term}의 계절 기운이 감정의 결을 부드럽게 만들어줘요.</td>
    </tr>
  `;

  resultCards.innerHTML = buildCards(name, element, term, summary);
  resultText.innerHTML = buildInterpretation(name, element, ganziLabel, term, summary, score);
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
