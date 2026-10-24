/**
 * SLEEPSYNC AI - Clinical 5-Pillar Chronobiology & Sleep Intelligence Engine
 * 
 * 1. 3-bar Hamburger Corner Profile Drawer (User Info & Instant Profile Switcher)
 * 2. Smart Category Folders (Clean, modern UI without text overload)
 * 3. 2 Questions at a Time with Smooth Disappearance Animation
 * 4. Summary Only View upon completion
 * 5. Full Responsive Architecture for All Smartphones (Android, iPhone) and Web
 */

// ==========================================
// 1. APPLICATION STATE & CLIENT DATABASE
// ==========================================
const AppState = {
  currentStep: 1, // 1 to 5
  currentTab: 'quiz', // 'quiz' | 'voice' | 'schedule'

  // Current Logged-in User Profile
  currentUser: {
    id: 'user_tuan_construction',
    fullName: 'Nguyễn Văn Hùng',
    phone: '0981 234 567',
    avatar: '👨‍💻',
    age: '30 tuổi',
    gender: 'Nam',
    location: 'Hà Nội',
    occupation: 'office',
    occupationLabel: 'Kỹ Sư IT & Công Trình',
    bio: 'Thức khuya & mê cà phê • Đang cải thiện giấc ngủ sâu NREM 💤',
    targetBedtime: '23:00',
    targetWaketime: '06:30',
    stamina: 'Trung bình',
    conditions: ['Đau mỏi cổ vai gáy', 'Căng thẳng deadline'],
    restrictions: ['Ngồi nhiều máy tính']
  },

  // Answers for the 5 clinical pillars
  answers: {
    stress_level: 'medium',
    mood_state: 'positive',
    bedroom_temp: 'cool_ideal',
    env_noise_light: 'dark_quiet',
    caffeine_intake: 'early_afternoon',
    dinner_habits: 'healthy_light',
    physiology_age: 'young_adult',
    sleep_consistency: 'consistent',
    physical_pain: 'neck_back',
    clinical_issues: 'healthy_gut'
  },

  // Audio channels state
  audio: {
    ctx: null,
    delta: { isPlaying: false, gain: null, leftOsc: null, rightOsc: null },
    rain: { isPlaying: false, gain: null, node: null },
    ocean: { isPlaying: false, gain: null, node: null, lfo: null },
    bowl: { isPlaying: false, gain: null, intervalId: null }
  }
};

// Guest User State when logged out
const GUEST_USER = {
  id: 'guest',
  fullName: 'Khách (Chưa đăng nhập)',
  phone: 'Chưa liên kết',
  avatar: '👤',
  age: 'Chưa cập nhật',
  gender: 'Khách',
  location: 'Chưa cập nhật',
  occupation: 'guest',
  occupationLabel: 'Chưa đăng nhập',
  bio: 'Vui lòng đăng nhập hoặc chọn tài khoản để xem và bảo mật dữ liệu giấc ngủ của bạn.',
  targetBedtime: '23:00',
  targetWaketime: '07:00',
  stamina: 'Chưa đánh giá',
  conditions: ['Chưa có thông tin sức khỏe'],
  restrictions: ['Đăng nhập để xem chỉ số y tế']
};

// Preset Demo Profiles for instant 1-click switch
const DEMO_PROFILES = [
  {
    id: 'user_tuan_construction',
    fullName: 'Nguyễn Văn Hùng',
    phone: '0981 234 567',
    avatar: '👨‍💻',
    age: '30 tuổi',
    gender: 'Nam',
    location: 'Hà Nội',
    occupation: 'office',
    occupationLabel: 'Kỹ Sư IT & Công Trình',
    bio: 'Thức khuya & mê cà phê • Đang cải thiện giấc ngủ sâu NREM 💤',
    targetBedtime: '23:00',
    targetWaketime: '06:30',
    stamina: 'Trung bình',
    conditions: ['Đau mỏi cổ vai gáy', 'Căng thẳng deadline'],
    restrictions: ['Ngồi nhiều máy tính']
  },
  {
    id: 'user_lan_office',
    fullName: 'Trần Mai Lan',
    phone: '0912 345 678',
    avatar: '💼',
    age: '28 tuổi',
    gender: 'Nữ',
    location: 'TP. Hồ Chí Minh',
    occupation: 'office',
    occupationLabel: 'Kế Toán & Thiết Kế Văn Phòng',
    bio: 'Ngồi 9h/ngày • Đau nửa đầu Migraine • Hay lướt TikTok trước ngủ 📱',
    targetBedtime: '23:30',
    targetWaketime: '07:00',
    stamina: 'Thấp',
    conditions: ['Đau nửa đầu Migraine', 'Nhạy cảm ánh sáng xanh'],
    restrictions: ['Ít vận động']
  },
  {
    id: 'user_hung_elderly',
    fullName: 'Bác Hoàng Tuấn (62T)',
    phone: '0903 888 999',
    avatar: '👴',
    age: '62 tuổi',
    gender: 'Nam',
    location: 'Đà Nẵng',
    occupation: 'manual_labor',
    occupationLabel: 'Cán Bộ Hưu Trí Cao Tuổi',
    bio: 'Ngủ nông thức sớm 4h sáng • Suy giãn tĩnh mạch chân • Tiểu đêm ♿',
    targetBedtime: '21:30',
    targetWaketime: '05:00',
    stamina: 'Thấp',
    conditions: ['Hạn chế đi lại (suy giãn tĩnh mạch)', 'Tiểu đêm 2-3 lần'],
    restrictions: ['⚠️ Cấm ngâm chân nước nóng', 'Cấm đi bộ dốc xa']
  },
  {
    id: 'user_minh_doctor',
    fullName: 'BS. Lê Minh',
    phone: '0977 115 115',
    avatar: '🩺',
    age: '38 tuổi',
    gender: 'Nam',
    location: 'Hà Nội',
    occupation: 'night_shift',
    occupationLabel: 'Bác Sĩ Cấp Cứu Ca Kíp Trực Đêm',
    bio: 'Lịch trực bệnh viện đảo lộn • Trào ngược dạ dày GERD • Giấc ngủ phân mảnh 🏥',
    targetBedtime: '02:00',
    targetWaketime: '09:30',
    stamina: 'Khá',
    conditions: ['Trào ngược dạ dày GERD', 'Đảo lộn nhịp sinh học'],
    restrictions: ['Trực đêm thường xuyên']
  },
  {
    id: 'user_trang_student',
    fullName: 'Thu Trang (22T)',
    phone: '0936 999 888',
    avatar: '🎓',
    age: '22 tuổi',
    gender: 'Nữ',
    location: 'Hà Nội',
    occupation: 'creative_night',
    occupationLabel: 'Sinh Viên Y Khoa Thực Tập',
    bio: 'Ôn thi cao học • Ở trọ phòng ồn ào và nóng • Hay bị sương mù não 📚',
    targetBedtime: '00:30',
    targetWaketime: '07:00',
    stamina: 'Trung bình',
    conditions: ['Lo âu áp lực thi cử', 'Phòng trọ ô nhiễm tiếng ồn'],
    restrictions: ['Học khuya nhiều']
  }
];

