'use strict';

const REPO_OWNER = 'novixai29';
const REPO_NAME = 'Inviteus-';
const API_ROOT = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;
const CATEGORY_NAMES = { engagement:'خطوبة', henna:'حنة', wedding:'زفاف', conferences:'مؤتمرات', openings:'افتتاحيات' };
const CATEGORY_CODES = { engagement:'ENG', henna:'HEN', wedding:'WED', conferences:'CON', openings:'OPN' };
const STYLES = { luxury:'فاخر', classic:'كلاسيكي', romantic:'رومانسي', minimal:'بسيط', creative:'مبتكر', modern:'عصري' };
const FEATURES = { photos:'صور شخصية', bilingual:'عربي / إنجليزي', countdown:'عدّ تنازلي', maps:'رابط موقع القاعة', calendar:'إضافة الموعد للتقويم', darkMode:'وضع داكن', audio:'صوت ضمن الدعوة الأصلية' };
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const number = value => new Intl.NumberFormat('ar-IQ').format(value);
let token = '';
let catalog = null;
let catalogSha = '';
let busy = false;

function status(message, error = false) {
  const element = $('#admin-status');
  element.textContent = message;
  element.classList.toggle('error', error);
}
function setBusy(value) {
  busy = value;
  $('#save-template').disabled = value;
  $('#reload-catalog').disabled = value;
  $('#new-template').disabled = value;
}
function encodeBase64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return btoa(binary);
}
function decodeBase64(value) {
  return new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g, '')), char => char.charCodeAt(0)));
}
async function api(path, options = {}) {
  const response = await fetch(`https://api.github.com/${path}`, {
    ...options,
    cache:'no-store',
    headers:{ Accept:'application/vnd.github+json', Authorization:`Bearer ${token}`, 'X-GitHub-Api-Version':'2022-11-28', ...options.headers }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = response.status === 401 ? 'رمز الوصول غير صحيح أو انتهت صلاحيته.'
      : response.status === 403 ? 'الرمز لا يملك صلاحية تعديل هذا المستودع، أو وصلت إلى حد طلبات GitHub.'
      : response.status === 409 ? 'تغيّرت القائمة أثناء التعديل. حدّث القائمة وجرّب مرة ثانية.'
      : payload.message || `تعذّر الاتصال بـ GitHub (${response.status}).`;
    throw new Error(detail);
  }
  return payload;
}
async function readCatalog() {
  const file = await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/catalog.json?ref=main&v=${Date.now()}`);
  const data = JSON.parse(decodeBase64(file.content));
  if (!Array.isArray(data.templates)) throw new Error('ملف الدعوات في المستودع غير صالح.');
  return { data, sha:file.sha };
}
function styleChoices() {
  $('#style-options').innerHTML = Object.entries(STYLES).map(([key, label]) => `<label><input type="checkbox" name="styles" value="${key}">${label}</label>`).join('');
  $('#feature-options').innerHTML = Object.entries(FEATURES).map(([key, label]) => `<label><input type="checkbox" name="features" value="${key}">${label}</label>`).join('');
}
function renderCards() {
  const templates = catalog.templates;
  $('#catalog-count').textContent = `${number(templates.length)} دعوات في المعرض`;
  $('#admin-cards').innerHTML = templates.length ? templates.map(template => `<article class="admin-card">
    <img src="${escapeHTML(template.image)}" alt="" loading="lazy">
    <div class="admin-card-body"><strong>${escapeHTML(template.name)}</strong><small>${escapeHTML(CATEGORY_NAMES[template.category] || template.category)} · ${escapeHTML(template.id)}</small>
      <div class="admin-card-actions"><button type="button" data-edit="${escapeHTML(template.id)}">تعديل</button><a href="${escapeHTML(template.previewUrl)}" target="_blank" rel="noopener noreferrer">شاهد الدعوة ↗</a><button type="button" class="danger" data-delete="${escapeHTML(template.id)}">حذف</button></div>
    </div></article>`).join('') : '<p>ماكو دعوات حالياً. أضف أول دعوة من النموذج.</p>';
}
function repoFromPublished(url) {
  try {
    const parsed = new URL(url);
    const match = parsed.hostname.match(/^([\w-]+)\.github\.io$/);
    const repository = parsed.pathname.split('/').filter(Boolean)[0];
    return match && repository ? `https://github.com/${match[1]}/${repository}` : '';
  } catch { return ''; }
}
function publishedFromRepo(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    return parsed.hostname === 'github.com' && parts.length === 2 ? `https://${parts[0]}.github.io/${parts[1]}/` : '';
  } catch { return ''; }
}
function newId(category) {
  const prefix = CATEGORY_CODES[category];
  const numbers = catalog.templates.filter(item => item.id.startsWith(`${prefix}-`)).map(item => Number(item.id.split('-')[1]) || 0);
  const next = Math.max(catalog.nextIds?.[category] || 1, Math.max(0, ...numbers) + 1);
  return `${prefix}-${String(next).padStart(3, '0')}`;
}
function resetForm() {
  $('#template-form').reset();
  $('#template-id').value = '';
  $('#editor-title').textContent = 'إضافة دعوة';
  $('#save-template').textContent = 'حفظ الدعوة';
  $('#image-help').textContent = 'مطلوبة للدعوة الجديدة · JPG أو PNG أو WebP حتى ٢ ميغابايت';
  $('#current-image').hidden = true;
}
function editTemplate(id) {
  const template = catalog.templates.find(item => item.id === id);
  if (!template) return;
  resetForm();
  $('#template-id').value = template.id;
  $('#template-name').value = template.name;
  $('#template-english').value = template.englishName || '';
  $('#template-category').value = template.category;
  $('#template-repo').value = template.repoUrl || repoFromPublished(template.previewUrl);
  $('#template-url').value = template.previewUrl;
  $('#template-description').value = template.description;
  document.querySelectorAll('[name="styles"]').forEach(input => { input.checked = template.styles.includes(input.value); });
  document.querySelectorAll('[name="features"]').forEach(input => { input.checked = template.features.includes(input.value); });
  $('#current-image').innerHTML = `صورة العرض الحالية <img src="${escapeHTML(template.image)}" alt="صورة العرض الحالية">`;
  $('#current-image').hidden = false;
  $('#editor-title').textContent = `تعديل ${template.name}`;
  $('#save-template').textContent = 'حفظ التعديلات';
  $('#image-help').textContent = 'اختياري إذا تريد تبدّل لقطة العرض';
  $('#template-form').scrollIntoView({ behavior:'smooth', block:'start' });
}
function validatedUrl(value, kind) {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:') throw new Error(`${kind} لازم يبدأ بـ https://`);
  return url.href;
}
async function uploadImage(file, id) {
  if (!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('اختَر صورة JPG أو PNG أو WebP.');
  if (file.size > 2 * 1024 * 1024) throw new Error('الصورة أكبر من ٢ ميغابايت. اختَر لقطة أصغر.');
  const extension = { 'image/png':'png', 'image/jpeg':'jpg', 'image/webp':'webp' }[file.type];
  const path = `previews/${id.toLowerCase()}-${Date.now()}.${extension}`;
  const content = encodeBase64(new Uint8Array(await file.arrayBuffer()));
  await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ message:`Add preview for ${id}`, content, branch:'main' })
  });
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}`;
}
function ownedPreviewPath(template) {
  const prefix = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/previews/`;
  if (!template?.image?.startsWith(prefix)) return '';
  const file = template.image.slice(prefix.length);
  return new RegExp(`^${template.id.toLowerCase()}-\\d+\\.(png|jpg|webp)$`).test(file) ? `previews/${file}` : '';
}
async function removeUnusedPreview(template) {
  const path = ownedPreviewPath(template);
  if (!path || catalog.templates.some(item => item.image === template.image)) return;
  const file = await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=main`);
  await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method:'DELETE', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ message:`Remove unused preview for ${template.id}`, sha:file.sha, branch:'main' })
  });
}
async function saveCatalog(nextCatalog, message) {
  const latest = await readCatalog();
  if (latest.sha !== catalogSha) throw new Error('تغيّرت القائمة من مكان آخر. اضغط «تحديث القائمة» قبل الحفظ.');
  const bytes = new TextEncoder().encode(`${JSON.stringify(nextCatalog, null, 2)}\n`);
  const result = await api(`repos/${REPO_OWNER}/${REPO_NAME}/contents/catalog.json`, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ message, content:encodeBase64(bytes), sha:catalogSha, branch:'main' })
  });
  catalog = nextCatalog;
  catalogSha = result.content.sha;
  renderCards();
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('inviteus-catalog');
    channel.postMessage('updated');
    channel.close();
  }
}

$('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const candidate = $('#access-token').value.trim();
  if (!candidate) return;
  token = candidate;
  status('نتأكد من صلاحية الرمز…');
  try {
    const profile = await api('user');
    if (profile.login?.toLowerCase() !== REPO_OWNER.toLowerCase()) throw new Error(`هذا الرمز لحساب ${profile.login || 'آخر'}؛ يحتاج حساب ${REPO_OWNER}.`);
    const latest = await readCatalog();
    catalog = latest.data;
    catalogSha = latest.sha;
    $('#access-token').value = '';
    $('#connected-user').textContent = `متصل بحساب ${profile.login}`;
    $('#login-panel').hidden = true;
    $('#admin-workspace').hidden = false;
    renderCards();
    resetForm();
    status('اللوحة جاهزة.');
  } catch (error) { token = ''; status(error.message, true); }
});
$('#template-repo').addEventListener('change', () => {
  if (!$('#template-url').value.trim()) $('#template-url').value = publishedFromRepo($('#template-repo').value);
});
$('#template-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !catalog) return;
  setBusy(true);
  status('نحفظ الدعوة في المستودع…');
  try {
    const originalId = $('#template-id').value;
    const category = $('#template-category').value;
    const id = originalId || newId(category);
    const repoUrl = validatedUrl($('#template-repo').value, 'رابط المستودع');
    if (new URL(repoUrl).hostname !== 'github.com') throw new Error('رابط المستودع لازم يكون من GitHub.');
    const previewUrl = validatedUrl($('#template-url').value, 'رابط الدعوة');
    const imageFile = $('#template-image').files[0];
    const original = catalog.templates.find(item => item.id === originalId);
    if (!original && !imageFile) throw new Error('اختَر لقطة عرض للدعوة الجديدة.');
    const image = imageFile ? await uploadImage(imageFile, id) : original.image;
    const template = {
      id, name:$('#template-name').value.trim(), englishName:$('#template-english').value.trim(), category,
      styles:[...document.querySelectorAll('[name="styles"]:checked')].map(input => input.value),
      description:$('#template-description').value.trim(),
      features:[...document.querySelectorAll('[name="features"]:checked')].map(input => input.value),
      previewUrl, repoUrl, image, trending:original?.trending || false, newArrival:original?.newArrival ?? true
    };
    if (!template.name || !template.description) throw new Error('اكتب اسم التصميم وتفاصيله.');
    const templates = original ? catalog.templates.map(item => item.id === originalId ? template : item) : [...catalog.templates, template];
    const nextIds = original ? catalog.nextIds : { ...catalog.nextIds, [category]:Number(id.split('-')[1]) + 1 };
    await saveCatalog({ ...catalog, nextIds, templates }, `${original ? 'Update' : 'Add'} invitation ${id}`);
    resetForm();
    if (original && imageFile) {
      try { await removeUnusedPreview(original); }
      catch { status(`انحفظت الدعوة، لكن تعذّر تنظيف صورة العرض القديمة.`, true); return; }
    }
    status(`انحفظت دعوة «${template.name}» بنجاح. افتح الموقع أو حدّثه حتى تشوفها.`);
  } catch (error) { status(error.message, true); }
  finally { setBusy(false); }
});
$('#admin-cards').addEventListener('click', async event => {
  const edit = event.target.closest('[data-edit]');
  if (edit) { editTemplate(edit.dataset.edit); return; }
  const remove = event.target.closest('[data-delete]');
  if (!remove || busy) return;
  const template = catalog.templates.find(item => item.id === remove.dataset.delete);
  if (!template || !confirm(`تحذف «${template.name}» من معرض Inviteus؟`)) return;
  setBusy(true);
  status('نحذف البطاقة من المعرض…');
  try {
    await saveCatalog({ ...catalog, templates:catalog.templates.filter(item => item.id !== template.id) }, `Remove invitation ${template.id}`);
    if ($('#template-id').value === template.id) resetForm();
    try { await removeUnusedPreview(template); }
    catch { status(`انحذفت البطاقة، لكن تعذّر تنظيف صورة عرضها.`, true); return; }
    status(`انحذفت بطاقة «${template.name}» من المعرض.`);
  } catch (error) { status(error.message, true); }
  finally { setBusy(false); }
});
$('#new-template').addEventListener('click', () => { resetForm(); $('#template-form').scrollIntoView({ behavior:'smooth', block:'start' }); });
$('#cancel-edit').addEventListener('click', resetForm);
$('#reload-catalog').addEventListener('click', async () => {
  if (busy) return;
  setBusy(true);
  try { const latest = await readCatalog(); catalog = latest.data; catalogSha = latest.sha; renderCards(); resetForm(); status('القائمة محدثة.'); }
  catch (error) { status(error.message, true); }
  finally { setBusy(false); }
});
$('#logout').addEventListener('click', () => {
  token = ''; catalog = null; catalogSha = '';
  $('#admin-workspace').hidden = true;
  $('#login-panel').hidden = false;
  $('#login-form').reset();
  status('طلعت من لوحة الإدارة.');
});
styleChoices();
