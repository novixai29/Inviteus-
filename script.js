/*
 * Inviteus — معرض ثابت للاستعراض فقط.
 * رابط الدعوة المنشورة يشغّل المعاينة الحيّة بكامل مساحة عرض البطاقة، من دون صور عرض.
 * mockupUrl اختياري إذا كانت للدعوة صفحة عرض خاصة؛ previewUrl يفتح التجربة الكاملة.
 * ضع روابط التواصل الحقيقية في SITE_CONFIG.socials عندما تتوفر.
 * الموقع معرض فقط. الصوت يظهر ضمن الدعوات الأصلية التي تتضمنه.
 */
'use strict';

const SITE_CONFIG = {
  socials: {
    whatsapp: '', // رقم دولي بالأرقام فقط، مثل 9647…
    instagram: '', // رابط الحساب الكامل https://…
    facebook: ''   // رابط الصفحة الكامل https://…
  }
};

const CATEGORIES = [
  { id: 'all', name: 'كل التصاميم', symbol: '✧' },
  { id: 'engagement', name: 'خطوبة', symbol: '◇' },
  { id: 'henna', name: 'حنة', symbol: '❋' },
  { id: 'wedding', name: 'زفاف', symbol: '∞' },
  { id: 'conferences', name: 'مؤتمرات', symbol: '▤' },
  { id: 'openings', name: 'افتتاحيات', symbol: '⌑' },
  { id: 'stores', name: 'متاجر', symbol: '▥' },
  { id: 'food-menus', name: 'قوائم الطعام', symbol: '☷' },
  { id: 'drink-menus', name: 'قوائم المشروبات', symbol: '♧' }
];

const STYLES = {
  all: 'كل الأساليب',
  luxury: 'فاخر',
  classic: 'كلاسيكي',
  romantic: 'رومانسي',
  minimal: 'بسيط',
  creative: 'مبتكر',
  modern: 'عصري'
};

const FEATURES = {
  photos: 'معرض صور',
  bilingual: 'عربي / إنجليزي',
  countdown: 'عدّ تنازلي',
  maps: 'الموقع على الخريطة',
  calendar: 'إضافة الموعد للتقويم',
  darkMode: 'وضع داكن',
  audio: 'صوت ضمن التصميم الأصلي'
};