// ==========================================
// 2. FIVE CLINICAL PILLARS OF SLEEP MEDICINE (MATCHING SCREENSHOT)
// ==========================================
const PILLARS_DATA = [
  // Trụ cột 1: Tâm lý & Căng thẳng thần kinh
  {
    stepNum: 1,
    pillarBadge: 'TRỤ CỘT 1: TÂM LÝ & CĂNG THẲNG THẦN KINH',
    pillarIcon: 'fa-brain',
    title: 'Trạng thái tinh thần & áp lực hôm nay của bạn thế nào?',
    subtext: 'Stress kích hoạt trục HPA tiết Adrenaline & Cortisol, làm tim đập nhanh và ức chế thư giãn.',
    q1: {
      id: 'stress_level',
      title: '1.1 Mức độ stress, áp lực deadline hoặc căng thẳng hôm nay:',
      icon: 'fa-gauge-high',
      options: [
        { val: 'low', icon: '😌', title: 'Thấp / Thư thái', desc: 'Công việc êm ả, tinh thần thư giãn' },
        { val: 'medium', icon: '😳', title: 'Vừa phải / Bận rộn', desc: 'Khá nhiều việc nhưng vẫn kiểm soát được' },
        { val: 'high', icon: '😫', title: 'Rất căng thẳng / Deadline dồn dập', desc: 'Áp lực lớn, tim đập nhanh, bồn chồn lo âu' }
      ]
    },
    q2: {
      id: 'mood_state',
      title: '1.2 Dấu hiệu cảm xúc tiêu cực hoặc uể oải (Trầm cảm / Mệt mỏi):',
      icon: 'fa-cloud-rain',
      options: [
        { val: 'positive', icon: '✨', title: 'Lạc quan & Tỉnh táo', desc: 'Có động lực, đầu óc minh mẫn' },
        { val: 'brain_fog', icon: '🌫️', title: 'Sương mù não / Hay buồn ngủ ngày', desc: 'Uể oải, mất tập trung lúc 10h-14h' },
        { val: 'anxiety', icon: '⚡', title: 'Lo âu dồn dập / Suy nghĩ miên man', desc: 'Đầu óc không thể ngừng suy nghĩ về công việc' }
      ]
    }
  },

  // Trụ cột 2: Không gian & Môi trường ngủ
  {
    stepNum: 2,
    pillarBadge: 'TRỤ CỘT 2: KHÔNG GIAN & MÔI TRƯỜNG PHÒNG NGỦ',
    pillarIcon: 'fa-bed',
    title: 'Không gian phòng ngủ & điều kiện xung quanh tối nay:',
    subtext: 'Nhiệt độ phòng lý tưởng 24-26°C giúp cơ thể hạ nhiệt độ trung tâm; bóng tối kích thích bài tiết Melatonin.',
    q1: {
      id: 'bedroom_temp',
      title: '2.1 Nhiệt độ và độ thông thoáng phòng ngủ của bạn:',
      icon: 'fa-temperature-half',
      options: [
        { val: 'cool_ideal', icon: '❄️', title: 'Mát mẻ, thoáng đãng', desc: 'Điều hòa/quạt 24-26°C, không khí lưu thông tốt' },
        { val: 'stuffy', icon: '🌡️', title: 'Hơi ngột ngạt / Khó chỉnh', desc: 'Phòng kín, nhiệt độ chưa thật sự tối ưu' },
        { val: 'hot_cold', icon: '🔥', title: 'Nóng bức hoặc quá lạnh', desc: 'Gây đổ mồ hôi hoặc co cứng cơ bắp ban đêm' }
      ]
    },
    q2: {
      id: 'env_noise_light',
      title: '2.2 Ánh sáng xanh & Mức độ tiếng ồn xung quanh:',
      icon: 'fa-moon',
      options: [
        { val: 'dark_quiet', icon: '🌙', title: 'Tối hoàn toàn & Yên tĩnh', desc: 'Rèm cản sáng, không tiếng ồn xe cộ' },
        { val: 'slight_light', icon: '💡', title: 'Có ánh đèn le lói / Tiếng ồn nhẹ', desc: 'Đèn đường hoặc tiếng TV phòng khách' },
        { val: 'loud_screen', icon: '📱', title: 'Nhiều ánh sáng xanh & Tiếng ồn lớn', desc: 'Dùng điện thoại trên giường, tiếng xe cộ sát đường' }
      ]
    }
  },

  // Trụ cột 3: Dinh dưỡng & Độc tố
  {
    stepNum: 3,
    pillarBadge: 'TRỤ CỘT 3: DINH DƯỠNG, CAFFEINE & THÓI QUEN',
    pillarIcon: 'fa-mug-hot',
    title: 'Thói quen ăn uống & nạp chất kích thích trong ngày:',
    subtext: 'Caffeine có chu kỳ bán rã 5-7h chặn thụ thể Adenosine; ăn no muộn sát giờ ngủ gây trào ngược.',
    q1: {
      id: 'caffeine_intake',
      title: '3.1 Cữ caffeine (Cà phê, trà đặc, nước tăng lực) gần nhất:',
      icon: 'fa-clock-rotate-left',
      options: [
        { val: 'morning_only', icon: '🍵', title: 'Không dùng hoặc trước 11:00 trưa', desc: 'Đã đào thải hết trước giờ lên giường' },
        { val: 'early_afternoon', icon: '☕', title: 'Dùng khoảng 12:00 - 15:00', desc: 'Có thể làm chậm pha buồn ngủ 30-45 phút' },
        { val: 'late_evening', icon: '⚡', title: 'Dùng sau 16:00 chiều hoặc tối', desc: 'Caffeine nồng độ cao trong máu, chặn thụ thể buồn ngủ' }
      ]
    },
    q2: {
      id: 'dinner_habits',
      title: '3.2 Bữa ăn tối & Thói quen sử dụng thiết bị sát giờ ngủ:',
      icon: 'fa-utensils',
      options: [
        { val: 'healthy_light', icon: '🥗', title: 'Ăn thanh đạm, không lướt màn hình', desc: 'Dạ dày nhẹ nhàng, kích hoạt Digital Sunset' },
        { val: 'heavy_late', icon: '🍲', title: 'Ăn no nhiều dầu mỡ sát giờ ngủ', desc: 'Đầy bụng khó tiêu, dạ dày phải làm việc đêm' },
        { val: 'screen_in_bed', icon: '📱', title: 'Lướt TikTok / điện thoại trên giường', desc: 'Ánh sáng xanh ức chế Melatonin, Dopamine gây thức' }
      ]
    }
  },

  // Trụ cột 4: Sinh lý & Nội tiết
  {
    stepNum: 4,
    pillarBadge: 'TRỤ CỘT 4: SINH LÝ, ĐỘ TUỔI & NHỊP SINH HỌC',
    pillarIcon: 'fa-dna',
    title: 'Độ tuổi, nhịp sinh học và nội tiết cơ thể của bạn:',
    subtext: 'Người cao tuổi thường sụt giảm Melatonin tự nhiên; nội tiết tố thay đổi ảnh hưởng sâu sắc đến thân nhiệt.',
    q1: {
      id: 'physiology_age',
      title: '4.1 Độ tuổi và giai đoạn sinh lý hiện tại:',
      icon: 'fa-user-group',
      options: [
        { val: 'young_adult', icon: '🧑', title: 'Thanh niên / Trưởng thành (18 - 45T)', desc: 'Nội tiết ổn định, chu kỳ sinh học tương đối tốt' },
        { val: 'elderly', icon: '🧓', title: 'Người lớn tuổi (> 50 tuổi)', desc: 'Thường ngủ nông, dễ tỉnh giấc sớm lúc 4-5h sáng' },
        { val: 'menopause', icon: '🌸', title: 'Tiền mãn kinh / Bốc hỏa đêm', desc: 'Vã mồ hôi đêm, bốc hỏa khiến giấc ngủ chập chờn' }
      ]
    },
    q2: {
      id: 'sleep_consistency',
      title: '4.2 Khung giờ sinh hoạt & Tính nhất quán của giờ đi ngủ:',
      icon: 'fa-business-time',
      options: [
        { val: 'consistent', icon: '⏰', title: 'Ổn định, đi ngủ đúng giờ hàng ngày', desc: 'Đi ngủ 22:30 - 23:30, thức dậy 06:00 - 06:30' },
        { val: 'irregular', icon: '🔄', title: 'Dao động thất thường 1 - 2 tiếng', desc: 'Tùy thuộc khối lượng công việc mỗi tối' },
        { val: 'shift_night', icon: '🏥', title: 'Trực đêm / Đảo lộn ngày đêm', desc: 'Bác sĩ, ca kíp trực đêm, cú đêm thường xuyên' }
      ]
    }
  },

  // Trụ cột 5: Bệnh lý & Đau nhức
  {
    stepNum: 5,
    pillarBadge: 'TRỤ CỘT 5: BỆNH LÝ & TRIỆU CHỨNG THỂ CHẤT',
    pillarIcon: 'fa-notes-medical',
    title: 'Triệu chứng thể chất & Bệnh lý lâm sàng ảnh hưởng giấc ngủ:',
    subtext: 'Cổ vai gáy căng cứng do tư thế ngồi sai và acid trào ngược là 2 thủ phạm hàng đầu gây đứt chu kỳ ngủ sâu.',
    q1: {
      id: 'physical_pain',
      title: '5.1 Cơn đau mỏi cơ xương khớp hôm nay:',
      icon: 'fa-person-cane',
      options: [
        { val: 'none', icon: '💪', title: 'Khỏe mạnh, cơ thể thoải mái', desc: 'Thả lỏng toàn thân dễ dàng đi vào giấc ngủ' },
        { val: 'neck_back', icon: '💆', title: 'Đau mỏi cổ vai gáy / Thắt lưng', desc: 'Do ngồi máy tính lâu, căng cứng cơ đĩa đệm' },
        { val: 'joint_restless', icon: '🦵', title: 'Đau nhức dữ dội / Chân bồn chồn', desc: 'Khó tìm tư thế nằm, hội chứng chân không yên' }
      ]
    },
    q2: {
      id: 'clinical_issues',
      title: '5.2 Triệu chứng tiêu hóa hoặc bài tiết ban đêm:',
      icon: 'fa-virus',
      options: [
        { val: 'healthy_gut', icon: '🌿', title: 'Bình thường, bụng êm ái suốt đêm', desc: 'Không có triệu chứng trào ngược hay tiểu đêm' },
        { val: 'gerd_acid', icon: '🔥', title: 'Trào ngược dạ dày thực quản (GERD)', desc: 'Ợ chua, nóng rát xương ức, dịch vị trào lên họng' },
        { val: 'nocturia_wake', icon: '🚽', title: 'Thức giấc do tiểu đêm 2-3 lần', desc: 'Đứt gãy pha ngủ sâu NREM, rất khó ngủ lại' }
      ]
    }
  }
];

