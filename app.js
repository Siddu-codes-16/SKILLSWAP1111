const MEMBERS = [
  { id: 'maya', name: 'Maya Patel', initials: 'M', color: 'coral', distance: 1.2, location: 'Riverside', teaches: 'Pasta making', wants: 'UX feedback', group: 'Creative', match: 98 },
  { id: 'liam', name: 'Liam Brooks', initials: 'L', color: 'mint', distance: .8, location: 'Willow Park', teaches: 'Bike repair', wants: 'Beginner French', group: 'Home', match: 94 },
  { id: 'aisha', name: 'Aisha Khan', initials: 'A', color: 'gold', distance: 2.1, location: 'Old Market', teaches: 'Intro to Python', wants: 'Watercolour', group: 'Tech', match: 91 },
  { id: 'noah', name: 'Noah Williams', initials: 'N', color: 'lilac', distance: 1.9, location: 'Maple Quarter', teaches: 'Spanish conversation', wants: 'Bread baking', group: 'Language', match: 89 },
  { id: 'elena', name: 'Elena Rossi', initials: 'E', color: 'coral', distance: 3.6, location: 'Southbank', teaches: 'Yoga for desk workers', wants: 'Photo editing', group: 'Wellbeing', match: 86 },
  { id: 'jun', name: 'Jun Park', initials: 'J', color: 'mint', distance: 4.7, location: 'Station District', teaches: 'Home coffee', wants: 'Guitar basics', group: 'Creative', match: 84 }
];

const DEFAULT_STATE = { profile: { name: 'Your Story', location: 'Riverside', teaches: '', avatar: '' }, swaps: [], messages: { maya: [{ mine: false, text: 'Your pasta swap sounds lovely. Want to meet at the market kitchen?' }] } };
const $ = (selector) => document.querySelector(selector);
const state = loadState();
let activeMember = MEMBERS[0];

function loadState() { try { return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem('skillSwapNearbyState') || '{}') }; } catch { return structuredClone(DEFAULT_STATE); } }
function saveState() { localStorage.setItem('skillSwapNearbyState', JSON.stringify(state)); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }
function initials(name) { return name.split(/\s+/).map(word => word[0]).slice(0, 2).join('').toUpperCase(); }

function renderCards() {
  const query = $('#skill-search').value.trim().toLowerCase();
  const category = $('.category.active').dataset.skill;
  const limit = $('#distance-filter').value;
  const members = MEMBERS.filter(member => {
    const haystack = `${member.name} ${member.teaches} ${member.wants} ${member.location} ${member.group}`.toLowerCase();
    return (!query || haystack.includes(query)) && (category === 'All' || member.group === category) && (limit === 'any' || member.distance <= Number(limit));
  });
  $('#skill-grid').innerHTML = members.length ? members.map(member => `
    <article class="skill-card">
      <div class="skill-card-top"><span class="profile-dot portrait-${member.color}">${member.initials}</span><span class="card-match">${member.match}% match</span></div>
      <h3>${escapeHtml(member.name)}</h3><span class="location">● ${escapeHtml(member.location)} · ${member.distance} km away</span>
      <div class="skills"><div class="skill-pair"><span>Teaches: ${escapeHtml(member.teaches)}</span><span>Wants: ${escapeHtml(member.wants)}</span></div><button class="connect-button" data-member="${member.id}">Connect →</button></div>
    </article>`).join('') : '<div class="empty-state">No neighbours fit that search yet. Try a broader skill or distance.</div>';
  document.querySelectorAll('[data-member]').forEach(button => button.addEventListener('click', () => openMessage(MEMBERS.find(member => member.id === button.dataset.member))));
}

function updateProfileUI() {
  const id = initials(state.profile.name);
  $('#header-avatar').textContent = id;
  $('#profile-initials').textContent = id;
  $('#profile-name').value = state.profile.name;
  $('#profile-location').value = state.profile.location;
  $('#profile-teaches').value = state.profile.teaches;
  const preview = $('#profile-preview');
  if (state.profile.avatar) { preview.src = state.profile.avatar; preview.hidden = false; $('#profile-initials').hidden = true; }
  else { preview.hidden = true; $('#profile-initials').hidden = false; }
}