// كل عنصر أدناه دعوة موجودة فعلاً. يمكن إضافة الفئات الأخرى بالطريقة نفسها لاحقاً.
let TEMPLATES = [
  { id:'ENG-001', name:'الوعد الكلاسيكي', englishName:'Classic Promise', category:'engagement', styles:['classic','romantic'], description:'ظرف تفاعلي يفتح حكاية أنس وآية، مع الصور والعدّ التنازلي وموقع القاعة.', features:['photos','countdown','maps','audio'], previewPath:'templates/engagement-a/index.html', previewUrl:'https://novixai29.github.io/engagement-a/', image:'previews/engagement-a.webp', trending:false, newArrival:true },
  { id:'ENG-002', name:'خطوبة ملكية', englishName:'Royal Engagement', category:'engagement', styles:['luxury','classic'], description:'ستارة افتتاحية سوداء ولمسات ذهبية تمنح دعوة علي وزهراء حضوراً ملكياً.', features:['countdown','maps','calendar','audio'], previewPath:'templates/engagement-b/index.html', previewUrl:'https://novixai29.github.io/engagement-b/', image:'previews/engagement-b.webp', trending:true, newArrival:true },
  { id:'ENG-003', name:'حكايتنا', englishName:'Our Story', category:'engagement', styles:['romantic'], description:'رحلة يوسف ومريم تُروى بمشاهد وصور شخصية ومعرض يمكن تصفّحه.', features:['photos','maps','audio'], previewPath:'templates/engagement-c/index.html', previewUrl:'https://novixai29.github.io/engagement-c/', image:'previews/engagement-c.webp', trending:true, newArrival:true },
  { id:'ENG-004', name:'صحيفة الخطوبة', englishName:'The Engagement Times', category:'engagement', styles:['creative','classic'], description:'خبر خطوبة عمر وليان على صفحات صحيفة تفاعلية مع صور ووضع داكن.', features:['photos','maps','calendar','darkMode'], previewPath:'templates/engagement-d/index.html', previewUrl:'https://novixai29.github.io/engagement-d/', image:'previews/engagement-d.webp', trending:false, newArrival:true },
  { id:'ENG-005', name:'فيلم خطوبتنا', englishName:'Our Engagement Movie', category:'engagement', styles:['creative','romantic'], description:'دعوة كريم ونور بصيغة فيلم: مقدمة سينمائية وملصق ومشاهد مصوّرة مع صوت النسخة الأصلية.', features:['photos','countdown','maps','calendar','audio'], previewPath:'templates/engagement-e/index.html', previewUrl:'https://novixai29.github.io/engagement-e/', image:'previews/engagement-e.webp', trending:false, newArrival:true },
  { id:'ENG-006', name:'ألبوم الذكريات', englishName:'Scrapbook', category:'engagement', styles:['creative','romantic'], description:'دفتر ذكريات زيد وسارة، بصور وصفحات تشبه الألبوم الشخصي.', features:['photos','countdown','maps','calendar'], previewPath:'templates/engagement-f/index.html', previewUrl:'https://novixai29.github.io/engagement-f/', image:'previews/engagement-f.webp', trending:false, newArrival:true },
  { id:'ENG-007', name:'تحت النجوم', englishName:'Under The Stars', category:'engagement', styles:['romantic','luxury'], description:'سماء ليلية هادئة تحيط بدعوة يوسف وزهراء ومشهدها البصري وعدّها التنازلي.', features:['photos','countdown','maps','calendar'], previewPath:'templates/engagement-g/index.html', previewUrl:'https://novixai29.github.io/engagement-g/', image:'previews/engagement-g.webp', trending:true, newArrival:true },
  { id:'ENG-008', name:'الحديقة النباتية', englishName:'Botanical Garden', category:'engagement', styles:['romantic','classic'], description:'رسوم نباتية وبوابة أنيقة لخطوبة سيف وجنى بتفاصيل ناعمة.', features:['countdown','maps','calendar'], previewPath:'templates/engagement-h/index.html', previewUrl:'https://novixai29.github.io/engagement-h/', image:'previews/engagement-h.webp', trending:false, newArrival:true },
  { id:'ENG-009', name:'ترف هادئ', englishName:'Minimal Luxury', category:'engagement', styles:['minimal','luxury'], description:'خطوط نظيفة وصور ووضع داكن، مع خيار العربية والإنجليزية لدعوة رامي ولينا.', features:['photos','bilingual','countdown','maps','calendar','darkMode'], previewPath:'templates/engagement-i/index.html', previewUrl:'https://novixai29.github.io/engagement-i/', image:'previews/engagement-i.webp', trending:true, newArrival:true },
  { id:'ENG-010', name:'رحلة العمر', englishName:'Boarding Pass', category:'engagement', styles:['creative','modern'], description:'دعوة مروان وزينة على هيئة بطاقة صعود للطائرة، بتفاصيل الرحلة وموعد الإقلاع.', features:['countdown','maps','calendar'], previewPath:'templates/engagement-j/index.html', previewUrl:'https://novixai29.github.io/engagement-j/', image:'previews/engagement-j.webp', trending:false, newArrival:true }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const number = value => new Intl.NumberFormat('ar-IQ').format(value);
const categoryName = id => CATEGORIES.find(category => category.id === id)?.name || id;
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const previewLink = template => template.previewUrl || template.previewPath;
const mockupLink = template => template.mockupUrl || template.previewPath || previewLink(template);
const heartIcon = '<svg class="heart-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M24 42 5.8 24.7C-1.2 18 1.4 6.8 10 4.8c5.6-1.3 10.7 1.2 14 6.2 3.3-5 8.4-7.5 14-6.2 8.6 2 11.2 13.2 4.2 19.9L24 42Z"/></svg>';
const storageKey = 'inviteus-favorites-v2';
let favorites = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) favorites = new Set(saved.filter(id => TEMPLATES.some(template => template.id === id)));
} catch { /* المفضلة تظل متاحة لهذه الزيارة. */ }

