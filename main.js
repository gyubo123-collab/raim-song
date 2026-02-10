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
const languageSelect = document.getElementById('language-select');

const STORAGE_KEY = 'pet-saju-data-v1';
const LANG_KEY = 'pet-saju-lang-v1';

const translations = {
  ko: {
    label: '한국어',
    dir: 'ltr',
    site_title: '사주로 보는 반려동물 생각',
    hero_badge: 'Pet Saju Studio',
    hero_title: '사주로 보는 반려동물 생각',
    hero_desc: '사랑스러운 반려동물의 오늘을 오행 · 만세력 · 절기로 따뜻하게 읽어드려요. 간단한 입력만으로 귀여운 해석을 만나보세요.',
    section_input_title: '반려동물 정보 입력',
    label_language: '언어',
    label_pet_name: '반려동물 이름',
    placeholder_pet_name: '예: 뭉치',
    label_gender: '성별',
    option_gender_placeholder: '선택해주세요',
    option_gender_female: '암컷',
    option_gender_male: '수컷',
    option_gender_neutral: '중성/모름',
    label_birthdate: '생년월일',
    option_year: '년도',
    option_month: '월',
    option_day: '일',
    btn_submit: '사주 보기',
    btn_reset: '입력 초기화',
    section_table_title: '오행 · 만세력 · 절기 결과',
    table_note: '간이 만세력 기준으로 계산된 결과이며, 참고용으로 즐겨주세요.',
    th_category: '구분',
    th_value: '결과',
    th_meaning: '의미',
    row_element: '오행',
    row_ganzi: '만세력',
    row_term: '절기',
    row_element_meaning: '반려동물의 기질을 이루는 기본 요소',
    row_ganzi_meaning: '태어난 날의 간지 흐름',
    row_term_meaning: '계절의 기운과 마음 결',
    row_ganzi_desc: '간지 흐름이 오늘의 기운 균형에 영향을 줘요.',
    row_term_desc: '절기의 계절 기운이 감정의 결을 부드럽게 해줘요.',
    section_today_title: '오늘의 해석',
    section_today_intro: '오늘(현시간 기준)의 감정, 건강운, 유대감을 자세히 해석해요.',
    btn_capture: '결과 이미지 저장',
    footer_note: '사랑의 마음으로 해석한 재미 요소이며, 반려동물과의 따뜻한 하루를 위한 참고용입니다.',
    card_emotion: '감정',
    card_health: '건강운',
    card_bond: '유대감',
    card_placeholder_emotion: '정보를 입력하면 감정 카드가 채워집니다.',
    card_placeholder_health: '정보를 입력하면 건강운 카드가 채워집니다.',
    card_placeholder_bond: '정보를 입력하면 유대감 카드가 채워집니다.',
    result_placeholder: '반려동물 정보를 입력하면 해석이 표시됩니다.',
    msg_missing: '모든 정보를 채워주면 해석을 시작할 수 있어요.',
    msg_capture_loading: '이미지 생성 중...',
    msg_capture_error: '이미지 저장 중 오류가 발생했어요. 다시 시도해주세요.',
    msg_capture_missing: '이미지 저장 기능을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
    analysis_title: '오행 리듬',
    emotion_title: '감정',
    health_title: '건강운',
    bond_title: '주인과의 유대감',
    bonus_title: '보너스 조언',
    balance_line: (d, s, l) => `오행 분포는 ${d}·${s} 기운이 도드라지고 ${l} 기운이 상대적으로 약해요.`,
    guide_action: {
      목: '짧은 산책과 냄새 맡기 놀이로 기운을 순환시켜주세요.',
      화: '따뜻한 칭찬과 눈맞춤으로 감정을 데워주세요.',
      토: '폭신한 방석과 안정적인 루틴을 만들어주세요.',
      금: '짧고 선명한 장난감 놀이로 집중력을 살려주세요.',
      수: '조용한 휴식과 충분한 수분 제공이 도움이 돼요.',
    },
    guide_diet: {
      목: '가벼운 간식과 수분 간식을 적당히 제공해보세요.',
      화: '과도한 흥분을 피하고 편안한 속도의 식사를 도와주세요.',
      토: '따뜻한 환경에서 식사 시간을 안정적으로 유지해보세요.',
      금: '규칙적인 식사 리듬과 칭찬을 함께 주세요.',
      수: '수분 섭취를 조금 더 챙겨주면 좋아요.',
    },
    elements: {
      목: { name: '목', vibe: '다정한 성장', note: '새싹 같은 호기심이 반짝이는 기질이에요.' },
      화: { name: '화', vibe: '따뜻한 열정', note: '애정 표현이 풍부하게 흐르는 기운이에요.' },
      토: { name: '토', vibe: '포근한 안정', note: '포근한 품처럼 편안함을 추구하는 기운이에요.' },
      금: { name: '금', vibe: '선명한 집중', note: '놀이와 집중력이 또렷해지는 기운이에요.' },
      수: { name: '수', vibe: '잔잔한 치유', note: '깊은 감정과 휴식 욕구가 커지는 기운이에요.' },
    },
    term_names: [
      '소한', '대한', '입춘', '우수', '경칩', '춘분', '청명', '곡우',
      '입하', '소만', '망종', '하지', '소서', '대서', '입추', '처서',
      '백로', '추분', '한로', '상강', '입동', '소설', '대설', '동지',
    ],
    interpret: {
      emotionLines: [
        '오늘 반려동물의 마음속 생각은 “주인이 나를 보고 있을까?”에 가까워요. 관심을 받고 싶다는 마음이 커집니다.',
        '지금 반려동물은 “조금 더 가까이 있고 싶어”라는 마음이 강해요. 작은 손길에도 기대감이 커집니다.',
        '오늘의 생각은 “지금이 편안한 시간이야”로 이어지기 쉬워요. 안정감을 확인하려는 마음이 커집니다.',
        '반려동물의 머릿속에는 “오늘은 나를 알아봐 줬으면 좋겠어”라는 메시지가 흐르고 있어요.',
        '지금은 “조금 놀아볼까?”라는 생각이 도드라져요. 짧은 놀이에 대한 기대감이 커집니다.',
        '오늘의 속마음은 “조용히 쉬면서도 곁에 있고 싶어”에 가까워요.',
      ],
      emotionTail: [
        '그래서 조용히 곁에 머물거나 부드럽게 애교를 부리는 행동이 늘 수 있어요.',
        '덕분에 작은 칭찬에도 기분이 쉽게 올라오는 하루예요.',
        '마음이 차분하게 정리되어 잠시 쉬고 싶다는 신호가 자연스럽게 나올 수 있어요.',
        '주변의 소리와 냄새에 더 섬세하게 반응할 수 있어요.',
      ],
      healthLines: [
        '몸의 리듬이 안정되는 날이라 가벼운 활동과 충분한 휴식이 균형을 만들어줘요.',
        '과한 흥분보다는 규칙적인 놀이가 컨디션에 잘 맞아요.',
        '짧고 빈번한 휴식이 도움이 됩니다.',
        '체력의 흐름이 고르게 퍼져 가벼운 움직임이 좋아요.',
      ],
      healthTail: [
        '지금 필요한 수분·영양 보완을 더하면 컨디션이 더 편안하게 유지됩니다.',
        '조용한 휴식 공간을 마련하면 안정감이 커져요.',
        '짧은 놀이와 휴식을 번갈아 주면 균형이 잘 맞습니다.',
      ],
      bondLines: [
        '따뜻한 교감이 커지고, 유대감이 단단하게 잡혀요.',
        '다정함이 돋보이고 신뢰가 차분히 쌓이는 날이에요.',
        '마음의 거리감이 줄어들고 부드럽게 연결돼요.',
        '소통의 리듬이 살아나 교감이 자연스럽게 이어져요.',
      ],
      bondTail: [
        '짧은 칭찬이나 눈맞춤만으로도 신뢰가 깊어질 수 있어요.',
        '작은 손길 하나에도 크게 반응할 수 있으니 천천히 리듬을 맞춰보세요.',
        '목소리 톤을 부드럽게 맞추면 유대감이 더 촘촘해질 거예요.',
      ],
      bonusLines: [
        '강한 기운을 억지로 누르기보다 약한 기운을 보완하는 루틴을 더하면 균형이 부드럽게 맞춰져요.',
        '우세한 기운을 살리면서 약한 기운을 채워주면 감정과 컨디션이 더 안정돼요.',
        '오늘은 작은 배려가 큰 안정감으로 돌아오는 날입니다.',
        '약한 기운을 보완하는 작은 행동을 반복해보세요.',
      ],
    },
  },
  en: {
    label: 'English',
    dir: 'ltr',
    site_title: 'Pet Thoughts Through Saju',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Pet Thoughts Through Saju',
    hero_desc: 'We read your pet’s day with five elements, saju, and seasonal terms. Fill in the info for a warm interpretation.',
    section_input_title: 'Pet Info',
    label_language: 'Language',
    label_pet_name: 'Pet name',
    placeholder_pet_name: 'e.g., Mungchi',
    label_gender: 'Gender',
    option_gender_placeholder: 'Select',
    option_gender_female: 'Female',
    option_gender_male: 'Male',
    option_gender_neutral: 'Neutered/Unknown',
    label_birthdate: 'Birth date',
    option_year: 'Year',
    option_month: 'Month',
    option_day: 'Day',
    btn_submit: 'See Saju',
    btn_reset: 'Reset',
    section_table_title: 'Elements · Saju · Seasonal Term',
    table_note: 'A simplified saju calculation for fun reference.',
    th_category: 'Type',
    th_value: 'Result',
    th_meaning: 'Meaning',
    row_element: 'Five Elements',
    row_ganzi: 'Saju',
    row_term: 'Seasonal term',
    row_element_meaning: 'Core energy of your pet’s temperament',
    row_ganzi_meaning: 'Ganji flow of the birth date',
    row_term_meaning: 'Seasonal energy and mood texture',
    row_ganzi_desc: 'The ganji flow shapes today’s balance of energy.',
    row_term_desc: 'The seasonal term softens the emotional tone.',
    section_today_title: 'Today’s Reading',
    section_today_intro: 'A detailed reading of emotion, health, and bond for today.',
    btn_capture: 'Save Image',
    footer_note: 'For fun and warmth, not a medical or professional reading.',
    card_emotion: 'Emotion',
    card_health: 'Health',
    card_bond: 'Bond',
    card_placeholder_emotion: 'Enter info to fill this card.',
    card_placeholder_health: 'Enter info to fill this card.',
    card_placeholder_bond: 'Enter info to fill this card.',
    result_placeholder: 'Enter your pet info to see the reading.',
    msg_missing: 'Please complete all fields to start the reading.',
    msg_capture_loading: 'Creating image...',
    msg_capture_error: 'Failed to save image. Try again.',
    msg_capture_missing: 'Image capture not ready. Please try again later.',
    analysis_title: 'Element Rhythm',
    emotion_title: 'Emotion',
    health_title: 'Health',
    bond_title: 'Bond with Owner',
    bonus_title: 'Bonus Tips',
    balance_line: (d, s, l) => `The dominant energies are ${d} and ${s}, while ${l} is relatively low.`,
    guide_action: {
      목: 'Short walks and sniffing games help circulation.',
      화: 'Warm praise and eye contact calm emotions.',
      토: 'Soft bedding and stable routines help.',
      금: 'Short, focused toy play helps concentration.',
      수: 'Quiet rest and hydration are helpful.',
    },
    guide_diet: {
      목: 'Offer light snacks and hydrating treats.',
      화: 'Keep meals calm and slow.',
      토: 'Warm setting and steady mealtime.',
      금: 'Regular meal rhythm with praise.',
      수: 'Encourage a bit more water.',
    },
    elements: {
      목: { name: 'Wood', vibe: 'gentle growth', note: 'A spark of curiosity and sprouting energy.' },
      화: { name: 'Fire', vibe: 'warm passion', note: 'Affection flows easily and brightly.' },
      토: { name: 'Earth', vibe: 'cozy stability', note: 'Seeks comfort and steady rhythms.' },
      금: { name: 'Metal', vibe: 'clear focus', note: 'Concentration and play focus rise.' },
      수: { name: 'Water', vibe: 'quiet healing', note: 'Deep feelings and restfulness grow.' },
    },
    term_names: [
      'Minor Cold', 'Major Cold', 'Start of Spring', 'Rain Water', 'Insects Awaken', 'Spring Equinox', 'Clear and Bright', 'Grain Rain',
      'Start of Summer', 'Grain Full', 'Grain in Ear', 'Summer Solstice', 'Minor Heat', 'Major Heat', 'Start of Autumn', 'Limit of Heat',
      'White Dew', 'Autumn Equinox', 'Cold Dew', "Frost's Descent", 'Start of Winter', 'Minor Snow', 'Major Snow', 'Winter Solstice',
    ],
    interpret: {
      emotionLines: [
        'Your pet is thinking, “Are you looking at me right now?” The desire for attention grows.',
        'Today their mind says, “I want to stay a bit closer.” Small touches feel extra meaningful.',
        'Their thought is, “This feels safe.” They seek familiar sounds and steady presence.',
      ],
      emotionTail: [
        'Gentle affection shows up more easily today.',
        'Soft praise lifts their mood quickly.',
        'A calm pace suits their heart best today.',
      ],
      healthLines: [
        'The body rhythm is steady, so light activity and rest balance well.',
        'Regular play beats intense excitement today.',
        'Short breaks help keep energy smooth.',
      ],
      healthTail: [
        'Add hydration and gentle nutrition for comfort.',
        'A quiet resting spot helps stability.',
        'Small play/rest cycles keep balance.',
      ],
      bondLines: [
        'Warm communication deepens the bond today.',
        'Trust builds softly with small signals.',
        'Distance feels shorter and connection smoother.',
      ],
      bondTail: [
        'A brief gaze or praise can go a long way.',
        'Keep the tone gentle and steady.',
        'Small rituals strengthen trust today.',
      ],
      bonusLines: [
        'Support the weaker element to keep the day balanced.',
        'A tiny adjustment in routine can stabilize mood and energy.',
        'Gentle consistency is today’s best gift.',
      ],
    },
  },
  zh: {
    label: '中文',
    dir: 'ltr',
    site_title: '通过四柱看宠物想法',
    hero_badge: 'Pet Saju Studio',
    hero_title: '通过四柱看宠物想法',
    hero_desc: '用五行、四柱与节气温柔解读宠物的今天。填写信息即可查看。',
    section_input_title: '宠物信息',
    label_language: '语言',
    label_pet_name: '宠物名字',
    placeholder_pet_name: '例如：Mungchi',
    label_gender: '性别',
    option_gender_placeholder: '请选择',
    option_gender_female: '母',
    option_gender_male: '公',
    option_gender_neutral: '绝育/未知',
    label_birthdate: '出生日期',
    option_year: '年',
    option_month: '月',
    option_day: '日',
    btn_submit: '查看',
    btn_reset: '重置',
    section_table_title: '五行 · 四柱 · 节气',
    table_note: '简化版四柱，仅供参考。',
    th_category: '类别',
    th_value: '结果',
    th_meaning: '含义',
    row_element: '五行',
    row_ganzi: '四柱',
    row_term: '节气',
    row_element_meaning: '宠物性格的核心能量',
    row_ganzi_meaning: '出生日期的干支流动',
    row_term_meaning: '季节能量与情绪质感',
    row_ganzi_desc: '干支流动影响今天的能量平衡。',
    row_term_desc: '节气能量让情绪更柔和。',
    section_today_title: '今日解读',
    section_today_intro: '解读今天的情绪、健康与亲密度。',
    btn_capture: '保存图片',
    footer_note: '仅供娱乐与温馨参考。',
    card_emotion: '情绪',
    card_health: '健康',
    card_bond: '亲密度',
    card_placeholder_emotion: '输入信息后显示。',
    card_placeholder_health: '输入信息后显示。',
    card_placeholder_bond: '输入信息后显示。',
    result_placeholder: '请输入信息以查看解读。',
    msg_missing: '请完整填写信息。',
    msg_capture_loading: '正在生成图片...',
    msg_capture_error: '保存失败，请重试。',
    msg_capture_missing: '保存功能未准备好。',
    analysis_title: '五行节律',
    emotion_title: '情绪',
    health_title: '健康',
    bond_title: '与主人的关系',
    bonus_title: '加分建议',
    balance_line: (d, s, l) => `以${d}、${s}为主，${l}偏弱。`,
    guide_action: {
      목: '短散步与嗅闻游戏有帮助。',
      화: '温柔称赞与眼神交流。',
      토: '软垫与稳定作息。',
      금: '短而专注的玩具游戏。',
      수: '安静休息与补水。',
    },
    guide_diet: {
      목: '提供清淡与补水零食。',
      화: '保持安静、慢速用餐。',
      토: '温暖环境与规律进食。',
      금: '规律用餐并给予称赞。',
      수: '多补充一点水分。',
    },
    elements: {
      목: { name: '木', vibe: '温柔生长', note: '好奇心被点亮。' },
      화: { name: '火', vibe: '温暖热情', note: '爱意更容易表达。' },
      토: { name: '土', vibe: '踏实稳定', note: '偏好舒适与安定。' },
      금: { name: '金', vibe: '清晰专注', note: '专注力提升。' },
      수: { name: '水', vibe: '安静疗愈', note: '情绪更柔和。' },
    },
    term_names: [
      '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
      '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
      '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
    ],
    interpret: {
      emotionLines: [
        '宠物在想“你在看我吗？”期待被关注。',
        '它更想靠近你，轻轻的触摸也会有回应。',
        '它的心里在说“这里很安全”。',
      ],
      emotionTail: [
        '今天温柔的互动更容易发生。',
        '轻声表扬能快速提升情绪。',
        '慢节奏最让它安心。',
      ],
      healthLines: [
        '节奏稳定，轻量活动与休息更合适。',
        '规律游戏比强刺激更好。',
        '短暂休息能保持状态。',
      ],
      healthTail: [
        '补水与清淡饮食更舒适。',
        '安静的休息角能增强稳定感。',
        '小幅度玩耍与休息交替更平衡。',
      ],
      bondLines: [
        '温和交流能增进亲密。',
        '信任在细微反应中加深。',
        '距离感缩短，连接更自然。',
      ],
      bondTail: [
        '一次眼神或夸奖就很有效。',
        '保持温柔与稳定节奏。',
        '小仪式能加深信任。',
      ],
      bonusLines: [
        '补足偏弱元素会更平衡。',
        '小调整能让情绪更稳定。',
        '温柔一致的照顾是今天的关键。',
      ],
    },
  },
  ja: {
    label: '日本語',
    dir: 'ltr',
    site_title: '四柱で見るペットの気持ち',
    hero_badge: 'Pet Saju Studio',
    hero_title: '四柱で見るペットの気持ち',
    hero_desc: '五行・四柱・節気で、今日のペットをやさしく解釈します。',
    section_input_title: 'ペット情報',
    label_language: '言語',
    label_pet_name: 'ペット名',
    placeholder_pet_name: '例：ムンチ',
    label_gender: '性別',
    option_gender_placeholder: '選択',
    option_gender_female: 'メス',
    option_gender_male: 'オス',
    option_gender_neutral: '避妊/不明',
    label_birthdate: '生年月日',
    option_year: '年',
    option_month: '月',
    option_day: '日',
    btn_submit: '見る',
    btn_reset: 'リセット',
    section_table_title: '五行・四柱・節気',
    table_note: '簡易四柱のため参考程度に。',
    th_category: '項目',
    th_value: '結果',
    th_meaning: '意味',
    row_element: '五行',
    row_ganzi: '四柱',
    row_term: '節気',
    row_element_meaning: '気質の基礎エネルギー',
    row_ganzi_meaning: '生まれた日の干支の流れ',
    row_term_meaning: '季節の気と感情の質',
    row_ganzi_desc: '干支の流れが今日のバランスに影響します。',
    row_term_desc: '節気の気が感情をやわらげます。',
    section_today_title: '今日の解釈',
    section_today_intro: '感情・健康運・絆を詳しく。',
    btn_capture: '画像保存',
    footer_note: '楽しみとしてご利用ください。',
    card_emotion: '感情',
    card_health: '健康運',
    card_bond: '絆',
    card_placeholder_emotion: '情報入力後に表示。',
    card_placeholder_health: '情報入力後に表示。',
    card_placeholder_bond: '情報入力後に表示。',
    result_placeholder: '情報を入力してください。',
    msg_missing: '全ての項目を入力してください。',
    msg_capture_loading: '画像生成中...',
    msg_capture_error: '保存に失敗しました。',
    msg_capture_missing: '保存機能が準備中です。',
    analysis_title: '五行リズム',
    emotion_title: '感情',
    health_title: '健康運',
    bond_title: '飼い主との絆',
    bonus_title: 'ボーナスアドバイス',
    balance_line: (d, s, l) => `${d}・${s}が強く、${l}が弱めです。`,
    guide_action: {
      목: '短い散歩や嗅ぎ遊び。',
      화: '優しい声かけとアイコンタクト。',
      토: 'ふかふかベッドと安定した習慣。',
      금: '短く集中したおもちゃ遊び。',
      수: '静かな休息と水分補給。',
    },
    guide_diet: {
      목: '軽いおやつと水分系おやつ。',
      화: '落ち着いた食事ペース。',
      토: '温かい環境で規則的に。',
      금: '規則的な食事と褒め言葉。',
      수: '水分を少し多めに。',
    },
    elements: {
      목: { name: '木', vibe: 'やさしい成長', note: '好奇心が芽生える。' },
      화: { name: '火', vibe: '温かな情熱', note: '愛情が表れやすい。' },
      토: { name: '土', vibe: '安定と安心', note: '落ち着きを求める。' },
      금: { name: '金', vibe: '明瞭な集中', note: '集中力が高まる。' },
      수: { name: '水', vibe: '静かな癒し', note: '心が穏やかに。' },
    },
    term_names: [
      '小寒', '大寒', '立春', '雨水', '啓蟄', '春分', '清明', '穀雨',
      '立夏', '小満', '芒種', '夏至', '小暑', '大暑', '立秋', '処暑',
      '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
    ],
    interpret: {
      emotionLines: [
        '今の気持ちは「見てほしい」に近いです。',
        '「もう少し近くにいたい」という思いが強まります。',
        '心の中では「ここは安心だ」と感じています。',
      ],
      emotionTail: [
        'やさしい触れ合いが増えやすい日です。',
        '小さな褒め言葉で気分が上がります。',
        'ゆっくりしたリズムが合います。',
      ],
      healthLines: [
        '軽い運動と休息がバランスを整えます。',
        '強い刺激より規則的な遊びが向きます。',
        '短い休憩が体調を支えます。',
      ],
      healthTail: [
        '水分とやさしい食事がよく合います。',
        '静かな休憩場所が安心をくれます。',
        '遊びと休憩を交互に。',
      ],
      bondLines: [
        'やわらかな交流が絆を深めます。',
        '小さな合図で信頼が積み上がります。',
        '距離感が縮まる日です。',
      ],
      bondTail: [
        '短い視線や声かけが効果的。',
        'やさしいトーンを意識して。',
        '小さな習慣が信頼に。',
      ],
      bonusLines: [
        '弱い要素を補うと全体が整います。',
        '小さな調整が安定につながります。',
        'やさしい一貫性が鍵です。',
      ],
    },
  },
  fr: {
    label: 'Français',
    dir: 'ltr',
    site_title: 'Pensées de l’animal par le Saju',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Pensées de l’animal par le Saju',
    hero_desc: 'Lecture douce avec les cinq éléments, le saju et les termes saisonniers.',
    section_input_title: 'Infos de l’animal',
    label_language: 'Langue',
    label_pet_name: 'Nom',
    placeholder_pet_name: 'Ex : Mungchi',
    label_gender: 'Sexe',
    option_gender_placeholder: 'Choisir',
    option_gender_female: 'Femelle',
    option_gender_male: 'Mâle',
    option_gender_neutral: 'Stérilisé/Inconnu',
    label_birthdate: 'Date de naissance',
    option_year: 'Année',
    option_month: 'Mois',
    option_day: 'Jour',
    btn_submit: 'Voir',
    btn_reset: 'Réinitialiser',
    section_table_title: 'Éléments · Saju · Terme',
    table_note: 'Calcul simplifié, pour le plaisir.',
    th_category: 'Type',
    th_value: 'Résultat',
    th_meaning: 'Signification',
    row_element: 'Cinq éléments',
    row_ganzi: 'Saju',
    row_term: 'Terme saisonnier',
    row_element_meaning: 'Énergie de base du tempérament',
    row_ganzi_meaning: 'Flux ganji de la naissance',
    row_term_meaning: 'Énergie saisonnière et humeur',
    row_ganzi_desc: 'Le flux ganji influence l’équilibre du jour.',
    row_term_desc: 'Le terme saisonnier adoucit l’humeur.',
    section_today_title: 'Lecture du jour',
    section_today_intro: 'Émotions, santé et lien aujourd’hui.',
    btn_capture: 'Enregistrer l’image',
    footer_note: 'Lecture ludique et chaleureuse.',
    card_emotion: 'Émotion',
    card_health: 'Santé',
    card_bond: 'Lien',
    card_placeholder_emotion: 'Saisissez les infos.',
    card_placeholder_health: 'Saisissez les infos.',
    card_placeholder_bond: 'Saisissez les infos.',
    result_placeholder: 'Saisissez les infos pour voir la lecture.',
    msg_missing: 'Merci de tout remplir.',
    msg_capture_loading: 'Création de l’image...',
    msg_capture_error: 'Échec de sauvegarde.',
    msg_capture_missing: 'Capture indisponible.',
    analysis_title: 'Rythme des éléments',
    emotion_title: 'Émotion',
    health_title: 'Santé',
    bond_title: 'Lien avec le maître',
    bonus_title: 'Conseil bonus',
    balance_line: (d, s, l) => `${d} et ${s} dominent, ${l} est faible.`,
    guide_action: {
      목: 'Petite balade et jeux d’odorat.',
      화: 'Éloge doux et regard calme.',
      토: 'Coussin doux et routine stable.',
      금: 'Jeu court et concentré.',
      수: 'Repos calme et hydratation.',
    },
    guide_diet: {
      목: 'Snacks légers et hydratants.',
      화: 'Repas calmes et lents.',
      토: 'Environnement chaud et régulier.',
      금: 'Rythme régulier et éloges.',
      수: 'Un peu plus d’eau.',
    },
    elements: {
      목: { name: 'Bois', vibe: 'croissance douce', note: 'Curiosité en éveil.' },
      화: { name: 'Feu', vibe: 'chaleur active', note: 'Affection plus visible.' },
      토: { name: 'Terre', vibe: 'stabilité', note: 'Recherche de confort.' },
      금: { name: 'Métal', vibe: 'focus clair', note: 'Concentration en hausse.' },
      수: { name: 'Eau', vibe: 'apaisement', note: 'Émotions plus calmes.' },
    },
    term_names: [
      'Petit Froid', 'Grand Froid', 'Début du printemps', 'Eau de pluie', 'Éveil des insectes', 'Équinoxe de printemps', 'Clair et lumineux', 'Pluie des grains',
      'Début de l’été', 'Pleine graine', 'Grain en épi', 'Solstice d’été', 'Petite chaleur', 'Grande chaleur', 'Début de l’automne', 'Fin de chaleur',
      'Rosée blanche', 'Équinoxe d’automne', 'Rosée froide', 'Descente du givre', 'Début de l’hiver', 'Petite neige', 'Grande neige', 'Solstice d’hiver',
    ],
    interpret: {
      emotionLines: [
        'Il pense : « Tu me regardes ? »',
        'Il veut se rapprocher un peu plus.',
        'Il se sent en sécurité aujourd’hui.',
      ],
      emotionTail: [
        'Les gestes doux seront bien reçus.',
        'Un petit compliment suffit à le rassurer.',
        'Un rythme lent lui convient.',
      ],
      healthLines: [
        'Activité légère et repos font équilibre.',
        'Le calme est meilleur que l’excitation.',
        'De petites pauses aident beaucoup.',
      ],
      healthTail: [
        'Hydratation et repas doux sont idéals.',
        'Un coin calme améliore la stabilité.',
        'Alterner jeu et repos est parfait.',
      ],
      bondLines: [
        'La connexion se renforce avec douceur.',
        'La confiance monte par petits signes.',
        'La distance émotionnelle diminue.',
      ],
      bondTail: [
        'Un regard ou un mot suffit.',
        'Gardez un ton tendre.',
        'Un petit rituel aide beaucoup.',
      ],
      bonusLines: [
        'Soutenez l’élément faible pour l’équilibre.',
        'Un léger ajustement stabilise la journée.',
        'La constance douce est la clé.',
      ],
    },
  },
  de: {
    label: 'Deutsch',
    dir: 'ltr',
    site_title: 'Tiergedanken durch Saju',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Tiergedanken durch Saju',
    hero_desc: 'Sanfte Deutung mit fünf Elementen, Saju und Jahreszeiten.',
    section_input_title: 'Tierdaten',
    label_language: 'Sprache',
    label_pet_name: 'Name',
    placeholder_pet_name: 'z. B. Mungchi',
    label_gender: 'Geschlecht',
    option_gender_placeholder: 'Auswählen',
    option_gender_female: 'Weiblich',
    option_gender_male: 'Männlich',
    option_gender_neutral: 'Kastriert/Unbekannt',
    label_birthdate: 'Geburtsdatum',
    option_year: 'Jahr',
    option_month: 'Monat',
    option_day: 'Tag',
    btn_submit: 'Ansehen',
    btn_reset: 'Zurücksetzen',
    section_table_title: 'Elemente · Saju · Saison',
    table_note: 'Vereinfachte Berechnung, nur zum Spaß.',
    th_category: 'Typ',
    th_value: 'Ergebnis',
    th_meaning: 'Bedeutung',
    row_element: 'Fünf Elemente',
    row_ganzi: 'Saju',
    row_term: 'Saisonterm',
    row_element_meaning: 'Kernenergie des Temperaments',
    row_ganzi_meaning: 'Ganji-Fluss des Geburtstags',
    row_term_meaning: 'Saisonale Energie und Stimmung',
    row_ganzi_desc: 'Der Ganji-Fluss beeinflusst die Balance des Tages.',
    row_term_desc: 'Der Saisonterm macht die Stimmung weicher.',
    section_today_title: 'Deutung heute',
    section_today_intro: 'Gefühle, Gesundheit und Bindung heute.',
    btn_capture: 'Bild speichern',
    footer_note: 'Nur als warme Unterhaltung.',
    card_emotion: 'Gefühl',
    card_health: 'Gesundheit',
    card_bond: 'Bindung',
    card_placeholder_emotion: 'Infos eingeben.',
    card_placeholder_health: 'Infos eingeben.',
    card_placeholder_bond: 'Infos eingeben.',
    result_placeholder: 'Infos eingeben, um die Deutung zu sehen.',
    msg_missing: 'Bitte alles ausfüllen.',
    msg_capture_loading: 'Bild wird erstellt...',
    msg_capture_error: 'Speichern fehlgeschlagen.',
    msg_capture_missing: 'Capture nicht verfügbar.',
    analysis_title: 'Element-Rhythmus',
    emotion_title: 'Gefühl',
    health_title: 'Gesundheit',
    bond_title: 'Bindung zum Besitzer',
    bonus_title: 'Bonus-Tipp',
    balance_line: (d, s, l) => `${d} und ${s} dominieren, ${l} ist schwach.`,
    guide_action: {
      목: 'Kurzer Spaziergang und Schnüffelspiele.',
      화: 'Sanftes Lob und Blickkontakt.',
      토: 'Weiches Bett und stabile Routine.',
      금: 'Kurzes, fokussiertes Spiel.',
      수: 'Ruhige Ruhe und Wasser.',
    },
    guide_diet: {
      목: 'Leichte Snacks mit Feuchtigkeit.',
      화: 'Ruhiges, langsames Essen.',
      토: 'Warme Umgebung und Regelmäßigkeit.',
      금: 'Regelmäßige Mahlzeiten und Lob.',
      수: 'Etwas mehr Wasser.',
    },
    elements: {
      목: { name: 'Holz', vibe: 'sanftes Wachstum', note: 'Neugier wächst.' },
      화: { name: 'Feuer', vibe: 'warme Energie', note: 'Zuneigung ist sichtbar.' },
      토: { name: 'Erde', vibe: 'stabile Ruhe', note: 'Sucht Komfort.' },
      금: { name: 'Metall', vibe: 'klarer Fokus', note: 'Fokus steigt.' },
      수: { name: 'Wasser', vibe: 'ruhige Heilung', note: 'Gefühle werden weicher.' },
    },
    term_names: [
      'Kleine Kälte', 'Große Kälte', 'Beginn des Frühlings', 'Regenwasser', 'Erwachen der Insekten', 'Frühlings-Tagundnachtgleiche', 'Klar und hell', 'Getreideregen',
      'Beginn des Sommers', 'Kornfülle', 'Korn im Ähr', 'Sommersonnenwende', 'Kleine Hitze', 'Große Hitze', 'Beginn des Herbstes', 'Ende der Hitze',
      'Weißer Tau', 'Herbst-Tagundnachtgleiche', 'Kalter Tau', 'Frostabstieg', 'Beginn des Winters', 'Kleiner Schnee', 'Großer Schnee', 'Wintersonnenwende',
    ],
    interpret: {
      emotionLines: [
        'Der Gedanke ist: „Siehst du mich?“',
        '„Ich möchte näher bleiben“ ist stark.',
        'Heute fühlt es sich sicher an.',
      ],
      emotionTail: [
        'Sanfte Zuwendung wirkt besonders gut.',
        'Kleines Lob hebt die Stimmung.',
        'Ein ruhiger Rhythmus passt am besten.',
      ],
      healthLines: [
        'Leichte Bewegung und Ruhe balancieren gut.',
        'Regelmäßiges Spiel ist besser als starke Reize.',
        'Kurze Pausen stabilisieren den Tag.',
      ],
      healthTail: [
        'Mehr Wasser und leichte Kost helfen.',
        'Ein ruhiger Platz stärkt die Stabilität.',
        'Spiel und Ruhe im Wechsel sind ideal.',
      ],
      bondLines: [
        'Die Bindung wächst durch Wärme.',
        'Vertrauen wächst durch kleine Zeichen.',
        'Die Distanz fühlt sich kürzer an.',
      ],
      bondTail: [
        'Ein Blick oder Lob reicht oft.',
        'Ein sanfter Ton stärkt die Nähe.',
        'Kleine Rituale vertiefen Vertrauen.',
      ],
      bonusLines: [
        'Stütze das schwache Element für Balance.',
        'Kleine Anpassungen stabilisieren.',
        'Sanfte Beständigkeit ist heute der Schlüssel.',
      ],
    },
  },
  it: {
    label: 'Italiano',
    dir: 'ltr',
    site_title: 'Pensieri del pet con il Saju',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Pensieri del pet con il Saju',
    hero_desc: 'Lettura gentile con cinque elementi, saju e termini stagionali.',
    section_input_title: 'Dati del pet',
    label_language: 'Lingua',
    label_pet_name: 'Nome',
    placeholder_pet_name: 'Es: Mungchi',
    label_gender: 'Sesso',
    option_gender_placeholder: 'Seleziona',
    option_gender_female: 'Femmina',
    option_gender_male: 'Maschio',
    option_gender_neutral: 'Sterilizzato/Incerto',
    label_birthdate: 'Data di nascita',
    option_year: 'Anno',
    option_month: 'Mese',
    option_day: 'Giorno',
    btn_submit: 'Vedi',
    btn_reset: 'Reset',
    section_table_title: 'Elementi · Saju · Termine',
    table_note: 'Calcolo semplificato, solo per divertimento.',
    th_category: 'Tipo',
    th_value: 'Risultato',
    th_meaning: 'Significato',
    row_element: 'Cinque elementi',
    row_ganzi: 'Saju',
    row_term: 'Termine stagionale',
    row_element_meaning: 'Energia base del temperamento',
    row_ganzi_meaning: 'Flusso ganji di nascita',
    row_term_meaning: 'Energia stagionale e umore',
    row_ganzi_desc: 'Il flusso ganji influenza l’equilibrio di oggi.',
    row_term_desc: 'Il termine stagionale addolcisce le emozioni.',
    section_today_title: 'Lettura di oggi',
    section_today_intro: 'Emozioni, salute e legame di oggi.',
    btn_capture: 'Salva immagine',
    footer_note: 'Solo per riferimento affettuoso.',
    card_emotion: 'Emozione',
    card_health: 'Salute',
    card_bond: 'Legame',
    card_placeholder_emotion: 'Inserisci i dati.',
    card_placeholder_health: 'Inserisci i dati.',
    card_placeholder_bond: 'Inserisci i dati.',
    result_placeholder: 'Inserisci i dati per vedere la lettura.',
    msg_missing: 'Compila tutti i campi.',
    msg_capture_loading: 'Creazione immagine...',
    msg_capture_error: 'Salvataggio fallito.',
    msg_capture_missing: 'Cattura non disponibile.',
    analysis_title: 'Ritmo degli elementi',
    emotion_title: 'Emozione',
    health_title: 'Salute',
    bond_title: 'Legame con il padrone',
    bonus_title: 'Consiglio bonus',
    balance_line: (d, s, l) => `${d} e ${s} dominano, ${l} è debole.`,
    guide_action: {
      목: 'Passeggiata breve e giochi di fiuto.',
      화: 'Lodi calde e contatto visivo.',
      토: 'Cuscino morbido e routine stabile.',
      금: 'Gioco breve e focalizzato.',
      수: 'Riposo tranquillo e acqua.',
    },
    guide_diet: {
      목: 'Snack leggeri e idratanti.',
      화: 'Pasti calmi e lenti.',
      토: 'Ambiente caldo e regolarità.',
      금: 'Ritmo regolare e lodi.',
      수: 'Un po’ più d’acqua.',
    },
    elements: {
      목: { name: 'Legno', vibe: 'crescita dolce', note: 'Curiosità in aumento.' },
      화: { name: 'Fuoco', vibe: 'calore', note: 'Affetto più evidente.' },
      토: { name: 'Terra', vibe: 'stabilità', note: 'Cerca comfort.' },
      금: { name: 'Metallo', vibe: 'focus chiaro', note: 'Concentrazione più alta.' },
      수: { name: 'Acqua', vibe: 'calma', note: 'Emozioni più morbide.' },
    },
    term_names: [
      'Piccolo freddo', 'Grande freddo', 'Inizio primavera', 'Acqua piovana', 'Risveglio insetti', 'Equinozio di primavera', 'Chiaro e luminoso', 'Pioggia dei grani',
      'Inizio estate', 'Grano pieno', 'Grano in spiga', 'Solstizio d’estate', 'Piccolo caldo', 'Grande caldo', 'Inizio autunno', 'Fine del caldo',
      'Rugiada bianca', 'Equinozio d’autunno', 'Rugiada fredda', 'Discesa della brina', 'Inizio inverno', 'Piccola neve', 'Grande neve', 'Solstizio d’inverno',
    ],
    interpret: {
      emotionLines: [
        'Pensa: “Mi stai guardando?”',
        'Vuole stare un po’ più vicino.',
        'Oggi si sente al sicuro.',
      ],
      emotionTail: [
        'Le carezze leggere funzionano bene.',
        'Un piccolo complimento alza l’umore.',
        'Un ritmo lento è perfetto.',
      ],
      healthLines: [
        'Movimento leggero e riposo sono ideali.',
        'Meglio gioco regolare che eccitazione.',
        'Pause brevi mantengono equilibrio.',
      ],
      healthTail: [
        'Idratazione e pasti leggeri aiutano.',
        'Un angolo tranquillo dà stabilità.',
        'Alternare gioco e riposo è ottimo.',
      ],
      bondLines: [
        'Il legame cresce con dolcezza.',
        'La fiducia aumenta con piccoli segnali.',
        'La distanza emotiva diminuisce.',
      ],
      bondTail: [
        'Uno sguardo o una lode bastano.',
        'Tono morbido e costante.',
        'Piccoli rituali rafforzano.',
      ],
      bonusLines: [
        'Sostieni l’elemento debole per equilibrio.',
        'Piccoli aggiustamenti stabilizzano.',
        'La costanza dolce è la chiave.',
      ],
    },
  },
  pt: {
    label: 'Português',
    dir: 'ltr',
    site_title: 'Pensamentos do pet pelo Saju',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Pensamentos do pet pelo Saju',
    hero_desc: 'Leitura carinhosa com cinco elementos, saju e termos sazonais.',
    section_input_title: 'Dados do pet',
    label_language: 'Idioma',
    label_pet_name: 'Nome',
    placeholder_pet_name: 'Ex: Mungchi',
    label_gender: 'Gênero',
    option_gender_placeholder: 'Selecionar',
    option_gender_female: 'Fêmea',
    option_gender_male: 'Macho',
    option_gender_neutral: 'Castrado/Desconhecido',
    label_birthdate: 'Data de nascimento',
    option_year: 'Ano',
    option_month: 'Mês',
    option_day: 'Dia',
    btn_submit: 'Ver',
    btn_reset: 'Resetar',
    section_table_title: 'Elementos · Saju · Termo',
    table_note: 'Cálculo simplificado, só para referência.',
    th_category: 'Tipo',
    th_value: 'Resultado',
    th_meaning: 'Significado',
    row_element: 'Cinco elementos',
    row_ganzi: 'Saju',
    row_term: 'Termo sazonal',
    row_element_meaning: 'Energia base do temperamento',
    row_ganzi_meaning: 'Fluxo ganji do nascimento',
    row_term_meaning: 'Energia sazonal e humor',
    row_ganzi_desc: 'O fluxo ganji influencia o equilíbrio do dia.',
    row_term_desc: 'O termo sazonal suaviza o humor.',
    section_today_title: 'Leitura de hoje',
    section_today_intro: 'Emoção, saúde e vínculo de hoje.',
    btn_capture: 'Salvar imagem',
    footer_note: 'Apenas para diversão e carinho.',
    card_emotion: 'Emoção',
    card_health: 'Saúde',
    card_bond: 'Vínculo',
    card_placeholder_emotion: 'Preencha os dados.',
    card_placeholder_health: 'Preencha os dados.',
    card_placeholder_bond: 'Preencha os dados.',
    result_placeholder: 'Preencha os dados para ver a leitura.',
    msg_missing: 'Preencha todos os campos.',
    msg_capture_loading: 'Criando imagem...',
    msg_capture_error: 'Falha ao salvar.',
    msg_capture_missing: 'Captura indisponível.',
    analysis_title: 'Ritmo dos elementos',
    emotion_title: 'Emoção',
    health_title: 'Saúde',
    bond_title: 'Vínculo com o tutor',
    bonus_title: 'Dica extra',
    balance_line: (d, s, l) => `${d} e ${s} dominam, ${l} é baixo.`,
    guide_action: {
      목: 'Passeio curto e brincadeiras de faro.',
      화: 'Elogios e contato visual.',
      토: 'Cama macia e rotina estável.',
      금: 'Brincadeiras curtas e focadas.',
      수: 'Descanso tranquilo e hidratação.',
    },
    guide_diet: {
      목: 'Petiscos leves e hidratantes.',
      화: 'Refeições calmas e lentas.',
      토: 'Ambiente quente e regularidade.',
      금: 'Ritmo regular e elogios.',
      수: 'Mais água.',
    },
    elements: {
      목: { name: 'Madeira', vibe: 'crescimento gentil', note: 'Curiosidade em alta.' },
      화: { name: 'Fogo', vibe: 'calor', note: 'Afeto mais visível.' },
      토: { name: 'Terra', vibe: 'estabilidade', note: 'Busca conforto.' },
      금: { name: 'Metal', vibe: 'foco claro', note: 'Concentração melhora.' },
      수: { name: 'Água', vibe: 'calma', note: 'Emoções suavizam.' },
    },
    term_names: [
      'Frio menor', 'Frio maior', 'Início da primavera', 'Água da chuva', 'Despertar dos insetos', 'Equinócio da primavera', 'Claro e luminoso', 'Chuva dos grãos',
      'Início do verão', 'Grão cheio', 'Grão em espiga', 'Solstício de verão', 'Calor menor', 'Calor maior', 'Início do outono', 'Fim do calor',
      'Orvalho branco', 'Equinócio de outono', 'Orvalho frio', 'Descida da geada', 'Início do inverno', 'Neve menor', 'Neve maior', 'Solstício de inverno',
    ],
    interpret: {
      emotionLines: [
        'Ele pensa: “Você está me olhando?”',
        'Quer ficar um pouco mais perto.',
        'Hoje se sente seguro.',
      ],
      emotionTail: [
        'Carinho leve funciona bem.',
        'Um elogio pequeno melhora o humor.',
        'Ritmo lento é o ideal.',
      ],
      healthLines: [
        'Movimento leve e descanso equilibram.',
        'Melhor jogo regular do que excitação.',
        'Pausas curtas mantêm o ritmo.',
      ],
      healthTail: [
        'Hidratação e comida leve ajudam.',
        'Um canto calmo dá estabilidade.',
        'Alternar brincar e descansar é ótimo.',
      ],
      bondLines: [
        'O vínculo cresce com suavidade.',
        'A confiança aumenta com sinais pequenos.',
        'A distância emocional diminui.',
      ],
      bondTail: [
        'Um olhar ou elogio já ajuda.',
        'Tono suave e constante.',
        'Rituais pequenos fortalecem.',
      ],
      bonusLines: [
        'Apoie o elemento fraco para equilibrar.',
        'Pequenos ajustes estabilizam.',
        'Consistência gentil é a chave.',
      ],
    },
  },
  es: {
    label: 'Español',
    dir: 'ltr',
    site_title: 'Pensamientos del pet con Saju',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Pensamientos del pet con Saju',
    hero_desc: 'Lectura cálida con cinco elementos, saju y términos estacionales.',
    section_input_title: 'Datos del pet',
    label_language: 'Idioma',
    label_pet_name: 'Nombre',
    placeholder_pet_name: 'Ej: Mungchi',
    label_gender: 'Género',
    option_gender_placeholder: 'Seleccionar',
    option_gender_female: 'Hembra',
    option_gender_male: 'Macho',
    option_gender_neutral: 'Esterilizado/Desconocido',
    label_birthdate: 'Fecha de nacimiento',
    option_year: 'Año',
    option_month: 'Mes',
    option_day: 'Día',
    btn_submit: 'Ver',
    btn_reset: 'Restablecer',
    section_table_title: 'Elementos · Saju · Término',
    table_note: 'Cálculo simplificado, solo referencia.',
    th_category: 'Tipo',
    th_value: 'Resultado',
    th_meaning: 'Significado',
    row_element: 'Cinco elementos',
    row_ganzi: 'Saju',
    row_term: 'Término estacional',
    row_element_meaning: 'Energía base del temperamento',
    row_ganzi_meaning: 'Flujo ganji del nacimiento',
    row_term_meaning: 'Energía estacional y ánimo',
    row_ganzi_desc: 'El flujo ganji influye en el equilibrio del día.',
    row_term_desc: 'El término estacional suaviza el ánimo.',
    section_today_title: 'Lectura de hoy',
    section_today_intro: 'Emoción, salud y vínculo hoy.',
    btn_capture: 'Guardar imagen',
    footer_note: 'Solo para diversión y calidez.',
    card_emotion: 'Emoción',
    card_health: 'Salud',
    card_bond: 'Vínculo',
    card_placeholder_emotion: 'Ingresa datos.',
    card_placeholder_health: 'Ingresa datos.',
    card_placeholder_bond: 'Ingresa datos.',
    result_placeholder: 'Ingresa datos para ver la lectura.',
    msg_missing: 'Completa todos los campos.',
    msg_capture_loading: 'Creando imagen...',
    msg_capture_error: 'Error al guardar.',
    msg_capture_missing: 'Captura no disponible.',
    analysis_title: 'Ritmo de elementos',
    emotion_title: 'Emoción',
    health_title: 'Salud',
    bond_title: 'Vínculo con el dueño',
    bonus_title: 'Consejo extra',
    balance_line: (d, s, l) => `${d} y ${s} dominan, ${l} es bajo.`,
    guide_action: {
      목: 'Paseo corto y juegos de olfato.',
      화: 'Elogios cálidos y contacto visual.',
      토: 'Cama suave y rutina estable.',
      금: 'Juego corto y enfocado.',
      수: 'Descanso tranquilo e hidratación.',
    },
    guide_diet: {
      목: 'Snacks ligeros e hidratantes.',
      화: 'Comidas calmadas y lentas.',
      토: 'Ambiente cálido y regularidad.',
      금: 'Ritmo regular y elogios.',
      수: 'Más agua.',
    },
    elements: {
      목: { name: 'Madera', vibe: 'crecimiento suave', note: 'Curiosidad en alza.' },
      화: { name: 'Fuego', vibe: 'calor', note: 'El afecto se nota.' },
      토: { name: 'Tierra', vibe: 'estabilidad', note: 'Busca comodidad.' },
      금: { name: 'Metal', vibe: 'enfoque claro', note: 'Mejora la concentración.' },
      수: { name: 'Agua', vibe: 'calma', note: 'Emociones suaves.' },
    },
    term_names: [
      'Frío menor', 'Frío mayor', 'Inicio de primavera', 'Agua de lluvia', 'Despertar de insectos', 'Equinoccio de primavera', 'Claro y brillante', 'Lluvia de granos',
      'Inicio de verano', 'Grano lleno', 'Grano en espiga', 'Solsticio de verano', 'Calor menor', 'Calor mayor', 'Inicio de otoño', 'Fin del calor',
      'Rocío blanco', 'Equinoccio de otoño', 'Rocío frío', 'Descenso de escarcha', 'Inicio de invierno', 'Nieve menor', 'Nieve mayor', 'Solsticio de invierno',
    ],
    interpret: {
      emotionLines: [
        'Piensa: “¿Me estás mirando?”',
        'Quiere estar un poco más cerca.',
        'Hoy se siente seguro.',
      ],
      emotionTail: [
        'Las caricias suaves funcionan bien.',
        'Un pequeño elogio mejora el ánimo.',
        'El ritmo lento le sienta mejor.',
      ],
      healthLines: [
        'Actividad ligera y descanso equilibran.',
        'Mejor juego regular que mucha excitación.',
        'Pausas cortas ayudan.',
      ],
      healthTail: [
        'Hidratación y comida ligera ayudan.',
        'Un rincón tranquilo da estabilidad.',
        'Alternar juego y descanso es ideal.',
      ],
      bondLines: [
        'El vínculo crece con suavidad.',
        'La confianza aumenta con señales pequeñas.',
        'La distancia emocional disminuye.',
      ],
      bondTail: [
        'Una mirada o elogio basta.',
        'Tono suave y constante.',
        'Pequeños rituales fortalecen.',
      ],
      bonusLines: [
        'Apoya el elemento débil para equilibrar.',
        'Pequeños ajustes estabilizan.',
        'La constancia suave es la clave.',
      ],
    },
  },
  ar: {
    label: 'العربية',
    dir: 'rtl',
    site_title: 'خواطر الحيوان الأليف عبر الساجو',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'خواطر الحيوان الأليف عبر الساجو',
    hero_desc: 'قراءة دافئة باستخدام العناصر الخمسة والساجو والمواسم.',
    section_input_title: 'معلومات الحيوان الأليف',
    label_language: 'اللغة',
    label_pet_name: 'الاسم',
    placeholder_pet_name: 'مثال: مونغتشي',
    label_gender: 'النوع',
    option_gender_placeholder: 'اختر',
    option_gender_female: 'أنثى',
    option_gender_male: 'ذكر',
    option_gender_neutral: 'معقّم/غير معروف',
    label_birthdate: 'تاريخ الميلاد',
    option_year: 'السنة',
    option_month: 'الشهر',
    option_day: 'اليوم',
    btn_submit: 'عرض',
    btn_reset: 'إعادة ضبط',
    section_table_title: 'العناصر · الساجو · المصطلح',
    table_note: 'حساب مبسّط للمتعة فقط.',
    th_category: 'النوع',
    th_value: 'النتيجة',
    th_meaning: 'المعنى',
    row_element: 'العناصر الخمسة',
    row_ganzi: 'الساجو',
    row_term: 'مصطلح موسمي',
    row_element_meaning: 'طاقة مزاج الحيوان',
    row_ganzi_meaning: 'تدفق الغانجي للميلاد',
    row_term_meaning: 'طاقة الموسم والمشاعر',
    row_ganzi_desc: 'تدفق الغانجي يؤثر في توازن اليوم.',
    row_term_desc: 'المصطلح الموسمي يلين المزاج.',
    section_today_title: 'قراءة اليوم',
    section_today_intro: 'العاطفة والصحة والارتباط اليوم.',
    btn_capture: 'حفظ الصورة',
    footer_note: 'للمتعة والدفء فقط.',
    card_emotion: 'العاطفة',
    card_health: 'الصحة',
    card_bond: 'الارتباط',
    card_placeholder_emotion: 'أدخل المعلومات.',
    card_placeholder_health: 'أدخل المعلومات.',
    card_placeholder_bond: 'أدخل المعلومات.',
    result_placeholder: 'أدخل المعلومات لعرض القراءة.',
    msg_missing: 'يرجى إكمال جميع الحقول.',
    msg_capture_loading: 'جارٍ إنشاء الصورة...',
    msg_capture_error: 'فشل الحفظ.',
    msg_capture_missing: 'التقاط الصورة غير متاح.',
    analysis_title: 'إيقاع العناصر',
    emotion_title: 'العاطفة',
    health_title: 'الصحة',
    bond_title: 'الارتباط مع المالك',
    bonus_title: 'نصيحة إضافية',
    balance_line: (d, s, l) => `العنصران ${d} و${s} بارزان، بينما ${l} منخفض.`,
    guide_action: {
      목: 'نزهة قصيرة وألعاب الشم.',
      화: 'مديح لطيف وتواصل بصري.',
      토: 'سرير ناعم وروتين ثابت.',
      금: 'لعب قصير ومركّز.',
      수: 'راحة هادئة وترطيب.',
    },
    guide_diet: {
      목: 'وجبات خفيفة مرطبة.',
      화: 'وجبات هادئة وبطيئة.',
      토: 'بيئة دافئة وروتين ثابت.',
      금: 'إيقاع منتظم مع مدح.',
      수: 'زيادة بسيطة في الماء.',
    },
    elements: {
      목: { name: 'خشب', vibe: 'نمو هادئ', note: 'فضول يتزايد.' },
      화: { name: 'نار', vibe: 'دفء', note: 'محبة أكثر وضوحًا.' },
      토: { name: 'أرض', vibe: 'ثبات', note: 'يميل للراحة.' },
      금: { name: 'معدن', vibe: 'تركيز واضح', note: 'تركيز أعلى.' },
      수: { name: 'ماء', vibe: 'هدوء', note: 'مشاعر ألطف.' },
    },
    term_names: [
      'برد صغير', 'برد كبير', 'بداية الربيع', 'ماء المطر', 'يقظة الحشرات', 'الاعتدال الربيعي', 'صافٍ ومشرق', 'مطر الحبوب',
      'بداية الصيف', 'امتلاء الحبوب', 'حبوب السنابل', 'الانقلاب الصيفي', 'حرارة صغيرة', 'حرارة كبيرة', 'بداية الخريف', 'نهاية الحرارة',
      'ندى أبيض', 'الاعتدال الخريفي', 'ندى بارد', 'هبوط الصقيع', 'بداية الشتاء', 'ثلج صغير', 'ثلج كبير', 'الانقلاب الشتوي',
    ],
    interpret: {
      emotionLines: [
        'يفكر: «هل تلاحظني؟»',
        'يريد أن يكون أقرب قليلًا.',
        'يشعر بالأمان اليوم.',
      ],
      emotionTail: [
        'اللمسات اللطيفة مناسبة جدًا.',
        'الثناء البسيط يرفع المزاج.',
        'الإيقاع الهادئ هو الأفضل.',
      ],
      healthLines: [
        'الحركة الخفيفة والراحة متوازنتان.',
        'اللعب المنتظم أفضل من الإثارة الزائدة.',
        'فترات الراحة القصيرة مفيدة.',
      ],
      healthTail: [
        'الترطيب والطعام الخفيف يساعدان.',
        'مكان هادئ يزيد الاستقرار.',
        'التناوب بين اللعب والراحة مناسب.',
      ],
      bondLines: [
        'الترابط يقوى باللطف.',
        'الثقة تزيد بإشارات صغيرة.',
        'المسافة العاطفية تقل.',
      ],
      bondTail: [
        'نظرة أو مديح يكفي.',
        'نبرة لطيفة وثابتة.',
        'عادات صغيرة تقوي الثقة.',
      ],
      bonusLines: [
        'ادعم العنصر الضعيف لتحقيق التوازن.',
        'تعديلات بسيطة تمنح الاستقرار.',
        'الاستمرارية اللطيفة هي المفتاح.',
      ],
    },
  },
  th: {
    label: 'ไทย',
    dir: 'ltr',
    site_title: 'ความคิดสัตว์เลี้ยงผ่านซาจู',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'ความคิดสัตว์เลี้ยงผ่านซาจู',
    hero_desc: 'อ่านอย่างอบอุ่นด้วยธาตุทั้งห้า ซาจู และฤดูกาล',
    section_input_title: 'ข้อมูลสัตว์เลี้ยง',
    label_language: 'ภาษา',
    label_pet_name: 'ชื่อ',
    placeholder_pet_name: 'เช่น มุงชี',
    label_gender: 'เพศ',
    option_gender_placeholder: 'เลือก',
    option_gender_female: 'ตัวเมีย',
    option_gender_male: 'ตัวผู้',
    option_gender_neutral: 'ทำหมัน/ไม่ทราบ',
    label_birthdate: 'วันเกิด',
    option_year: 'ปี',
    option_month: 'เดือน',
    option_day: 'วัน',
    btn_submit: 'ดูผล',
    btn_reset: 'รีเซ็ต',
    section_table_title: 'ธาตุ · ซาจู · ฤดูกาล',
    table_note: 'คำนวณแบบย่อเพื่อความสนุก',
    th_category: 'ประเภท',
    th_value: 'ผลลัพธ์',
    th_meaning: 'ความหมาย',
    row_element: 'ธาตุทั้งห้า',
    row_ganzi: 'ซาจู',
    row_term: 'ฤดูกาล',
    row_element_meaning: 'พลังหลักของนิสัย',
    row_ganzi_meaning: 'การไหลของกันจิในวันเกิด',
    row_term_meaning: 'พลังฤดูกาลและอารมณ์',
    row_ganzi_desc: 'การไหลของกันจิมีผลต่อสมดุลวันนี้',
    row_term_desc: 'ฤดูกาลทำให้อารมณ์อ่อนโยนขึ้น',
    section_today_title: 'คำทำนายวันนี้',
    section_today_intro: 'อารมณ์ สุขภาพ และความผูกพันวันนี้',
    btn_capture: 'บันทึกรูป',
    footer_note: 'เพื่อความอบอุ่นและความสนุกเท่านั้น',
    card_emotion: 'อารมณ์',
    card_health: 'สุขภาพ',
    card_bond: 'ความผูกพัน',
    card_placeholder_emotion: 'กรอกข้อมูลเพื่อแสดง',
    card_placeholder_health: 'กรอกข้อมูลเพื่อแสดง',
    card_placeholder_bond: 'กรอกข้อมูลเพื่อแสดง',
    result_placeholder: 'กรอกข้อมูลเพื่อดูคำทำนาย',
    msg_missing: 'กรุณากรอกให้ครบ',
    msg_capture_loading: 'กำลังสร้างรูป...',
    msg_capture_error: 'บันทึกล้มเหลว',
    msg_capture_missing: 'การจับภาพยังไม่พร้อม',
    analysis_title: 'จังหวะธาตุ',
    emotion_title: 'อารมณ์',
    health_title: 'สุขภาพ',
    bond_title: 'ความผูกพันกับเจ้าของ',
    bonus_title: 'คำแนะนำพิเศษ',
    balance_line: (d, s, l) => `${d} และ ${s} เด่น, ${l} ต่ำ`,
    guide_action: {
      목: 'เดินสั้น ๆ และเกมดมกลิ่น',
      화: 'คำชมและสบตาอย่างอ่อนโยน',
      토: 'ที่นอนนุ่มและกิจวัตรคงที่',
      금: 'เล่นสั้น ๆ แบบโฟกัส',
      수: 'พักผ่อนและดื่มน้ำ',
    },
    guide_diet: {
      목: 'ขนมเบา ๆ ที่มีน้ำ',
      화: 'มื้ออาหารสงบและช้า',
      토: 'บรรยากาศอบอุ่นและสม่ำเสมอ',
      금: 'มื้ออาหารเป็นเวลาและคำชม',
      수: 'เพิ่มน้ำเล็กน้อย',
    },
    elements: {
      목: { name: 'ไม้', vibe: 'เติบโตอย่างอ่อนโยน', note: 'ความอยากรู้อยากเห็นเพิ่มขึ้น' },
      화: { name: 'ไฟ', vibe: 'อบอุ่น', note: 'ความรักแสดงออกง่าย' },
      토: { name: 'ดิน', vibe: 'มั่นคง', note: 'ต้องการความสบาย' },
      금: { name: 'โลหะ', vibe: 'โฟกัสชัดเจน', note: 'สมาธิดีขึ้น' },
      수: { name: 'น้ำ', vibe: 'สงบ', note: 'อารมณ์นุ่มนวล' },
    },
    term_names: [
      'หนาวน้อย', 'หนาวมาก', 'เริ่มฤดูใบไม้ผลิ', 'น้ำฝน', 'แมลงตื่น', 'วสันตวิษุวัต', 'แจ่มใส', 'ฝนเมล็ดพืช',
      'เริ่มฤดูร้อน', 'เมล็ดเต็ม', 'เมล็ดในรวง', 'ครีษมายัน', 'ร้อนน้อย', 'ร้อนมาก', 'เริ่มฤดูใบไม้ร่วง', 'สิ้นสุดความร้อน',
      'น้ำค้างขาว', 'ศารทวิษุวัต', 'น้ำค้างเย็น', 'น้ำค้างแข็ง', 'เริ่มฤดูหนาว', 'หิมะน้อย', 'หิมะมาก', 'เหมายัน',
    ],
    interpret: {
      emotionLines: [
        'คิดว่า “มองฉันอยู่ไหม?”',
        'อยากอยู่ใกล้ขึ้นอีกนิด',
        'วันนี้รู้สึกปลอดภัย',
      ],
      emotionTail: [
        'การสัมผัสเบา ๆ เข้ากันมาก',
        'คำชมเล็ก ๆ ทำให้อารมณ์ดี',
        'จังหวะช้าเหมาะที่สุด',
      ],
      healthLines: [
        'กิจกรรมเบา ๆ กับพักผ่อนสมดุล',
        'เล่นแบบสม่ำเสมอดีกว่าตื่นเต้นเกินไป',
        'พักสั้น ๆ ช่วยได้มาก',
      ],
      healthTail: [
        'ดื่มน้ำและอาหารเบาช่วยได้',
        'มุมสงบช่วยเพิ่มความมั่นคง',
        'สลับเล่นและพักจะดี',
      ],
      bondLines: [
        'ความผูกพันเพิ่มด้วยความอ่อนโยน',
        'ความไว้วางใจเพิ่มจากสัญญาณเล็ก ๆ',
        'ระยะห่างทางใจลดลง',
      ],
      bondTail: [
        'สบตาหรือชมสั้น ๆ ก็พอ',
        'ใช้โทนอ่อนโยนสม่ำเสมอ',
        'กิจวัตรเล็ก ๆ เสริมความเชื่อใจ',
      ],
      bonusLines: [
        'เติมธาตุที่อ่อนเพื่อสมดุล',
        'ปรับเล็กน้อยช่วยให้มั่นคง',
        'ความสม่ำเสมออย่างอ่อนโยนคือกุญแจ',
      ],
    },
  },
  vi: {
    label: 'Tiếng Việt',
    dir: 'ltr',
    site_title: 'Suy nghĩ thú cưng qua Saju',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Suy nghĩ thú cưng qua Saju',
    hero_desc: 'Giải nghĩa nhẹ nhàng bằng ngũ hành, saju và tiết khí.',
    section_input_title: 'Thông tin thú cưng',
    label_language: 'Ngôn ngữ',
    label_pet_name: 'Tên',
    placeholder_pet_name: 'Ví dụ: Mungchi',
    label_gender: 'Giới tính',
    option_gender_placeholder: 'Chọn',
    option_gender_female: 'Cái',
    option_gender_male: 'Đực',
    option_gender_neutral: 'Triệt sản/Không rõ',
    label_birthdate: 'Ngày sinh',
    option_year: 'Năm',
    option_month: 'Tháng',
    option_day: 'Ngày',
    btn_submit: 'Xem',
    btn_reset: 'Đặt lại',
    section_table_title: 'Ngũ hành · Saju · Tiết khí',
    table_note: 'Tính toán giản lược, chỉ để tham khảo.',
    th_category: 'Loại',
    th_value: 'Kết quả',
    th_meaning: 'Ý nghĩa',
    row_element: 'Ngũ hành',
    row_ganzi: 'Saju',
    row_term: 'Tiết khí',
    row_element_meaning: 'Năng lượng cốt lõi của tính cách',
    row_ganzi_meaning: 'Dòng ganji ngày sinh',
    row_term_meaning: 'Năng lượng mùa và cảm xúc',
    row_ganzi_desc: 'Dòng ganji ảnh hưởng đến cân bằng hôm nay.',
    row_term_desc: 'Tiết khí làm cảm xúc dịu hơn.',
    section_today_title: 'Luận giải hôm nay',
    section_today_intro: 'Cảm xúc, sức khỏe và gắn kết hôm nay.',
    btn_capture: 'Lưu ảnh',
    footer_note: 'Chỉ mang tính vui vẻ và ấm áp.',
    card_emotion: 'Cảm xúc',
    card_health: 'Sức khỏe',
    card_bond: 'Gắn kết',
    card_placeholder_emotion: 'Nhập thông tin để hiển thị.',
    card_placeholder_health: 'Nhập thông tin để hiển thị.',
    card_placeholder_bond: 'Nhập thông tin để hiển thị.',
    result_placeholder: 'Nhập thông tin để xem luận giải.',
    msg_missing: 'Vui lòng điền đủ thông tin.',
    msg_capture_loading: 'Đang tạo ảnh...',
    msg_capture_error: 'Lưu ảnh thất bại.',
    msg_capture_missing: 'Chưa sẵn sàng chụp ảnh.',
    analysis_title: 'Nhịp ngũ hành',
    emotion_title: 'Cảm xúc',
    health_title: 'Sức khỏe',
    bond_title: 'Gắn kết với chủ',
    bonus_title: 'Gợi ý thêm',
    balance_line: (d, s, l) => `${d} và ${s} nổi bật, ${l} thấp.`,
    guide_action: {
      목: 'Đi dạo ngắn và trò chơi ngửi mùi.',
      화: 'Khen nhẹ và giao tiếp mắt.',
      토: 'Ổ nệm mềm và thói quen ổn định.',
      금: 'Chơi ngắn và tập trung.',
      수: 'Nghỉ ngơi và bổ sung nước.',
    },
    guide_diet: {
      목: 'Đồ ăn nhẹ và bổ sung nước.',
      화: 'Bữa ăn chậm và yên tĩnh.',
      토: 'Môi trường ấm và đều đặn.',
      금: 'Ăn đúng giờ và khen ngợi.',
      수: 'Uống thêm nước.',
    },
    elements: {
      목: { name: 'Mộc', vibe: 'tăng trưởng dịu', note: 'Tò mò tăng lên.' },
      화: { name: 'Hỏa', vibe: 'ấm áp', note: 'Tình cảm rõ hơn.' },
      토: { name: 'Thổ', vibe: 'ổn định', note: 'Thích thoải mái.' },
      금: { name: 'Kim', vibe: 'tập trung', note: 'Tập trung tốt hơn.' },
      수: { name: 'Thủy', vibe: 'dịu dàng', note: 'Cảm xúc mềm hơn.' },
    },
    term_names: [
      'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập', 'Xuân phân', 'Thanh minh', 'Cốc vũ',
      'Lập hạ', 'Tiểu mãn', 'Mang chủng', 'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử',
      'Bạch lộ', 'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết', 'Đông chí',
    ],
    interpret: {
      emotionLines: [
        'Bé nghĩ: “Bạn có nhìn mình không?”',
        'Muốn ở gần hơn một chút.',
        'Hôm nay cảm thấy an toàn.',
      ],
      emotionTail: [
        'Chạm nhẹ sẽ hợp hơn.',
        'Lời khen nhỏ giúp tâm trạng tốt.',
        'Nhịp chậm là phù hợp nhất.',
      ],
      healthLines: [
        'Vận động nhẹ và nghỉ ngơi cân bằng.',
        'Chơi đều đặn tốt hơn kích thích mạnh.',
        'Nghỉ ngắn giúp duy trì thể trạng.',
      ],
      healthTail: [
        'Bổ sung nước và đồ ăn nhẹ sẽ tốt.',
        'Góc yên tĩnh tăng ổn định.',
        'Luân phiên chơi và nghỉ là hợp.',
      ],
      bondLines: [
        'Sự gắn kết tăng nhờ dịu dàng.',
        'Niềm tin tăng từ dấu hiệu nhỏ.',
        'Khoảng cách cảm xúc giảm.',
      ],
      bondTail: [
        'Một ánh nhìn hay lời khen là đủ.',
        'Giọng nhẹ nhàng sẽ tốt hơn.',
        'Thói quen nhỏ giúp tăng tin cậy.',
      ],
      bonusLines: [
        'Bổ sung yếu tố yếu để cân bằng.',
        'Điều chỉnh nhỏ giúp ổn định.',
        'Sự nhất quán nhẹ nhàng là chìa khóa.',
      ],
    },
  },
  ru: {
    label: 'Русский',
    dir: 'ltr',
    site_title: 'Мысли питомца через Саджу',
    hero_badge: 'Pet Saju Studio',
    hero_title: 'Мысли питомца через Саджу',
    hero_desc: 'Теплая интерпретация с пятью элементами, саджу и сезонами.',
    section_input_title: 'Данные питомца',
    label_language: 'Язык',
    label_pet_name: 'Имя',
    placeholder_pet_name: 'Напр.: Мунчи',
    label_gender: 'Пол',
    option_gender_placeholder: 'Выбрать',
    option_gender_female: 'Самка',
    option_gender_male: 'Самец',
    option_gender_neutral: 'Стерилиз./Неизв.',
    label_birthdate: 'Дата рождения',
    option_year: 'Год',
    option_month: 'Месяц',
    option_day: 'День',
    btn_submit: 'Смотреть',
    btn_reset: 'Сброс',
    section_table_title: 'Элементы · Саджу · Сезон',
    table_note: 'Упрощенный расчет для справки.',
    th_category: 'Тип',
    th_value: 'Результат',
    th_meaning: 'Значение',
    row_element: 'Пять элементов',
    row_ganzi: 'Саджу',
    row_term: 'Сезонный термин',
    row_element_meaning: 'Базовая энергия темперамента',
    row_ganzi_meaning: 'Поток ганжи дня рождения',
    row_term_meaning: 'Сезонная энергия и настроение',
    row_ganzi_desc: 'Поток ганжи влияет на баланс дня.',
    row_term_desc: 'Сезонный термин смягчает настроение.',
    section_today_title: 'Чтение на сегодня',
    section_today_intro: 'Эмоции, здоровье и связь сегодня.',
    btn_capture: 'Сохранить изображение',
    footer_note: 'Для теплого настроения, не для диагноза.',
    card_emotion: 'Эмоции',
    card_health: 'Здоровье',
    card_bond: 'Связь',
    card_placeholder_emotion: 'Введите данные.',
    card_placeholder_health: 'Введите данные.',
    card_placeholder_bond: 'Введите данные.',
    result_placeholder: 'Введите данные, чтобы увидеть чтение.',
    msg_missing: 'Пожалуйста, заполните все поля.',
    msg_capture_loading: 'Создание изображения...',
    msg_capture_error: 'Не удалось сохранить.',
    msg_capture_missing: 'Снимок недоступен.',
    analysis_title: 'Ритм элементов',
    emotion_title: 'Эмоции',
    health_title: 'Здоровье',
    bond_title: 'Связь с хозяином',
    bonus_title: 'Бонус-совет',
    balance_line: (d, s, l) => `Преобладают ${d} и ${s}, а ${l} слабее.`,
    guide_action: {
      목: 'Короткие прогулки и игры на нюх.',
      화: 'Тёплая похвала и зрительный контакт.',
      토: 'Мягкая лежанка и стабильный режим.',
      금: 'Короткая сфокусированная игра.',
      수: 'Тихий отдых и вода.',
    },
    guide_diet: {
      목: 'Лёгкие и увлажняющие лакомства.',
      화: 'Спокойные и медленные приёмы пищи.',
      토: 'Тёплая обстановка и режим.',
      금: 'Регулярные приёмы пищи и похвала.',
      수: 'Больше воды.',
    },
    elements: {
      목: { name: 'Дерево', vibe: 'мягкий рост', note: 'Любопытство возрастает.' },
      화: { name: 'Огонь', vibe: 'тепло', note: 'Нежность заметнее.' },
      토: { name: 'Земля', vibe: 'стабильность', note: 'Тянется к комфорту.' },
      금: { name: 'Металл', vibe: 'ясный фокус', note: 'Концентрация выше.' },
      수: { name: 'Вода', vibe: 'тихое успокоение', note: 'Эмоции мягче.' },
    },
    term_names: [
      'Малый холод', 'Большой холод', 'Начало весны', 'Дождевая вода', 'Пробуждение насекомых', 'Весеннее равноденствие', 'Ясно и светло', 'Зерновой дождь',
      'Начало лета', 'Полнота зерна', 'Колос зерна', 'Летнее солнцестояние', 'Малая жара', 'Большая жара', 'Начало осени', 'Конец жары',
      'Белая роса', 'Осеннее равноденствие', 'Холодная роса', 'Снижение мороза', 'Начало зимы', 'Малый снег', 'Большой снег', 'Зимнее солнцестояние',
    ],
    interpret: {
      emotionLines: [
        'Думает: «Ты меня видишь?»',
        'Хочет быть чуть ближе.',
        'Сегодня чувствует безопасность.',
      ],
      emotionTail: [
        'Нежные прикосновения особенно подходят.',
        'Небольшая похвала быстро поднимает настроение.',
        'Спокойный ритм самый лучший.',
      ],
      healthLines: [
        'Лёгкая активность и отдых дают баланс.',
        'Лучше регулярная игра, чем сильные стимулы.',
        'Короткие паузы помогают.',
      ],
      healthTail: [
        'Вода и лёгкая еда полезны.',
        'Тихое место усиливает стабильность.',
        'Чередование игры и отдыха идеально.',
      ],
      bondLines: [
        'Связь растёт через мягкость.',
        'Доверие растёт от маленьких сигналов.',
        'Эмоциональная дистанция уменьшается.',
      ],
      bondTail: [
        'Взгляд или похвала уже работают.',
        'Мягкий тон важен.',
        'Небольшие ритуалы укрепляют доверие.',
      ],
      bonusLines: [
        'Поддержите слабый элемент для баланса.',
        'Небольшие изменения стабилизируют.',
        'Мягкая последовательность — ключ.',
      ],
    },
  },
};

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