// ==========================================
// 3. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initRealtimeClock();
  initHamburgerProfileDrawer();
  initFivePillarQuiz();
  initSoundscapeModal();
  initCalendarModal();
  initNutritionModal();
  initEditProfileModal();
  initDisclaimerModal();
  initSwitchAccountModal();
  initLogoutConfirmModal();
  updateUserUI();
});

// ==========================================
// 4. REALTIME CLOCK & CIRCADIAN PHASE
// ==========================================
function initRealtimeClock() {
  const clockEl = document.getElementById('current-time-display');
  const phaseEl = document.getElementById('chrono-phase-badge');

  function update() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    
    if (clockEl) clockEl.textContent = `${hrs}:${mins}:${secs}`;

    const h = now.getHours();
    let phaseText = '🌙 Pha thư giãn tối';
    if (h >= 6 && h < 11) phaseText = '☀️ Pha tỉnh táo sáng (Cortisol cao)';
    else if (h >= 11 && h < 14) phaseText = '🍲 Pha ăn trưa & nghỉ ngơi';
    else if (h >= 14 && h < 18) phaseText = '⚡ Pha làm việc chiều (Dừng cà phê)';
    else if (h >= 18 && h < 21) phaseText = '🌇 Pha hoàng hôn & hạ nhiệt cơ thể';
    else phaseText = '🌙 Pha tiết Melatonin tự nhiên';

    if (phaseEl) phaseEl.textContent = phaseText;
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// 5. CORNER 3-BAR HAMBURGER PROFILE DRAWER
// ==========================================
function initHamburgerProfileDrawer() {
  const hamburgerBtn = document.getElementById('btn-hamburger-profile');
  const drawer = document.getElementById('user-profile-drawer');
  const overlay = document.getElementById('user-profile-drawer-overlay');
  const closeBtn = document.getElementById('drawer-close-btn');
  const folderProfileBtn = document.getElementById('btn-open-profile-folder');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.style.display = 'block';
    renderDrawerProfileData();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.style.display = 'none';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (folderProfileBtn) folderProfileBtn.addEventListener('click', openDrawer);

  // Edit profile button in drawer
  const editProfileBtn = document.getElementById('drawer-edit-profile-btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      closeDrawer();
      openEditProfileModal();
    });
  }

  // Nút: Đổi tài khoản khác
  const switchAccountBtn = document.getElementById('btn-switch-account-drawer');
  if (switchAccountBtn) {
    switchAccountBtn.addEventListener('click', () => {
      closeDrawer();
      openSwitchAccountModal();
    });
  }

  // Nút: Đăng xuất khỏi thiết bị
  const logoutBtn = document.getElementById('btn-logout-drawer');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (AppState.currentUser.id === 'guest') {
        showToast('Bạn hiện đang ở chế độ khách vãng lai.', 'fa-circle-info', 'info');
      } else {
        closeDrawer();
        openLogoutConfirmModal();
      }
    });
  }
}