const PAGE_SIZE = 8;
const state = { category:'all', collection:'all', page:1 };
let selectedTemplate = null;
let previousFocus = null;
let toastTimer = null;
let mockupObserver;

function mockupMarkup(template) {
  return `<div class="mockup-stage" data-mockup-id="${escapeHTML(template.id)}">
    <span class="mockup-loading" aria-hidden="true">${escapeHTML(template.name)}</span>
    <iframe data-mockup-src="${escapeHTML(mockupLink(template))}" title="معاينة تصميم ${escapeHTML(template.name)}" tabindex="-1" aria-hidden="true" scrolling="no"></iframe>
    ${template.mockupVideoUrl ? `<video class="mockup-video" data-video-src="${escapeHTML(template.mockupVideoUrl)}" muted playsinline loop preload="none" aria-hidden="true"></video>` : ''}
    <span class="mockup-cue" aria-hidden="true">حرّك المعاينة لتشوف التفاصيل</span>
  </div>`;
}

const demoOpeners = { 'ENG-001':'.open-prompt', 'ENG-002':'#openInvitationButton', 'ENG-003':'#startStoryButton', 'ENG-004':'#openPaperButton', 'ENG-005':'#enterMovieButton', 'ENG-007':'#enterInvitationButton', 'ENG-008':'#openGardenButton', 'ENG-010':'#enterButton' };
function previewScroller(frame) {
  try {
    const doc = frame.contentDocument;
    if (!doc || doc.location?.origin !== location.origin) return null;
    doc.querySelectorAll('audio, video').forEach(media => { media.muted = true; });
    const candidates = [doc.scrollingElement, ...doc.querySelectorAll('main, [class*="scroll"], [class*="page"]')].filter(Boolean);
    return candidates.reduce((best, node) => node.scrollHeight - node.clientHeight > (best?.scrollHeight - best?.clientHeight || 0) ? node : best, null);
  } catch { return null; }
}
function stopMockup(stage) {
  cancelAnimationFrame(stage._tourFrame);
  clearTimeout(stage._openTimer);
  clearTimeout(stage._touchStopTimer);
  clearInterval(stage._pageTimer);
  stage._tourFrame = 0;
  stage.classList.remove('is-previewing', 'manual-preview');
  const video = stage.querySelector('video');
  if (video) { video.pause(); video.currentTime = 0; }
  const scroller = previewScroller(stage.querySelector('iframe'));
  if (scroller) scroller.scrollTop = 0;
  stage.querySelector('iframe').style.pointerEvents = '';
}
function startMockup(stage) {
  if (stage._tourFrame || stage.classList.contains('is-previewing')) return;
  const frame = stage.querySelector('iframe');
  if (!frame.classList.contains('loaded')) return;
  const video = stage.querySelector('video');
  if (video) {
    if (!video.src) video.src = video.dataset.videoSrc;
    video.play().then(() => stage.classList.add('is-previewing')).catch(() => {});
    return;
  }
  let scroller = previewScroller(frame);
  if (!scroller) {
    stage.classList.add('manual-preview');
    stage.querySelector('.mockup-cue').textContent = 'تصفّح التصميم داخل البطاقة';
    frame.style.pointerEvents = 'auto'; // روابط خارجية: التصفح اليدوي يبقى حقيقياً داخل البطاقة.
    return;
  }
  stage.querySelector('.mockup-cue').textContent = 'حرّك المعاينة لتشوف التفاصيل';
  stage.classList.add('is-previewing');
  if (stage.dataset.mockupId === 'ENG-006') {
    stage._pageDirection = stage._pageDirection || 1;
    stage._pageTimer = setInterval(() => {
      try {
        const next = frame.contentDocument.querySelector('#nextPage');
        const previous = frame.contentDocument.querySelector('#prevPage');
        if (stage._pageDirection > 0 && next?.disabled) stage._pageDirection = -1;
        if (stage._pageDirection < 0 && previous?.disabled) stage._pageDirection = 1;
        (stage._pageDirection > 0 ? next : previous)?.click();
      } catch { clearInterval(stage._pageTimer); }
    }, 1800);
  }
  const opener = demoOpeners[stage.dataset.mockupId];
  if (opener && !stage._opened) {
    let attempts = 0;
    const openScene = () => {
      try {
        const button = frame.contentDocument.querySelector(opener);
        if (button && !button.disabled) { button.click(); stage._opened = true; }
      } catch { /* تظل المعاينة على مشهدها الأول. */ }
      if (!stage._opened && ++attempts < 10 && stage.classList.contains('is-previewing')) stage._openTimer = setTimeout(openScene, 700);
    };
    stage._openTimer = setTimeout(openScene, 850);
  }
  const began = performance.now();
  const tour = now => {
    if (!stage.isConnected || !stage.classList.contains('is-previewing')) return;
    const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    const progress = Math.max(0, (now - began - 1100) / 9500);
    const wave = progress % 2;
    scroller.scrollTop = max * (wave <= 1 ? wave : 2 - wave);
    stage._tourFrame = requestAnimationFrame(tour);
  };
  stage._tourFrame = requestAnimationFrame(tour);
}