function getLang() {
  return languageSelect.value || 'ko';
}

function t(key) {
  const lang = getLang();
  const dict = translations[lang] || translations.ko;
  return dict[key] ?? translations.ko[key] ?? '';
}

function getElementInfo(elementKey) {
  const lang = getLang();
  return translations[lang]?.elements?.[elementKey] || translations.ko.elements[elementKey];
}

function getTermName(index) {
  const lang = getLang();
  const list = translations[lang]?.term_names || translations.ko.term_names;
  return list[index] || translations.ko.term_names[index] || '';
}

function getInterpretSet() {
  const lang = getLang();
  return translations[lang]?.interpret || translations.ko.interpret;
}

function initLanguageOptions() {
  languageSelect.innerHTML = '';
  Object.entries(translations).forEach(([value, config]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = config.label;
    languageSelect.appendChild(option);
  });
  const saved = localStorage.getItem(LANG_KEY) || 'ko';
  languageSelect.value = translations[saved] ? saved : 'ko';
  applyLanguage();
}

function applyLanguage() {
  const lang = getLang();
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = translations[lang]?.dir || 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  renderSelectPlaceholders();
  renderTablePlaceholder();
  renderCardsPlaceholder();
  renderResultPlaceholder();
}

function renderSelectPlaceholders() {
  const yearText = t('option_year');
  const monthText = t('option_month');
  const dayText = t('option_day');
  yearSelect.querySelector('option[value=""]')?.remove();
  monthSelect.querySelector('option[value=""]')?.remove();
  daySelect.querySelector('option[value=""]')?.remove();

  const yearOption = document.createElement('option');
  yearOption.value = '';
  yearOption.disabled = true;
  yearOption.selected = !yearSelect.value;
  yearOption.textContent = yearText;
  yearSelect.prepend(yearOption);

  const monthOption = document.createElement('option');
  monthOption.value = '';
  monthOption.disabled = true;
  monthOption.selected = !monthSelect.value;
  monthOption.textContent = monthText;
  monthSelect.prepend(monthOption);

  const dayOption = document.createElement('option');
  dayOption.value = '';
  dayOption.disabled = true;
  dayOption.selected = !daySelect.value;
  dayOption.textContent = dayText;
  daySelect.prepend(dayOption);
}