function renderDrawerProfileData() {
  const u = AppState.currentUser;
  const isGuest = u.id === 'guest';
  
  const avatarEl = document.getElementById('drawer-user-avatar');
  const nameEl = document.getElementById('drawer-user-fullname');
  const roleEl = document.getElementById('drawer-user-role');
  const bioEl = document.getElementById('drawer-user-bio');

  const ageEl = document.getElementById('drawer-info-age');
  const jobEl = document.getElementById('drawer-info-job');
  const phoneEl = document.getElementById('drawer-info-phone');
  const bedtimeEl = document.getElementById('drawer-info-bedtime');
  const waketimeEl = document.getElementById('drawer-info-waketime');
  const staminaEl = document.getElementById('drawer-info-stamina');
  const healthTagsEl = document.getElementById('drawer-health-tags');
  const editProfileBtn = document.getElementById('drawer-edit-profile-btn');

  if (avatarEl) avatarEl.textContent = u.avatar;
  if (nameEl) nameEl.textContent = u.fullName;
  if (roleEl) roleEl.textContent = u.occupationLabel;
  if (bioEl) bioEl.textContent = u.bio;

  if (ageEl) ageEl.textContent = isGuest ? 'Chưa cập nhật' : `${u.age} (${u.gender})`;
  if (jobEl) jobEl.textContent = u.occupationLabel;
  if (phoneEl) phoneEl.textContent = u.phone || 'Chưa cung cấp';
  if (bedtimeEl) bedtimeEl.textContent = u.targetBedtime;
  if (waketimeEl) waketimeEl.textContent = u.targetWaketime;
  if (staminaEl) staminaEl.textContent = u.stamina;

  if (editProfileBtn) {
    editProfileBtn.innerHTML = isGuest 
      ? '<i class="fa-solid fa-right-to-bracket"></i><span>Đăng Nhập Để Lưu Hồ Sơ Cá Nhân</span>'
      : '<i class="fa-solid fa-pen-to-square"></i><span>Chỉnh Sửa Thông Tin Hồ Sơ Của Bạn</span>';
  }

  if (healthTagsEl) {
    healthTagsEl.innerHTML = '';
    (u.conditions || []).forEach(c => {
      const tag = document.createElement('span');
      tag.className = 'h-tag';
      tag.innerHTML = `<i class="fa-solid fa-notes-medical"></i> ${c}`;
      healthTagsEl.appendChild(tag);
    });

    (u.restrictions || []).forEach(r => {
      const tag = document.createElement('span');
      tag.className = r.includes('⚠️') ? 'h-tag' : 'h-tag safe';
      tag.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${r}`;
      healthTagsEl.appendChild(tag);
    });
  }
}

// ==========================================
// SWITCH ACCOUNT & SECURITY MODAL
// ==========================================
function openSwitchAccountModal() {
  const modal = document.getElementById('switch-account-modal');
  if (!modal) return;
  renderSavedAccountsList();
  modal.style.display = 'flex';
}

function renderSavedAccountsList() {
  const container = document.getElementById('saved-accounts-list');
  if (!container) return;
  container.innerHTML = '';

  DEMO_PROFILES.forEach(p => {
    const isCurrent = p.id === AppState.currentUser.id;
    const card = document.createElement('div');
    card.className = `saved-account-card ${isCurrent ? 'active-account' : ''}`;
    
    card.innerHTML = `
      <div class="saved-account-meta">
        <span class="saved-account-avatar">${p.avatar}</span>
        <div>
          <strong>${p.fullName}</strong>
          <small>${p.occupationLabel} • ${p.phone || 'Chưa có SĐT'}</small>
        </div>
      </div>
      <div>
        ${isCurrent 
          ? `<span class="current-account-badge"><i class="fa-solid fa-circle-check"></i> Đang dùng</span>`
          : `<button type="button" class="btn-login-account" data-user-id="${p.id}">
              <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập
            </button>`
        }
      </div>
    `;

    if (!isCurrent) {
      const loginBtn = card.querySelector('.btn-login-account');
      if (loginBtn) {
        loginBtn.addEventListener('click', () => {
          loginToProfile(p);
        });
      }
    }

    container.appendChild(card);
  });
}

function loginToProfile(profile) {
  AppState.currentUser = Object.assign({}, profile);
  updateUserUI();
  renderDrawerProfileData();
  
  const modal = document.getElementById('switch-account-modal');
  if (modal) modal.style.display = 'none';

  showToast(`Đã chuyển sang tài khoản ${profile.fullName} thành công!`, 'fa-circle-check', 'success');
}

function initSwitchAccountModal() {
  const modal = document.getElementById('switch-account-modal');
  const closeBtn = document.getElementById('close-switch-account-modal');
  const form = document.getElementById('form-login-new');

  function close() {
    if (modal) modal.style.display = 'none';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('login-input-name');
      const phoneInput = document.getElementById('login-input-phone');
      const jobInput = document.getElementById('login-input-job');

      const fullName = (nameInput && nameInput.value.trim()) || 'Người Dùng Mới';
      const phone = (phoneInput && phoneInput.value.trim()) || '0988 888 888';
      const jobVal = jobInput ? jobInput.value : 'office';
      const jobLabel = jobInput ? jobInput.options[jobInput.selectedIndex].text : 'Dân Văn Phòng / IT';

      // Create new profile
      const newProfile = {
        id: 'user_' + Date.now(),
        fullName: fullName,
        phone: phone,
        avatar: '👤',
        age: '28 tuổi',
        gender: 'Tự chọn',
        location: 'Việt Nam',
        occupation: jobVal,
        occupationLabel: jobLabel,
        bio: 'Hồ sơ cá nhân vừa tạo • Đang theo dõi nhịp sinh học giấc ngủ 🌙',
        targetBedtime: '23:00',
        targetWaketime: '06:30',
        stamina: 'Tốt',
        conditions: ['Đã khởi tạo tài khoản an toàn'],
        restrictions: ['Chưa có hạn chế y tế']
      };

      DEMO_PROFILES.unshift(newProfile);
      loginToProfile(newProfile);
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
    });
  }
}

// ==========================================
// LOGOUT CONFIRMATION MODAL & ACTIONS
// ==========================================
function openLogoutConfirmModal() {
  const modal = document.getElementById('logout-confirm-modal');
  const nameEl = document.getElementById('logout-confirm-username');
  if (nameEl) nameEl.textContent = AppState.currentUser.fullName;
  if (modal) modal.style.display = 'flex';
}

function initLogoutConfirmModal() {
  const modal = document.getElementById('logout-confirm-modal');
  const cancelBtn = document.getElementById('btn-cancel-logout');
  const confirmBtn = document.getElementById('btn-confirm-logout');

  function close() {
    if (modal) modal.style.display = 'none';
  }

  if (cancelBtn) cancelBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      close();
      performLogout();
    });
  }
}

function performLogout() {
  const oldName = AppState.currentUser.fullName;
  AppState.currentUser = Object.assign({}, GUEST_USER);
  updateUserUI();
  renderDrawerProfileData();

  // Close drawer if open
  const drawer = document.getElementById('user-profile-drawer');
  const overlay = document.getElementById('user-profile-drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.style.display = 'none';

  showToast(`Đã đăng xuất an toàn khỏi tài khoản ${oldName}!`, 'fa-arrow-right-from-bracket', 'info');
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, icon = 'fa-circle-check', type = 'success') {
  const toast = document.getElementById('app-toast');
  if (!toast) return;

  const msgEl = document.getElementById('toast-message');
  const iconEl = toast.querySelector('.toast-icon');

  if (msgEl) msgEl.textContent = message;
  if (iconEl) iconEl.className = `toast-icon fa-solid ${icon}`;

  toast.style.display = 'flex';
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 3200);
}

function updateUserUI() {
  const u = AppState.currentUser;
  const isGuest = u.id === 'guest';
  
  // Header Avatar
  const headerAvatar = document.getElementById('header-user-avatar');
  if (headerAvatar) headerAvatar.textContent = u.avatar;

  // Welcome banner on main screen
  const welcomeName = document.getElementById('welcome-user-name');
  const welcomeRole = document.getElementById('welcome-user-role');
  if (welcomeName) {
    welcomeName.textContent = isGuest ? 'Khách Vãng Lai' : u.fullName;
  }
  if (welcomeRole) {
    welcomeRole.textContent = isGuest ? 'Nhấn ☰ ở góc để Đăng nhập / Chọn tài khoản' : u.occupationLabel;
  }

  // Summary user pill
  const sumAvatar = document.getElementById('summary-user-avatar');
  const sumName = document.getElementById('summary-user-name');
  if (sumAvatar) sumAvatar.textContent = u.avatar;
  if (sumName) sumName.textContent = u.fullName;
}

// ==========================================
// 6. FIVE PILLAR QUIZ & TABS CONTROLLER (MATCHING SCREENSHOT)
// ==========================================
function initFivePillarQuiz() {
  // Navigation Tabs
  const tabQuiz = document.getElementById('tab-btn-quiz');
  const tabVoice = document.getElementById('tab-btn-voice');
  const tabSchedule = document.getElementById('tab-btn-schedule');
  const btnDemo = document.getElementById('btn-quick-demo');

  if (tabQuiz) {
    tabQuiz.addEventListener('click', () => {
      showQuizView();
    });
  }

  if (tabVoice) {
    tabVoice.addEventListener('click', () => {
      showVoiceTalkView();
    });
  }

  if (tabSchedule) {
    tabSchedule.addEventListener('click', () => {
      openCalendarModal();
    });
  }

  if (btnDemo) {
    btnDemo.addEventListener('click', () => {
      handleQuickDemoCase();
    });
  }

  // Stepper Indicator Item Clicks
  const stepItems = document.querySelectorAll('.step-indicator-item');
  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.dataset.step, 10);
      if (!isNaN(step) && step >= 1 && step <= 5) {
        AppState.currentStep = step;
        renderQuizStep(AppState.currentStep);
      }
    });
  });

  // Quiz Card Prev & Next Buttons
  const prevBtn = document.getElementById('btn-quiz-prev');
  const nextBtn = document.getElementById('btn-quiz-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (AppState.currentStep > 1) {
        AppState.currentStep--;
        renderQuizStep(AppState.currentStep);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (AppState.currentStep < 5) {
        AppState.currentStep++;
        renderQuizStep(AppState.currentStep);
      } else {
        // Step 5 completed: Show Summary View!
        showSummaryOnlyView();
      }
    });
  }

  // Summary View Buttons
  const sumBackBtn = document.getElementById('summary-back-home-btn');
  const sumRestartBtn = document.getElementById('summary-restart-btn');

  if (sumBackBtn) {
    sumBackBtn.addEventListener('click', () => {
      showQuizView();
    });
  }

  if (sumRestartBtn) {
    sumRestartBtn.addEventListener('click', () => {
      AppState.currentStep = 1;
      showQuizView();
      showToast('Đã làm mới trắc nghiệm. Bắt đầu từ Trụ cột 1!', 'fa-rotate-right', 'info');
    });
  }

  // Voice Mode Close Button
  const closeVoiceBtn = document.getElementById('btn-close-voice-mode');
  if (closeVoiceBtn) {
    closeVoiceBtn.addEventListener('click', () => {
      showQuizView();
    });
  }

  // Voice Mic Pulse Button
  const voiceMicBtn = document.getElementById('btn-voice-mic');
  if (voiceMicBtn) {
    voiceMicBtn.addEventListener('click', () => {
      handleVoiceMicClick();
    });
  }

  // Render initial step (Step 1)
  renderQuizStep(1);
}

function showQuizView() {
  const quizView = document.getElementById('five-pillar-quiz-view');
  const voiceView = document.getElementById('voice-talk-view');
  const summaryView = document.getElementById('checkin-summary-view');

  if (quizView) quizView.style.display = 'block';
  if (voiceView) voiceView.style.display = 'none';
  if (summaryView) summaryView.style.display = 'none';

  updateActiveTab('tab-btn-quiz');
  renderQuizStep(AppState.currentStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showVoiceTalkView() {
  const quizView = document.getElementById('five-pillar-quiz-view');
  const voiceView = document.getElementById('voice-talk-view');
  const summaryView = document.getElementById('checkin-summary-view');

  if (quizView) quizView.style.display = 'none';
  if (voiceView) voiceView.style.display = 'block';
  if (summaryView) summaryView.style.display = 'none';

  updateActiveTab('tab-btn-voice');
  renderVoiceModeChips();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveTab(activeId) {
  ['tab-btn-quiz', 'tab-btn-voice', 'tab-btn-schedule'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === activeId) el.classList.add('active');
      else el.classList.remove('active');
    }
  });
}

function renderQuizStep(stepNum) {
  const pillar = PILLARS_DATA.find(p => p.stepNum === stepNum) || PILLARS_DATA[0];
  AppState.currentStep = stepNum;

  // 1. Update Stepper Progress & Indicators
  const progressFill = document.getElementById('stepper-progress-fill');
  if (progressFill) {
    const percent = ((stepNum - 1) / 4) * 100;
    progressFill.style.width = `${percent}%`;
  }

  const stepItems = document.querySelectorAll('.step-indicator-item');
  stepItems.forEach(item => {
    const s = parseInt(item.dataset.step, 10);
    item.classList.remove('active', 'completed');
    if (s === stepNum) {
      item.classList.add('active');
    } else if (s < stepNum) {
      item.classList.add('completed');
    }
  });

  // 2. Update Quiz Card Headers
  const badgeText = document.getElementById('quiz-pillar-badge-text');
  const badgeIcon = document.getElementById('quiz-pillar-icon');
  const mainTitle = document.getElementById('quiz-main-title');
  const subtext = document.getElementById('quiz-subtext');
  const stepNumEl = document.getElementById('step-current-number');

  if (badgeText) badgeText.textContent = pillar.pillarBadge;
  if (badgeIcon) badgeIcon.className = `fa-solid ${pillar.pillarIcon}`;
  if (mainTitle) mainTitle.textContent = pillar.title;
  if (subtext) subtext.textContent = pillar.subtext;
  if (stepNumEl) stepNumEl.textContent = stepNum;

  // 3. Render Subquestion 1
  const subq1Title = document.getElementById('subq-title-1');
  const subq1Icon = document.querySelector('#subq-icon-1 i');
  const grid1 = document.getElementById('options-grid-1');

  if (subq1Title) subq1Title.textContent = pillar.q1.title;
  if (subq1Icon) subq1Icon.className = `fa-solid ${pillar.q1.icon}`;

  if (grid1) {
    grid1.innerHTML = '';
    pillar.q1.options.forEach(opt => {
      const isSelected = AppState.answers[pillar.q1.id] === opt.val;
      const card = document.createElement('div');
      card.className = `quiz-option-card ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <span class="opt-icon">${opt.icon}</span>
        <div class="opt-text">
          <strong>${opt.title}</strong>
          <small>${opt.desc}</small>
        </div>
      `;

      card.addEventListener('click', () => {
        AppState.answers[pillar.q1.id] = opt.val;
        grid1.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });

      grid1.appendChild(card);
    });
  }

  // 4. Render Subquestion 2
  const subq2Title = document.getElementById('subq-title-2');
  const subq2Icon = document.querySelector('#subq-icon-2 i');
  const grid2 = document.getElementById('options-grid-2');

  if (subq2Title) subq2Title.textContent = pillar.q2.title;
  if (subq2Icon) subq2Icon.className = `fa-solid ${pillar.q2.icon}`;

  if (grid2) {
    grid2.innerHTML = '';
    pillar.q2.options.forEach(opt => {
      const isSelected = AppState.answers[pillar.q2.id] === opt.val;
      const card = document.createElement('div');
      card.className = `quiz-option-card ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <span class="opt-icon">${opt.icon}</span>
        <div class="opt-text">
          <strong>${opt.title}</strong>
          <small>${opt.desc}</small>
        </div>
      `;

      card.addEventListener('click', () => {
        AppState.answers[pillar.q2.id] = opt.val;
        grid2.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });

      grid2.appendChild(card);
    });
  }

  // 5. Update Navigation Buttons
  const prevBtn = document.getElementById('btn-quiz-prev');
  const nextBtnText = document.getElementById('btn-quiz-next-text');

  if (prevBtn) {
    prevBtn.style.display = stepNum > 1 ? 'inline-flex' : 'none';
  }

  if (nextBtnText) {
    nextBtnText.textContent = stepNum < 5 ? 'Tiếp theo' : 'Hoàn Thành & Xem Bản Tóm Tắt';
  }
}

function handleQuickDemoCase() {
  // Pre-fill realistic case: IT engineer under deadline stress
  AppState.answers = {
    stress_level: 'high',
    mood_state: 'anxiety',
    bedroom_temp: 'stuffy',
    env_noise_light: 'loud_screen',
    caffeine_intake: 'late_evening',
    dinner_habits: 'screen_in_bed',
    physiology_age: 'young_adult',
    sleep_consistency: 'irregular',
    physical_pain: 'neck_back',
    clinical_issues: 'gerd_acid'
  };

  showToast('Đã nạp trường hợp mẫu: Kỹ sư IT & Công trình (Căng thẳng & Đau mỏi cổ)!', 'fa-wand-magic-sparkles', 'success');
  
  // Jump straight to Summary View
  showSummaryOnlyView();
}

function renderVoiceModeChips() {
  const container = document.getElementById('voice-quick-chips');
  if (!container) return;
  container.innerHTML = '';

  const chips = [
    'Tôi bị stress deadline rất nặng',
    'Phòng ngủ hơi nóng và có tiếng xe cộ',
    'Chiều nay uống 1 ly cà phê sữa đá lúc 15h',
    'Ngồi máy tính nhiều bị mỏi cổ vai gáy',
    'Tôi muốn ngủ sâu không bị giật mình'
  ];

  chips.forEach(text => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip-btn';
    btn.innerHTML = `<i class="fa-solid fa-comment-dots"></i> "${text}"`;
    btn.addEventListener('click', () => {
      const prompt = document.getElementById('voice-ai-prompt');
      if (prompt) {
        prompt.innerHTML = `<strong>Bạn:</strong> "${text}"<br><br><strong>SleepSync AI:</strong> Ghi nhận thông tin! Hãy chuyển sang phần trắc nghiệm để tổng hợp đầy đủ 5 trụ cột y khoa.`;
      }
      showToast('Đã ghi nhận câu trả lời giọng nói!', 'fa-microphone', 'info');
    });
    container.appendChild(btn);
  });
}

function handleVoiceMicClick() {
  const micStatus = document.getElementById('mic-status-label');
  if (micStatus) {
    micStatus.innerHTML = '<span style="color: #34D399;"><i class="fa-solid fa-circle-dot"></i> Đang lắng nghe giọng nói của bạn... Hãy nói tự nhiên</span>';
  }

  showToast('Đang mô phỏng thu âm giọng nói...', 'fa-microphone-lines', 'info');

  setTimeout(() => {
    if (micStatus) {
      micStatus.textContent = 'Đã nhận dạng thành công! Bạn có thể nhấn để nói tiếp hoặc chọn gợi ý bên dưới';
    }
  }, 2000);
}

function showSummaryOnlyView() {
  const quizView = document.getElementById('five-pillar-quiz-view');
  const voiceView = document.getElementById('voice-talk-view');
  const summaryView = document.getElementById('checkin-summary-view');

  if (quizView) quizView.style.display = 'none';
  if (voiceView) voiceView.style.display = 'none';
  if (summaryView) summaryView.style.display = 'block';
  AppState.currentView = 'summary';

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderSummaryOnlyContent();
}

function renderSummaryOnlyContent() {
  const body = document.getElementById('summary-body-content');
  if (!body) return;

  const ans = AppState.answers;
  const user = AppState.currentUser;

  // Calculate Clinical Sleep Score (0 - 100)
  let score = 85;
  if (ans.stress_level === 'high') score -= 20;
  else if (ans.stress_level === 'medium') score -= 8;

  if (ans.env_bedroom === 'hot_noisy') score -= 18;
  else if (ans.env_bedroom === 'screen_heavy') score -= 12;

  if (ans.caffeine_dinner === 'late_caffeine') score -= 14;
  else if (ans.caffeine_dinner === 'heavy_dinner') score -= 12;

  if (ans.physiology_state === 'elderly_decline') score -= 10;
  else if (ans.physiology_state === 'menopause_hotflash') score -= 14;

  if (ans.physical_pain === 'gerd') score -= 15;
  else if (ans.physical_pain === 'neck_back_pain') score -= 10;
  else if (ans.physical_pain === 'nocturia') score -= 12;

  if (ans.bedtime_target === 'late_night') score -= 12;

  score = Math.max(35, Math.min(96, score));

  let statusLabel = 'Chất Lượng Tốt';
  let statusClass = 'safe';
  let statusDesc = 'Các chỉ số nhịp sinh học tối nay khá thuận lợi. Thực hiện 3 vi-hành động dưới đây để duy trì giấc ngủ sâu.';
  let gaugeColor = '#10B981';

  if (score < 60) {
    statusLabel = 'Cần Can Thiệp Ngay';
    statusClass = '';
    statusDesc = 'Nguy cơ trằn trọc và phân mảnh giấc ngủ cao do kích thích giao cảm & ức chế Melatonin. Cần áp dụng phác đồ khẩn cấp.';
    gaugeColor = '#F43F5E';
  } else if (score < 78) {
    statusLabel = 'Mức Độ Trung Bình';
    statusClass = '';
    statusDesc = 'Có một số yếu tố cản trở giấc ngủ sâu. Hãy kích hoạt Digital Sunset và hạ nhiệt độ phòng đúng hướng dẫn.';
    gaugeColor = '#F59E0B';
  }

  // Answer labels for summary pills
  const stressMap = { low: 'Tâm lý thư thái', medium: 'Stress vừa phải', high: 'Căng thẳng deadline cao' };
  const envMap = { ideal: 'Phòng mát (24-26°C), tối', screen_heavy: 'Nhiều màn hình & ánh sáng xanh', hot_noisy: 'Phòng nóng & bị ồn' };
  const dietMap = { healthy_diet: 'Ăn thanh đạm, không caffeine chiều', late_caffeine: 'Cà phê sau 11h trưa', heavy_dinner: 'Ăn tối no nhiều dầu mỡ' };
  const physioMap = { young_healthy: 'Thanh niên thể trạng tốt', elderly_decline: 'Người lớn tuổi (>50T)', menopause_hotflash: 'Tiền mãn kinh bốc hỏa' };
  const painMap = { none: 'Khỏe mạnh, không đau nhức', neck_back_pain: 'Đau mỏi cổ vai gáy', gerd: 'Trào ngược dạ dày GERD', nocturia: 'Thức giấc do tiểu đêm' };

  // Personalized Micro-actions (2-5 min) taking user profile and restrictions into account
  const microActions = [];

  // Action 1: Afternoon/Evening Transition
  if (ans.caffeine_dinner === 'late_caffeine') {
    microActions.push({
      time: '16:00 - 18:00',
      title: 'Uống 250ml Nước Ấm & Dừng Triệt Để Mọi Chất Kích Thích',
      desc: 'Tăng tốc đào thải caffeine qua thận, ngừng kích thích thụ thể Adenosine trước giờ ngủ.'
    });
  } else {
    microActions.push({
      time: '17:30 - 18:00',
      title: 'Đi Dạo 5 Phút Đón Ánh Sáng Hoàng Hôn',
      desc: 'Ánh sáng đỏ bước sóng dài đồng bộ thụ thể Melanopsin ở võng mạc, kích hoạt nhịp sinh học ban đêm.'
    });
  }

  // Action 2: Night Preparation / Physical Relief
  if (ans.physical_pain === 'neck_back_pain') {
    microActions.push({
      time: '20:30 (3 phút)',
      title: 'Động Tác Chin-Tuck & Mở Ngực Giảm Chèn Ép Đốt Sống Cổ',
      desc: 'Thu cằm về sau 5 giây x 8 lần. Thư giãn cơ nâng vai và giải phóng đĩa đệm sau ngày dài ngồi máy tính.'
    });
  } else if (ans.physical_pain === 'gerd' || user.conditions.includes('Trào ngược dạ dày GERD')) {
    microActions.push({
      time: '21:00 (2 phút)',
      title: 'Kê Cao Gối 15cm & Nằm Nghiêng Bên Trái',
      desc: 'Ngăn dịch vị axit trào ngược lên thực quản nhờ góc giải phẫu cơ thắt tâm vị.'
    });
  } else {
    microActions.push({
      time: '21:30 (5 phút)',
      title: 'Kích Hoạt Digital Sunset & Tắm Nước Ấm',
      desc: 'Tắt màn hình điện thoại 45 phút trước khi ngủ. Nước ấm làm giãn mao mạch ngoại vi giúp hạ nhiệt độ trung tâm.'
    });
  }

  // Action 3: In Bed / Sleep Onset
  microActions.push({
    time: '22:30 (3 phút)',
    title: 'Kỹ Thuật Thở 4-7-8 Kích Hoạt Thần Kinh Đối Giao Cảm',
    desc: 'Hít vào 4 giây, nín thở 7 giây, thở ra từ từ 8 giây. Lặp lại 4 chu kỳ trên giường để hạ nhịp tim và vào giấc êm dịu.'
  });

  // Calculate SVG stroke offset for gauge
  const circumference = 2 * Math.PI * 40;
  const strokeDash = `${(score / 100) * circumference} ${circumference}`;

  body.innerHTML = `
    <!-- Score Hero Card -->
    <div class="summary-score-hero-card">
      <div class="summary-gauge-wrap">
        <svg class="summary-chart-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="${gaugeColor}" stroke-width="8"
            stroke-dasharray="${strokeDash}" stroke-linecap="round" />
        </svg>
        <div class="gauge-center-box">
          <span class="gauge-big-num">${score}</span>
          <span class="gauge-small-label">Điểm Dự Đoán</span>
        </div>
      </div>

      <div class="summary-hero-meta">
        <span class="summary-status-pill ${statusClass}"><i class="fa-solid fa-circle-check"></i> ${statusLabel}</span>
        <h3 class="summary-hero-title">Dự Báo Phục Hồi Não Bộ & Chất Lượng Giấc Ngủ</h3>
        <p class="summary-hero-desc">${statusDesc}</p>
        
        <div class="summary-sub-stats">
          <span class="sub-stat-badge"><i class="fa-regular fa-clock"></i> Vào giấc: <strong>~${score > 75 ? '18' : '35'} phút</strong></span>
          <span class="sub-stat-badge"><i class="fa-solid fa-moon"></i> Ngủ sâu NREM: <strong>${score > 75 ? '19%' : '12%'}</strong></span>
          <span class="sub-stat-badge"><i class="fa-solid fa-brain"></i> Ngủ mơ REM: <strong>${score > 75 ? '22%' : '15%'}</strong></span>
        </div>
      </div>
    </div>

    <!-- Answers Summary (What user picked) -->
    <div class="answers-summary-card">
      <h4 class="section-headline"><i class="fa-solid fa-list-check" style="color: var(--cyan-accent);"></i> Tóm Tắt Các Lựa Chọn Bạn Đã Pick</h4>
      <div class="answers-pills-grid">
        <div class="answer-pill-item">
          <span class="p-icon">🧠</span>
          <div>
            <strong>1. Tâm lý & Stress:</strong>
            <small>${stressMap[ans.stress_level]}</small>
          </div>
        </div>
        <div class="answer-pill-item">
          <span class="p-icon">🛏️</span>
          <div>
            <strong>2. Phòng ngủ tối nay:</strong>
            <small>${envMap[ans.env_bedroom]}</small>
          </div>
        </div>
        <div class="answer-pill-item">
          <span class="p-icon">☕</span>
          <div>
            <strong>3. Lối sống & Độc tố:</strong>
            <small>${dietMap[ans.caffeine_dinner]}</small>
          </div>
        </div>
        <div class="answer-pill-item">
          <span class="p-icon">🧬</span>
          <div>
            <strong>4. Sinh lý & Tuổi tác:</strong>
            <small>${physioMap[ans.physiology_state]}</small>
          </div>
        </div>
        <div class="answer-pill-item">
          <span class="p-icon">🩺</span>
          <div>
            <strong>5. Thể chất & Đau nhức:</strong>
            <small>${painMap[ans.physical_pain]}</small>
          </div>
        </div>
        <div class="answer-pill-item">
          <span class="p-icon">🕙</span>
          <div>
            <strong>6. Giờ ngủ mục tiêu:</strong>
            <small>${ans.bedtime_target === 'early_2230' ? 'Trước 22:30' : (ans.bedtime_target === 'standard_2300' ? '23:00 - 24:00' : 'Sau 00:30')}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- 3 Personalized Micro-Actions -->
    <div class="micro-actions-card">
      <h4 class="section-headline"><i class="fa-solid fa-wand-magic-sparkles" style="color: var(--indigo-light);"></i> 3 Vi-Hành Động Khắc Phục Khẩn Cấp (2 - 5 Phút Tối Nay)</h4>
      <div class="actions-list">
        ${microActions.map(act => `
          <div class="action-item-card">
            <span class="action-time-tag">${act.time}</span>
            <div class="action-content">
              <strong>${act.title}</strong>
              <p>${act.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// 9. MODALS: SOUNDSCAPE, CALENDAR, NUTRITION, EDIT PROFILE
// ==========================================
function initSoundscapeModal() {
  const openQuickBtn = document.getElementById('soundscape-quick-btn');
  const openFolderBtn = document.getElementById('btn-open-soundscape');
  const modal = document.getElementById('soundscape-modal');
  const closeBtn = document.getElementById('close-soundscape-modal');

  function open() { modal.style.display = 'flex'; }
  function close() { modal.style.display = 'none'; }

  if (openQuickBtn) openQuickBtn.addEventListener('click', open);
  if (openFolderBtn) openFolderBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  // Web Audio track buttons
  initAudioTrackControls();
}

function initAudioTrackControls() {
  const btnDelta = document.getElementById('btn-toggle-delta');
  const btnRain = document.getElementById('btn-toggle-rain');
  const btnOcean = document.getElementById('btn-toggle-ocean');
  const btnBowl = document.getElementById('btn-toggle-bowl');

  if (btnDelta) {
    btnDelta.addEventListener('click', () => {
      toggleAudioTrack('delta', btnDelta, 'Sóng Não Delta 4Hz');
    });
  }

  if (btnRain) {
    btnRain.addEventListener('click', () => {
      toggleAudioTrack('rain', btnRain, 'Tiếng Mưa Pink Noise');
    });
  }

  if (btnOcean) {
    btnOcean.addEventListener('click', () => {
      toggleAudioTrack('ocean', btnOcean, 'Sóng Biển Đêm');
    });
  }

  if (btnBowl) {
    btnBowl.addEventListener('click', () => {
      toggleAudioTrack('bowl', btnBowl, 'Chuông Xoay 432Hz');
    });
  }
}

function ensureAudioContext() {
  if (!AppState.audio.ctx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    AppState.audio.ctx = new AudioContext();
  }
  if (AppState.audio.ctx.state === 'suspended') {
    AppState.audio.ctx.resume();
  }
  return AppState.audio.ctx;
}

function toggleAudioTrack(trackKey, btn, label) {
  const ctx = ensureAudioContext();
  const track = AppState.audio[trackKey];

  if (track.isPlaying) {
    // Stop
    stopAudioTrack(trackKey);
    btn.classList.remove('playing');
    btn.innerHTML = `<i class="fa-solid fa-play"></i> Bật`;
    updateSoundIndicator();
  } else {
    // Start
    startAudioTrack(trackKey, ctx);
    btn.classList.add('playing');
    btn.innerHTML = `<i class="fa-solid fa-pause"></i> Dừng`;
    updateSoundIndicator();
  }
}

function startAudioTrack(key, ctx) {
  const track = AppState.audio[key];
  track.isPlaying = true;

  if (key === 'delta') {
    // Binaural Beats: 200Hz Left, 204Hz Right -> 4Hz Delta difference in brain
    track.gain = ctx.createGain();
    track.gain.gain.setValueAtTime(0.2, ctx.currentTime);

    const merger = ctx.createChannelMerger(2);

    track.leftOsc = ctx.createOscillator();
    track.leftOsc.type = 'sine';
    track.leftOsc.frequency.setValueAtTime(200, ctx.currentTime);

    track.rightOsc = ctx.createOscillator();
    track.rightOsc.type = 'sine';
    track.rightOsc.frequency.setValueAtTime(204, ctx.currentTime);

    track.leftOsc.connect(merger, 0, 0);
    track.rightOsc.connect(merger, 0, 1);
    merger.connect(track.gain);
    track.gain.connect(ctx.destination);

    track.leftOsc.start();
    track.rightOsc.start();
  } else if (key === 'rain') {
    // Pink noise rain synthesis
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.12;
    }

    track.node = ctx.createBufferSource();
    track.node.buffer = buffer;
    track.node.loop = true;

    track.gain = ctx.createGain();
    track.gain.gain.setValueAtTime(0.25, ctx.currentTime);

    track.node.connect(track.gain);
    track.gain.connect(ctx.destination);
    track.node.start();
  } else if (key === 'ocean') {
    // Ocean waves with slow low frequency modulation
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    track.node = ctx.createBufferSource();
    track.node.buffer = buffer;
    track.node.loop = true;

    track.gain = ctx.createGain();
    track.gain.gain.setValueAtTime(0.18, ctx.currentTime);

    track.lfo = ctx.createOscillator();
    track.lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8s swell wave
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.12, ctx.currentTime);

    track.lfo.connect(lfoGain);
    lfoGain.connect(track.gain.gain);

    track.node.connect(track.gain);
    track.gain.connect(ctx.destination);

    track.node.start();
    track.lfo.start();
  } else if (key === 'bowl') {
    // Tibetan Singing Bowl 432Hz bell strike periodically
    track.gain = ctx.createGain();
    track.gain.gain.setValueAtTime(0.3, ctx.currentTime);
    track.gain.connect(ctx.destination);

    function strikeBowl() {
      if (!track.isPlaying) return;
      const osc = ctx.createOscillator();
      const strikeGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime);

      strikeGain.gain.setValueAtTime(0.4, ctx.currentTime);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5.5);

      osc.connect(strikeGain);
      strikeGain.connect(track.gain);

      osc.start();
      osc.stop(ctx.currentTime + 6.0);
    }

    strikeBowl();
    track.intervalId = setInterval(strikeBowl, 7000);
  }
}

function stopAudioTrack(key) {
  const track = AppState.audio[key];
  track.isPlaying = false;

  try {
    if (key === 'delta') {
      if (track.leftOsc) track.leftOsc.stop();
      if (track.rightOsc) track.rightOsc.stop();
    } else if (key === 'rain') {
      if (track.node) track.node.stop();
    } else if (key === 'ocean') {
      if (track.node) track.node.stop();
      if (track.lfo) track.lfo.stop();
    } else if (key === 'bowl') {
      if (track.intervalId) clearInterval(track.intervalId);
    }
  } catch (e) {
    console.warn("Audio stop error", e);
  }
}

function updateSoundIndicator() {
  const isAnyPlaying = Object.values(AppState.audio).some(t => t && t.isPlaying);
  const ind = document.getElementById('sound-indicator');
  if (ind) ind.style.display = isAnyPlaying ? 'inline-flex' : 'none';
}

function initCalendarModal() {
  const openFolderBtn = document.getElementById('btn-open-calendar');
  const modal = document.getElementById('calendar-modal');
  const closeBtn = document.getElementById('close-calendar-modal');

  function open() {
    modal.style.display = 'flex';
    renderCalendarSlots();
  }
  function close() { modal.style.display = 'none'; }

  if (openFolderBtn) openFolderBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }
}

function renderCalendarSlots() {
  const list = document.getElementById('calendar-slots-list');
  if (!list) return;

  const slots = [
    { time: '11:30 - 13:00 (Nghỉ Trưa)', action: 'Đi bộ thư giãn 5 phút + Ngủ trưa Power Nap không quá 25 phút.' },
    { time: '15:30 - 16:00 (Khe Trống Chiều)', action: 'Dừng hoàn toàn nạp caffeine. Xoay cổ vai gáy Chin-Tuck 2 phút tại bàn.' },
    { time: '17:30 - 18:30 (Tan Sở)', action: 'Đi bộ 10 phút ngoài trời đón ánh sáng hoàng hôn đồng bộ nhịp sinh học.' },
    { time: '21:00 - 22:00 (Buổi Tối Thư Giãn)', action: 'Kích hoạt Digital Sunset: Giảm ánh sáng xanh, điều hòa 25°C.' }
  ];

  list.innerHTML = slots.map(s => `
    <div class="slot-item">
      <div>
        <div class="slot-time"><i class="fa-regular fa-clock"></i> ${s.time}</div>
        <div class="slot-action">${s.action}</div>
      </div>
      <span style="font-size: 0.76rem; background: rgba(16, 185, 129, 0.15); color: #34D399; padding: 0.3rem 0.65rem; border-radius: 999px;">
        <i class="fa-solid fa-check"></i> Tự động xếp
      </span>
    </div>
  `).join('');
}

function initNutritionModal() {
  const openFolderBtn = document.getElementById('btn-open-nutrition');
  const modal = document.getElementById('nutrition-modal');
  const closeBtn = document.getElementById('close-nutrition-modal');

  function open() { modal.style.display = 'flex'; }
  function close() { modal.style.display = 'none'; }

  if (openFolderBtn) openFolderBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }
}

function initEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  const closeBtn = document.getElementById('close-edit-profile-modal');
  const cancelBtn = document.getElementById('cancel-edit-profile-btn');
  const saveBtn = document.getElementById('save-edit-profile-btn');

  function close() { modal.style.display = 'none'; }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (cancelBtn) cancelBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('edit-fullname');
      const phoneInput = document.getElementById('edit-phone');
      const jobInput = document.getElementById('edit-job');
      const bedtimeInput = document.getElementById('edit-bedtime');
      const waketimeInput = document.getElementById('edit-waketime');

      if (nameInput && nameInput.value.trim()) {
        AppState.currentUser.fullName = nameInput.value.trim();
      }
      if (phoneInput) {
        AppState.currentUser.phone = phoneInput.value.trim();
      }
      if (jobInput) {
        AppState.currentUser.occupation = jobInput.value;
        AppState.currentUser.occupationLabel = jobInput.options[jobInput.selectedIndex].text;
      }
      if (bedtimeInput) {
        AppState.currentUser.targetBedtime = bedtimeInput.value;
      }
      if (waketimeInput) {
        AppState.currentUser.targetWaketime = waketimeInput.value;
      }

      updateUserUI();
      renderDrawerProfileData();
      close();
      showToast('Đã lưu thông tin hồ sơ của bạn thành công!', 'fa-circle-check', 'success');
    });
  }
}

function openEditProfileModal() {
  if (AppState.currentUser.id === 'guest') {
    openSwitchAccountModal();
    return;
  }
  const modal = document.getElementById('edit-profile-modal');
  const nameInput = document.getElementById('edit-fullname');
  const phoneInput = document.getElementById('edit-phone');
  const jobInput = document.getElementById('edit-job');
  const bedtimeInput = document.getElementById('edit-bedtime');
  const waketimeInput = document.getElementById('edit-waketime');

  const u = AppState.currentUser;
  if (nameInput) nameInput.value = u.fullName;
  if (phoneInput) phoneInput.value = u.phone;
  if (jobInput) jobInput.value = u.occupation;
  if (bedtimeInput) bedtimeInput.value = u.targetBedtime;
  if (waketimeInput) waketimeInput.value = u.targetWaketime;

  if (modal) modal.style.display = 'flex';
}

function initDisclaimerModal() {
  const openBtn = document.getElementById('view-disclaimer-details-btn');
  const modal = document.getElementById('disclaimer-modal');
  const closeBtn = document.getElementById('close-disclaimer-modal');

  function open() { modal.style.display = 'flex'; }
  function close() { modal.style.display = 'none'; }

  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
  }
}