function attachMockupInteraction(stage) {
  stage.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') startMockup(stage); });
  stage.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') stopMockup(stage); });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    stage._touchX = event.clientX;
    stage._touchStartScroll = previewScroller(stage.querySelector('iframe'))?.scrollTop || 0;
    stage._dragged = false;
    startMockup(stage);
  });
  stage.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch' || stage._touchX == null) return;
    const delta = stage._touchX - event.clientX;
    if (Math.abs(delta) < 12) return;
    stage._dragged = true;
    cancelAnimationFrame(stage._tourFrame);
    stage._tourFrame = 0;
    stage.classList.remove('is-previewing');
    const video = stage.querySelector('video');
    if (video?.duration) video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + delta / 190));
    else {
      const scroller = previewScroller(stage.querySelector('iframe'));
      if (scroller) { scroller.scrollTop = stage._touchStartScroll + delta * 3; stage._touchStartScroll = scroller.scrollTop; }
    }
    stage._touchX = event.clientX;
  });
  stage.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch') return;
    stage._touchX = null;
    clearTimeout(stage._touchStopTimer);
    stage._touchStopTimer = setTimeout(() => stopMockup(stage), 8000);
  });
  stage.closest('a')?.addEventListener('click', event => {
    if (stage._dragged) { event.preventDefault(); stage._dragged = false; }
  });
}

function activateMockups(root = document, immediate = false) {
  const frames = [...root.querySelectorAll('iframe[data-mockup-src]')];
  frames.forEach(frame => frame.addEventListener('load', () => {
    if (frame.getAttribute('src') === frame.dataset.mockupSrc) {
      frame.classList.add('loaded');
      if (frame.closest('.mockup-stage').matches(':hover')) startMockup(frame.closest('.mockup-stage'));
    }
  }));
  frames.forEach(frame => attachMockupInteraction(frame.closest('.mockup-stage')));
  if (immediate || !('IntersectionObserver' in window)) {
    frames.forEach(frame => { frame.src = frame.dataset.mockupSrc; });
    return;
  }
  mockupObserver?.disconnect();
  mockupObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const frame = entry.target;
      if (entry.isIntersecting && frame.getAttribute('src') !== frame.dataset.mockupSrc) {
        frame.src = frame.dataset.mockupSrc;
      } else if (!entry.isIntersecting && frame.getAttribute('src') === frame.dataset.mockupSrc) {
        stopMockup(frame.closest('.mockup-stage'));
        frame.classList.remove('loaded');
        frame.src = 'about:blank';
      }
    });
  }, { rootMargin:'160px' });
  frames.forEach(frame => mockupObserver.observe(frame));
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 3500);
}