function renderTablePlaceholder() {
  resultTable.innerHTML = `
    <tr>
      <td>${t('row_element')}</td>
      <td>-</td>
      <td>${t('row_element_meaning')}</td>
    </tr>
    <tr>
      <td>${t('row_ganzi')}</td>
      <td>-</td>
      <td>${t('row_ganzi_meaning')}</td>
    </tr>
    <tr>
      <td>${t('row_term')}</td>
      <td>-</td>
      <td>${t('row_term_meaning')}</td>
    </tr>
  `;
}

function renderCardsPlaceholder() {
  resultCards.innerHTML = `
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-6.5-4.4-8.5-7.4C1.3 10.6 2.2 7.2 5 6c2-0.8 4.1 0.1 5 1.7 0.9-1.6 3-2.5 5-1.7 2.8 1.2 3.7 4.6 1.5 7.6C18.5 16.6 12 21 12 21z" />
          </svg>
        </span>
        <h3>${t('card_emotion')}</h3>
      </div>
      <p>${t('card_placeholder_emotion')}</p>
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
        <h3>${t('card_health')}</h3>
      </div>
      <p>${t('card_placeholder_health')}</p>
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
        <h3>${t('card_bond')}</h3>
      </div>
      <p>${t('card_placeholder_bond')}</p>
    </div>
  `;
}

