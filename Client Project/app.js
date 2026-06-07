let state = {
  user: localStorage.getItem('habit_tracker_user') || '',
  habits: JSON.parse(localStorage.getItem('habit_tracker_items')) || []
};

const DOM = {
  nameScreen: document.getElementById('name-screen'),
  mainScreen: document.getElementById('main-screen'),
  nameInput: document.getElementById('name-input'),
  nameSubmitBtn: document.getElementById('name-submit-btn'),
  greeting: document.getElementById('greeting'),
  habitInput: document.getElementById('habit-input'),
  addHabitBtn: document.getElementById('add-habit-btn'),
  habitList: document.getElementById('habit-list'),
  habitCount: document.getElementById('habit-count'),
  habitsSection: document.getElementById('habits-section'),
  emptyState: document.getElementById('empty-state')
};

function init() {
  DOM.nameSubmitBtn.addEventListener('click', handleUserRegistration);
  DOM.nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserRegistration(); });
  DOM.addHabitBtn.addEventListener('click', handleAddHabit);
  DOM.habitInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAddHabit(); });

  if (state.user) { showMainScreen(); } else { showNameScreen(); }
}

function showNameScreen() {
  DOM.mainScreen.classList.add('hidden');
  DOM.nameScreen.classList.remove('hidden');
  DOM.nameInput.focus();
}

function showMainScreen() {
  DOM.nameScreen.classList.add('hidden');
  DOM.mainScreen.classList.remove('hidden');
  DOM.greeting.textContent = `Hey ${state.user}! 👋`;
  renderHabits();
}

function handleUserRegistration() {
  const nameValue = DOM.nameInput.value.trim();
  if (!nameValue) return;
  state.user = nameValue;
  localStorage.setItem('habit_tracker_user', nameValue);
  showMainScreen();
}

function handleAddHabit() {
  const text = DOM.habitInput.value.trim();
  if (!text) return;

  state.habits.push({ id: Date.now().toString(), text, streak: 0 });
  syncStorage();
  renderHabits();
  DOM.habitInput.value = '';
}

function incrementStreak(id) {
  state.habits = state.habits.map(h => h.id === id ? { ...h, streak: h.streak + 1 } : h);
  syncStorage();
  renderHabits();
}

function deleteHabit(id) {
  state.habits = state.habits.filter(h => h.id !== id);
  syncStorage();
  renderHabits();
}

function syncStorage() {
  localStorage.setItem('habit_tracker_items', JSON.stringify(state.habits));
}

function renderHabits() {
  DOM.habitList.innerHTML = '';
  const total = state.habits.length;

  if (total === 0) {
    DOM.habitsSection.classList.add('hidden');
    DOM.habitCount.classList.add('hidden');
    DOM.emptyState.classList.remove('hidden');
  } else {
    DOM.emptyState.classList.add('hidden');
    DOM.habitsSection.classList.remove('hidden');
    DOM.habitCount.classList.remove('hidden');
    DOM.habitCount.textContent = `${total} habit${total > 1 ? 's' : ''}`;
  }

  state.habits.forEach(habit => {
    const li = document.createElement('li');
    li.className = 'habit-item animate-pop';

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.flex = '1';

    // Habit text aligned straight to the left container border
    const span = document.createElement('span');
    span.className = 'habit-text';
    span.textContent = habit.text;
    left.appendChild(span);

    const right = document.createElement('div');
    right.className = 'item-controls';

    // Streak Pill
    const pill = document.createElement('div');
    pill.className = 'streak-pill';
    pill.innerHTML = `🔥 ${habit.streak}`;
    right.appendChild(pill);

    // Plus Counter Action Button
    const plusBtn = document.createElement('button');
    plusBtn.className = 'plus-count-btn';
    plusBtn.innerHTML = '＋';
    plusBtn.addEventListener('click', () => incrementStreak(habit.id));
    right.appendChild(plusBtn);

    // Delete Button
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.innerHTML = '<i class="fa-solid fa-trash" style="color: rgb(255, 255, 255)"></i>';
    del.addEventListener('click', () => deleteHabit(habit.id));
    right.appendChild(del);

    li.appendChild(left);
    li.appendChild(right);
    DOM.habitList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', init);