function renderCategories() {
  $('#category-list').innerHTML = CATEGORIES.map(category => {
    const count = category.id === 'all' ? TEMPLATES.length : TEMPLATES.filter(template => template.category === category.id).length;
    return `<button type="button" data-category="${category.id}" class="category-card ${state.category === category.id ? 'active' : ''}" aria-pressed="${state.category === category.id}"><span class="category-symbol" aria-hidden="true">${category.symbol}</span><strong>${category.name}</strong><small>${count ? `${number(count)} ${count === 1 ? 'تصميم' : 'تصاميم'}` : 'قريباً'}</small></button>`;
  }).join('');
}

function filteredTemplates() {
  return TEMPLATES.filter(template => {
    if (state.category !== 'all' && template.category !== state.category) return false;
    if (state.collection === 'favorites' && !favorites.has(template.id)) return false;
    return true;
  }).reverse(); // ترتيب catalog.json هو ترتيب الإضافة؛ آخر دعوة مضافة تظهر أولاً.
}

function paginationMarkup(total, page, label) {
  if (!total) return '';
  const pages = Math.ceil(total / PAGE_SIZE);
  const buttons = Array.from({ length:pages }, (_, index) => {
    const value = index + 1;
    return `<button type="button" data-page="${value}" aria-label="صفحة ${number(value)}" ${value === page ? 'aria-current="page"' : ''}>${number(value)}</button>`;
  }).join('');
  return `<span class="page-summary">${label} ${number(page)} من ${number(pages)}</span><div class="page-buttons"><button type="button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="الصفحة السابقة">‹</button>${buttons}<button type="button" data-page="${page + 1}" ${page === pages ? 'disabled' : ''} aria-label="الصفحة التالية">›</button></div>`;
}

function cardMarkup(template) {
  const saved = favorites.has(template.id);
  return `<article class="template-card">
    <div class="card-cover">
      <a class="cover-link" href="${escapeHTML(previewLink(template))}" target="_blank" rel="noopener noreferrer" aria-label="شاهد تصميم ${escapeHTML(template.name)} كاملاً">
        ${mockupMarkup(template)}
        <span class="cover-open">شاهد التصميم كاملاً ↗</span>
      </a>
      <span class="card-badge">${categoryName(template.category)}</span>
      ${template.features.includes('audio') ? '<span class="sound-badge">♫ صوت أصلي</span>' : ''}
      <button type="button" class="favorite-button ${saved ? 'saved' : ''}" data-favorite="${template.id}" aria-label="${saved ? 'إزالة' : 'إضافة'} ${escapeHTML(template.name)} ${saved ? 'من' : 'إلى'} المفضلة" aria-pressed="${saved}">${heartIcon}</button>
    </div>
    <div class="card-body">
      <div class="card-kicker"><span>${template.id}</span><span>${template.styles.map(style => STYLES[style]).join(' · ')}</span></div>
      <h3>${escapeHTML(template.name)}</h3><span class="english-name" lang="en" dir="ltr">${escapeHTML(template.englishName)}</span>
      <p>${escapeHTML(template.description)}</p>
      <div class="card-features">${template.features.slice(0, 3).map(feature => `<span>${FEATURES[feature]}</span>`).join('')}${template.features.length > 3 ? `<span>+ ${number(template.features.length - 3)}</span>` : ''}</div>
      <div class="card-actions"><button type="button" class="button secondary" data-preview="${template.id}">تفاصيل التصميم</button><a class="button" href="${escapeHTML(previewLink(template))}" target="_blank" rel="noopener noreferrer">جرّب التصميم ↗</a></div>
    </div>
  </article>`;
}