function renderResultPlaceholder() {
  resultText.innerHTML = `<p>${t('result_placeholder')}</p>`;
}

function initSelects() {
  const currentYear = today.getFullYear();
  const startYear = 1980;
  yearSelect.innerHTML = '';
  for (let y = currentYear; y >= startYear; y -= 1) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = `${y}`;
    yearSelect.appendChild(option);
  }

  monthSelect.innerHTML = '';
  for (let m = 1; m <= 12; m += 1) {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = `${m}`;
    monthSelect.appendChild(option);
  }

  updateDays();
}

function updateDays() {
  const year = Number(yearSelect.value);
  const month = Number(monthSelect.value);
  const days = year && month ? new Date(year, month, 0).getDate() : 31;
  daySelect.innerHTML = '';
  for (let d = 1; d <= days; d += 1) {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = `${d}`;
    daySelect.appendChild(option);
  }
  renderSelectPlaceholders();
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

function actionGuide(lowElement) {
  const guide = translations[getLang()]?.guide_action?.[lowElement];
  return guide || translations.ko.guide_action[lowElement];
}

function dietGuide(lowElement) {
  const guide = translations[getLang()]?.guide_diet?.[lowElement];
  return guide || translations.ko.guide_diet[lowElement];
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

function buildCards(name, elementInfo, termName, summary) {
  return `
    <div class="result-card">
      <div class="card-title">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-6.5-4.4-8.5-7.4C1.3 10.6 2.2 7.2 5 6c2-0.8 4.1 0.1 5 1.7 0.9-1.6 3-2.5 5-1.7 2.8 1.2 3.7 4.6 1.5 7.6C18.5 16.6 12 21 12 21z" />
          </svg>
        </span>
        <h3>${t('card_emotion')}</h3>
      </div>
      <p>${name} · ${elementInfo.vibe} · ${termName}</p>
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
        <h3>${t('card_health')}</h3>
      </div>
      <p>${getElementInfo(summary.dominant).name} ↑, ${getElementInfo(summary.low).name} ↓</p>
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
        <h3>${t('card_bond')}</h3>
      </div>
      <p>${getElementInfo(summary.secondary).name} · ${t('bond_title')}</p>
    </div>
  `;
}

function buildInterpretation(name, elementInfo, ganziLabel, termName, summary, score, seedValue) {
  const todayLabel = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const balanceLine = translations[getLang()]?.balance_line?.(
    getElementInfo(summary.dominant).name,
    getElementInfo(summary.secondary).name,
    getElementInfo(summary.low).name,
  ) || '';
  const interpret = getInterpretSet();
  const pick = (list, seed, offset) => list[(seed + offset) % list.length];
  return `
    <p><strong>${name}</strong> (${todayLabel}) · <strong>${elementInfo.name}</strong></p>
    <p><strong>${t('analysis_title')}</strong> : ${balanceLine} ${actionGuide(summary.low)}</p>
    <p><strong>${t('emotion_title')}</strong> : ${pick(interpret.emotionLines, seedValue, 1)} ${pick(interpret.emotionTail, seedValue, 2)}</p>
    <p><strong>${t('health_title')}</strong> : ${pick(interpret.healthLines, seedValue, 3)} ${pick(interpret.healthTail, seedValue, 4)}</p>
    <p><strong>${t('bond_title')}</strong> : ${pick(interpret.bondLines, seedValue, 5)} ${pick(interpret.bondTail, seedValue, 6)}</p>
    <p><strong>${t('bonus_title')}</strong> : ${pick(interpret.bonusLines, seedValue, 7)} (목 ${score.목} · 화 ${score.화} · 토 ${score.토} · 금 ${score.금} · 수 ${score.수})</p>
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
  renderTablePlaceholder();
  renderCardsPlaceholder();
  renderResultPlaceholder();
}

async function captureResult() {
  if (!window.html2canvas) {
    alert(t('msg_capture_missing'));
    return;
  }
  captureBtn.disabled = true;
  captureBtn.textContent = t('msg_capture_loading');
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
    alert(t('msg_capture_error'));
  } finally {
    captureBtn.disabled = false;
    captureBtn.textContent = t('btn_capture');
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
    resultText.innerHTML = `<p>${t('msg_missing')}</p>`;
    return;
  }

  const seed = seedFromInput(name, gender, year, month, day);
  const element = elements[seed % elements.length];
  const elementInfo = getElementInfo(element.name);

  const yearGanzi = calcYearGanzi(year);
  const monthGanzi = calcMonthGanzi(year, month);
  const dayGanzi = calcDayGanzi(year, month, day);
  const ganziLabel = `${yearGanzi.label} ${monthGanzi.label} ${dayGanzi.label}`;

  const termIndex = getSolarTermIndex(new Date(year, month - 1, day));
  const termName = getTermName(termIndex);
  const allElements = [yearGanzi.elements, monthGanzi.elements, dayGanzi.elements, [element.name]];
  const score = elementScore(allElements);
  const summary = elementSummary(score);
  const seedValue = seed + score.목 * 3 + score.화 * 5 + score.토 * 7 + score.금 * 11 + score.수 * 13;

  resultTable.innerHTML = `
    <tr>
      <td>${t('row_element')}</td>
      <td>${elementInfo.name}</td>
      <td>${elementInfo.vibe} · ${elementInfo.note}</td>
    </tr>
    <tr>
      <td>${t('row_ganzi')}</td>
      <td>${ganziLabel}</td>
      <td>${t('row_ganzi_desc')}</td>
    </tr>
    <tr>
      <td>${t('row_term')}</td>
      <td>${termName}</td>
      <td>${t('row_term_desc')}</td>
    </tr>
  `;

  resultCards.innerHTML = buildCards(name, elementInfo, termName, summary);
  resultText.innerHTML = buildInterpretation(name, elementInfo, ganziLabel, termName, summary, score, seedValue);
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
languageSelect.addEventListener('change', applyLanguage);

initSelects();
initLanguageOptions();
loadInputs();
renderTablePlaceholder();
renderCardsPlaceholder();
renderResultPlaceholder();