function renderMessages() {
  const mayaMessages = state.messages.maya || [];
  const latest = mayaMessages[mayaMessages.length - 1];
  $('#message-preview').innerHTML = `<button class="message-preview-item" data-preview-message="maya"><span class="portrait portrait-coral">M</span><p><strong>Maya Patel <span>· just now</span></strong>${escapeHtml(latest?.text || 'Say hello to start a swap.')}</p></button>`;
  $('[data-preview-message]').style.cssText = 'border:0;background:transparent;padding:0;text-align:left;width:100%;cursor:pointer';
  $('[data-preview-message]').addEventListener('click', () => openMessage(MEMBERS[0]));
}

function openModal(id) { const modal = $(id); if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', ''); }
function closeModal(id) { $(id).close(); }
function toast(message) { const element = $('#toast'); element.textContent = message; element.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => element.classList.remove('show'), 3200); }
function openMessage(member) {
  activeMember = member;
  $('#message-title').textContent = `Message ${member.name.split(' ')[0]}`;
  const history = state.messages[member.id] || [{ mine: false, text: `Hi! I’d be happy to tell you more about ${member.teaches.toLowerCase()}.` }];
  $('#chat-history').innerHTML = history.map(message => `<div class="bubble${message.mine ? ' mine' : ''}">${escapeHtml(message.text)}</div>`).join('');
  openModal('#message-modal');
}

document.addEventListener('DOMContentLoaded', () => {
  updateProfileUI(); renderCards(); renderMessages();
  ['#hero-create','#discover-create','#dashboard-create','#cta-create'].forEach(id => $(id).addEventListener('click', () => openModal('#swap-modal')));
  $('#open-profile').addEventListener('click', () => openModal('#profile-modal'));
  $('#open-inbox').addEventListener('click', () => openMessage(MEMBERS[0]));
  $('#message-maya').addEventListener('click', () => openMessage(MEMBERS[0]));
  $('#show-nearby').addEventListener('click', () => { document.querySelector('.neighbourhood-card').scrollIntoView({ behavior:'smooth', block:'center' }); toast('You have 38 neighbours within 5 km.'); });
  $('#skill-search').addEventListener('input', renderCards); $('#distance-filter').addEventListener('change', renderCards);
  $$('#category-buttons button');
  document.querySelectorAll('#category-buttons button').forEach(button => button.addEventListener('click', () => { document.querySelector('.category.active').classList.remove('active'); button.classList.add('active'); renderCards(); }));
  $('#swap-form').addEventListener('submit', event => { event.preventDefault(); const offer = $('#offer-skill').value.trim(); const request = $('#request-skill').value.trim(); state.swaps.unshift({ offer, request, note: $('#swap-note').value.trim(), time: $('#swap-time').value, format: $('#swap-format').value, createdAt: Date.now() }); saveState(); closeModal('#swap-modal'); event.target.reset(); $('#swap-count').textContent = 3 + state.swaps.length; toast(`Your ${offer} swap is now live — we’ll help it find its person.`); });
  $('#profile-form').addEventListener('submit', event => { event.preventDefault(); state.profile.name = $('#profile-name').value.trim(); state.profile.location = $('#profile-location').value.trim(); state.profile.teaches = $('#profile-teaches').value.trim(); saveState(); updateProfileUI(); closeModal('#profile-modal'); toast('Your profile is looking lovely. Saved locally.'); });
  $('#avatar-upload').addEventListener('change', event => { const [file] = event.target.files; if (!file) return; if (file.size > 1.8 * 1024 * 1024) { toast('Please choose an image under 1.8 MB.'); event.target.value = ''; return; } const reader = new FileReader(); reader.onload = () => { state.profile.avatar = reader.result; saveState(); updateProfileUI(); }; reader.readAsDataURL(file); });
  $('#message-form').addEventListener('submit', event => { event.preventDefault(); const text = $('#message-text').value.trim(); if (!text) return; const messages = state.messages[activeMember.id] || []; messages.push({ mine: true, text }); state.messages[activeMember.id] = messages; saveState(); $('#message-text').value = ''; openMessage(activeMember); renderMessages(); toast(`Message sent to ${activeMember.name.split(' ')[0]}.`); });
  $('#reset-demo').addEventListener('click', () => { if (!confirm('Reset your local profile, swaps, messages, and uploaded photo?')) return; localStorage.removeItem('skillSwapNearbyState'); location.reload(); });
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
});

// Small helper intentionally kept out of the global API. It checks an optional selector without throwing.
function $$(selector) { return document.querySelector(selector); }