function renderGallery() {
  renderCategories();
  const templates = filteredTemplates();
  const pages = Math.max(1, Math.ceil(templates.length / PAGE_SIZE));
  state.page = Math.min(Math.max(state.page, 1), pages);
  const visible = templates.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
  const pagination = paginationMarkup(templates.length, state.page, 'صفحة');
  $('#gallery-pages-top').innerHTML = pagination;
  $('#gallery-pages-bottom').innerHTML = pagination;
  $$('#template-grid .mockup-stage').forEach(stopMockup);
  $('#template-grid').innerHTML = visible.map(cardMarkup).join('');
  activateMockups($('#template-grid'));
  const labels = { all:'كل التصاميم', favorites:'المفضلة' };
  $('#result-count').textContent = `${labels[state.collection]} · ${number(templates.length)} تصاميم حقيقية · المعروض هسه ${number(visible.length)}`;
  $('#favorite-count').textContent = number(favorites.size);
  $('#favorite-nav').setAttribute('aria-label', `عرض المفضلة: ${number(favorites.size)} تصاميم`);
  $('#favorite-nav').classList.toggle('has-favorites', favorites.size > 0);
  const empty = $('#empty-state');
  empty.hidden = templates.length > 0;
  if (!templates.length) {
    const category = CATEGORIES.find(item => item.id === state.category);
    const upcoming = state.category !== 'all' && !TEMPLATES.some(template => template.category === state.category);
    $('#empty-title').textContent = upcoming ? `تصاميم ${category.name} قيد التجهيز` : state.collection === 'favorites' && !favorites.size ? 'مفضّلتك تنتظر أول تصميم' : 'ما لقينا تصميماً مطابقاً';
    $('#empty-copy').textContent = upcoming ? 'نضيف تصاميم هذه الفئة قريباً. وتكدر تتواصل ويانا إذا عندك فكرة لتصميمك.' : state.collection === 'favorites' && !favorites.size ? 'اضغط علامة القلب على التصميم اللي يعجبك حتى ترجع له بسهولة.' : 'جرّب اختيار فئة أخرى.';
  }
}

function resetFilters() {
  Object.assign(state, { category:'all', collection:'all', page:1 });
  renderGallery();
}

function jumpCollection(collection) {
  resetFilters();
  state.collection = collection;
  state.page = 1;
  renderGallery();
  $('#gallery').scrollIntoView({ behavior:'smooth' });
}

function toggleFavorite(id) {
  if (!TEMPLATES.some(template => template.id === id)) return;
  const added = !favorites.has(id);
  if (added) favorites.add(id); else favorites.delete(id);
  try { localStorage.setItem(storageKey, JSON.stringify([...favorites])); } catch { /* تكمل المفضلة بدون حفظ. */ }
  renderGallery();
  ($(`[data-favorite="${id}"]`) || $('#favorite-nav'))?.focus({ preventScroll:true });
  toast(added ? 'حفظنا التصميم بالمفضلة.' : 'أزلنا التصميم من المفضلة.');
}

function openDetails(id) {
  const template = TEMPLATES.find(item => item.id === id);
  if (!template) return;
  const dialog = $('#preview-dialog');
  previousFocus = document.activeElement;
  $('#preview-content').innerHTML = `<div class="preview-layout">
    <div class="preview-art">${mockupMarkup(template)}</div>
    <div class="preview-details">
      <p class="eyebrow">${categoryName(template.category)} · ${template.id}</p>
      <h2 id="preview-title">${escapeHTML(template.name)}</h2>
      <p class="preview-english" lang="en" dir="ltr">${escapeHTML(template.englishName)}</p>
      <p>${escapeHTML(template.description)}</p>
      <h3>تفاصيل موجودة في التصميم</h3>
      <ul>${template.features.map(feature => `<li>${FEATURES[feature]}</li>`).join('')}</ul>
      <p class="preview-note">التصميم يفتح من موقعه الأصلي بكل التفاصيل والصوت إن كان موجوداً. بعدها تقدر ترجع هنا وتتواصل ويانا.</p>
      <div class="preview-actions"><a class="button" href="${escapeHTML(previewLink(template))}" target="_blank" rel="noopener noreferrer">افتح التصميم كاملاً ↗</a><button type="button" class="button secondary" data-contact="${template.id}">تواصل بشأن هذا التصميم</button></div>
    </div>
  </div>`;
  dialog.showModal();
  document.body.classList.add('modal-open');
  activateMockups($('#preview-content'), true);
}

function chooseForContact(id) {
  const template = TEMPLATES.find(item => item.id === id);
  if (!template) return;
  selectedTemplate = template;
  const selected = $('#selected-template');
  selected.hidden = false;
  selected.textContent = `التصميم اللي شدّك: ${template.name} · ${template.id}. اذكر اسمه أو رمزه من تراسلنا.`;
  if ($('#preview-dialog').open) $('#preview-dialog').close();
  renderSocials();
  $('#contact').scrollIntoView({ behavior:'smooth' });
}

function safeSocialURL(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function whatsappNumber() {
  const digits = SITE_CONFIG.socials.whatsapp.replace(/\D/g, '');
  return /^\d{8,15}$/.test(digits) ? digits : '';
}

function renderSocials() {
  const whatsapp = whatsappNumber();
  const message = selectedTemplate
    ? `مرحباً Inviteus، عجبني تصميم ${selectedTemplate.name} (${selectedTemplate.id}) وأحب أستفسر عنه.`
    : 'مرحباً Inviteus، أحب أستفسر عن تصاميمكم.';
  const social = [
    { key:'whatsapp', name:'واتساب', icon:'icons/whatsapp.svg', url:whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : '' },
    { key:'instagram', name:'إنستغرام', icon:'icons/instagram.svg', url:safeSocialURL(SITE_CONFIG.socials.instagram) },
    { key:'facebook', name:'فيسبوك', icon:'icons/facebook.svg', url:safeSocialURL(SITE_CONFIG.socials.facebook) }
  ];
  $('#social-links').innerHTML = social.map(item => item.url
    ? `<a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer"><img class="social-symbol" src="${item.icon}" alt="" aria-hidden="true" width="26" height="26">${item.name}<span aria-hidden="true">↗</span></a>`
    : `<span class="social-pending"><img class="social-symbol" src="${item.icon}" alt="" aria-hidden="true" width="26" height="26">${item.name} · قريباً</span>`).join('');
  $('#contact-status').textContent = social.some(item => !item.url) ? 'نجهّز روابط التواصل الرسمية ونضيفها هنا قريباً.' : '';
  const floating = $('#floating-whatsapp');
  if (whatsapp) {
    floating.href = social[0].url;
    floating.target = '_blank';
    floating.rel = 'noopener noreferrer';
    floating.setAttribute('aria-label', 'التواصل عبر واتساب');
  } else {
    floating.href = '#contact';
    floating.removeAttribute('target');
    floating.setAttribute('aria-label', 'الانتقال إلى وسائل التواصل');
  }
}

function closeMenu() {
  $('#main-nav').classList.remove('is-open');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', 'فتح القائمة');
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.category) {
    state.category = button.dataset.category;
    state.page = 1;
    renderGallery();
    $(`[data-category="${state.category}"]`)?.focus({ preventScroll:true });
  } else if (button.dataset.page) {
    const page = Number(button.dataset.page);
    if (!Number.isInteger(page) || page < 1 || page > Math.ceil(filteredTemplates().length / PAGE_SIZE)) return;
    state.page = page;
    renderGallery();
    $('#gallery-pages-top').scrollIntoView({ behavior:'smooth', block:'start' });
  } else if (button.dataset.favorite) {
    toggleFavorite(button.dataset.favorite);
  } else if (button.dataset.preview) {
    openDetails(button.dataset.preview);
  } else if (button.dataset.contact) {
    chooseForContact(button.dataset.contact);
  } else if (button.dataset.close) {
    document.getElementById(button.dataset.close)?.close();
  }
});

$('#reset-filters').addEventListener('click', resetFilters);
$('#empty-reset').addEventListener('click', () => { resetFilters(); $('#gallery').scrollIntoView({ behavior:'smooth' }); });
$('#favorite-nav').addEventListener('click', () => jumpCollection('favorites'));
$('#menu-toggle').addEventListener('click', () => {
  const opened = $('#main-nav').classList.toggle('is-open');
  $('#menu-toggle').setAttribute('aria-expanded', String(opened));
  $('#menu-toggle').setAttribute('aria-label', opened ? 'إغلاق القائمة' : 'فتح القائمة');
});
$$('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
$('#preview-dialog').addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  $$('#preview-content .mockup-stage').forEach(stopMockup);
  $('#preview-content').replaceChildren();
  previousFocus?.isConnected && previousFocus.focus({ preventScroll:true });
});
$('#preview-dialog').addEventListener('click', event => { if (event.target === $('#preview-dialog')) $('#preview-dialog').close(); });
window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  try {
    const saved = JSON.parse(event.newValue || '[]');
    favorites = new Set(Array.isArray(saved) ? saved.filter(id => TEMPLATES.some(template => template.id === id)) : []);
    renderGallery();
  } catch { /* لا حاجة للتعامل مع بيانات خارجية غير صالحة. */ }
});

// بيانات المعرض تُحدَّث من المستودع مباشرة، بينما تبقى النسخة المضمّنة احتياطاً عند انقطاع الاتصال.
const catalogApi = 'https://api.github.com/repos/novixai29/Inviteus-/contents/catalog.json';
function decodeCatalog(content) {
  const bytes = Uint8Array.from(atob(content.replace(/\s/g, '')), char => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
function validCatalogTemplate(template) {
  if (!template || typeof template !== 'object') return false;
  if (!/^[A-Z]{3}-\d{3,}$/.test(template.id || '')) return false;
  if (!CATEGORIES.some(category => category.id === template.category && category.id !== 'all')) return false;
  if (!template.name || !template.description) return false;
  if (!Array.isArray(template.styles) || !Array.isArray(template.features)) return false;
  try {
    const link = new URL(template.previewUrl);
    if (link.protocol !== 'https:') return false;
    const mockup = new URL(template.mockupUrl || template.previewUrl);
    const video = template.mockupVideoUrl ? new URL(template.mockupVideoUrl) : null;
    return mockup.protocol === 'https:' && (!video || video.protocol === 'https:');
  } catch { return false; }
}
async function refreshCatalog() {
  try {
    const response = await fetch(`${catalogApi}?ref=main&v=${Math.floor(Date.now() / 30000)}`, { cache:'no-store', headers:{ Accept:'application/vnd.github+json' } });
    if (!response.ok) return;
    const file = await response.json();
    const catalog = file.content ? decodeCatalog(file.content) : file;
    if (!Array.isArray(catalog.templates) || !catalog.templates.every(validCatalogTemplate)) return;
    if (JSON.stringify(catalog.templates) === JSON.stringify(TEMPLATES)) return;
    TEMPLATES = catalog.templates;
    favorites = new Set([...favorites].filter(id => TEMPLATES.some(template => template.id === id)));
    if (selectedTemplate && !TEMPLATES.some(template => template.id === selectedTemplate.id)) {
      selectedTemplate = null;
      $('#selected-template').hidden = true;
    }
    renderGallery();
  } catch { /* تبقى آخر بيانات متاحة ظاهرة للزائر. */ }
}
if ('BroadcastChannel' in window) {
  const catalogChannel = new BroadcastChannel('inviteus-catalog');
  catalogChannel.addEventListener('message', event => { if (event.data === 'updated') refreshCatalog(); });
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshCatalog(); });
setInterval(refreshCatalog, 180000);

renderGallery();
renderSocials();
refreshCatalog();
$('#year').textContent = new Intl.NumberFormat('ar-IQ', { useGrouping:false }).format(new Date().getFullYear());
