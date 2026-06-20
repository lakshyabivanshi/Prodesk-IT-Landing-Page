//DOM Selector
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const errorMsg = document.getElementById('error-msg');
const loader = document.getElementById('loader');
const profileCard = document.getElementById('profile-card');

//Element Inside A Profile Card
const avatar = document.getElementById('avatar');
const userName = document.getElementById('user-name');
const userUsername = document.getElementById('user-username');
const userUsernameLink = document.getElementById('user-username-link');
const userJoined = document.getElementById('user-joined');
const userBio = document.getElementById('user-bio');
const userURL = document.getElementById('user-url');
const reposContainer = document.getElementById('repos_container');
const reposList = document.getElementById('repos_list');

const modeToggleBtn = document.getElementById('mode-toggle-btn');
const singleSearchBox = document.getElementById('single-search-box');
const battleSearchBox = document.getElementById('battle-search-box');
const battleInput1 = document.getElementById('battle-input-1');
const battleInput2 = document.getElementById('battle-input-2');
const battleBtn = document.getElementById('battle-btn');
const battleErrorMsg = document.getElementById('battle-error-msg');
const battleModeOutput = document.getElementById('battle-mode-output');

let isBattleMode = false;

//Event Listeners
searchBtn.addEventListener('click', handleSearch);

//Seach Input Box
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

//Event Listener For Battle Mode
modeToggleBtn.addEventListener('click', toggleBattleModeLayout);
battleBtn.addEventListener('click', handleBattle);

function toggleBattleModeLayout() {
    isBattleMode = !isBattleMode;

    errorMsg.classList.add('hidden');
    battleErrorMsg.classList.add('hidden');
    profileCard.classList.add('hidden');
    reposContainer.classList.add('hidden');
    battleModeOutput.classList.add('hidden');

    if (isBattleMode) {
        modeToggleBtn.textContent = "Exit Battle Mode";
        modeToggleBtn.classList.replace('text-amber-400', 'text-sky-400');
        modeToggleBtn.classList.replace('bg-amber-500/10', 'bg-sky-500/10');
        modeToggleBtn.classList.replace('border-amber-500/20', 'border-sky-500/20');
        modeToggleBtn.classList.replace('hover:bg-amber-500/20', 'hover:bg-sky-500/20');
        singleSearchBox.classList.add('hidden');
        battleSearchBox.classList.remove('hidden');
    }
    else {
        modeToggleBtn.textContent = "Enter Battle Mode";
        modeToggleBtn.classList.replace('text-sky-400', 'text-amber-400');
        modeToggleBtn.classList.replace('bg-sky-500/10', 'bg-amber-500/10');
        modeToggleBtn.classList.replace('border-sky-500/20', 'border-amber-500/20')

        singleSearchBox.classList.remove('hidden');
        battleSearchBox.classList.add('hidden');
    }
}

async function handleSearch() {
    const username = searchInput.value.trim();
    if (!username) {
        return;
    }
    errorMsg.classList.add('hidden');
    profileCard.classList.add('hidden');
    reposContainer.classList.add('hidden');
    toggleLoading(true);

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            }
            throw new Error('Something went wrong')
        }
        const data = await response.json();
        renderProfile(data);

        if (data.repos_url) {
            const reposResponse = await fetch(data.repos_url);
            if (reposResponse.ok) {
                const reposData = await reposResponse.json();
                renderRepository(reposData);
            }
        }
    } catch (error) {
        console.error("API Error: ", error.message);
        errorMsg.classList.remove('hidden');
    } finally {
        toggleLoading(false);
    }
}

async function handleBattle() {
    const user1 = battleInput1.value.trim();
    const user2 = battleInput2.value.trim();

    if (!user1 || !user2) return;
    battleErrorMsg.classList.add('hidden');
    battleModeOutput.classList.add('hidden');
    toggleLoading(true);

    try {
        const [res1, res2] = await Promise.all([fetch(`https://api.github.com/users/${user1}`), fetch(`https://api.github.com/users/${user2}`)]);

        if (!res1.ok || !res2.ok) {
            throw new Error('One or both users not found');
        }
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        const [reposRes1, reposRes2] = await Promise.all([fetch(data1.repos_url), fetch(data2.repos_url)]);

        if (!reposRes1.ok || !reposRes2.ok) {
            throw new Error('Could not retrieve repositories');
        }
        const [repos1, repos2] = await Promise.all([reposRes1.json(), reposRes2.json()]);
        const stars1 = repos1.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const stars2 = repos2.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        renderBattleResults(data1, stars1, repos1, data2, stars2, repos2);
    } catch (error) {
        console.error("Battle error : ", error.message);
        battleErrorMsg.classList.remove('hidden');
    } finally {
        toggleLoading(false);
    }
}

function renderBattleResults(u1, stars1, repos1, u2, stars2, repos2) {
    battleModeOutput.innerHTML = "";
    const isTie = stars1 === stars2;
    const u1Winner = stars1 > stars2;

    const card1HTML = createBattleCardMarkup(u1, stars1, repos1, isTie ? 'tie' : (u1Winner ? 'winner' : 'loser'));
    const card2HTML = createBattleCardMarkup(u2, stars2, repos2 ,isTie ? 'tie' : (!u1Winner ? 'winner' : 'loser'));

    battleModeOutput.innerHTML = card1HTML + card2HTML;
    battleModeOutput.classList.remove('hidden');
}

function createBattleCardMarkup(user, totalStars, repos, status) {
    let statusBadge = '';
    let statusClass = '';

    if (status === 'winner') {
        statusBadge = `<span class="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 font-bold uppercase tracking-wider">Winner!</span>`;
        statusClass = 'border-green-500/40'
    }
    else if (status === 'loser') {
        statusBadge = `<span class="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/30 font-bold uppercase tracking-wider">Loser!</span>`;
        statusClass = 'border-red-500/40'
    }
    else {
        statusBadge = `<span class="bg-slate-500/20 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-500/30 font-bold uppercase tracking-wider">Tie!</span>`;
        statusClass = 'border-white/10';
    }

    const topFive = repos.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0,5);
    const reposHTML = topFive.map(repo => `<a href="${repo.html_url}" target="_blank" class="flex justify-between items-center text-xs text-slate-300 hover:text-[#00f2fe] bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-2.5 transition-all duration-200 group/item">
        <span class="truncate pr-2">${repo.name}</span>
        <span class="text-slate-500 group-hover/item:text-[#4facfe] text-[10px]">↗</span></a>`).join('');
    return `<div class="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border ${statusClass} flex flex-col items-center gap-5 transition-all duration-300">
    <div class="flex justify-between items-center w-full">${statusBadge}
    <span class="text-xs text-slate-400">${formatDate(user.created_at)}</span>
    </div>
    <img src="${user.avatar_url || 'https://githubassets.com/images/modules/logo_page/Github-Mark.png'}" class="w-20 h-20 rounded-full border-2 border-white/10 shadow-lg"/>
    <div class="text-center">
    <h3 class="text-xl font-bold text-white">${user.name || user.login}</h3>
    <a href="${user.html_url}" target="_blank" class="text-xs text-sky-400 hover:underline">@${user.login}</a></div>
    <div class="w-full bg-slate-900/50 rounded-2xl p-4 text-center border border-white/5">
    <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Stars</p>
    <p class="text-3xl font-black mt-1 text-amber-400">${totalStars}</p>
    </div>

    <div class="w-full flex flex-col gap-2 mt-1">
    <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold px-1 text-left">Top Repositories</p>
    <div class="flex flex-col gap-1.5 w-full">${reposHTML || '<p class="text-xs text-slate-500 italic">No public repos</p>'}</div>
    </div>
    </div>`;
}

//Loader Toggle
function toggleLoading(isLoading) {
    if (isLoading) {
        loader.classList.remove('hidden');
        profileCard.classList.add('opacity-40', 'pointer-events-none');
    }
    else {
        loader.classList.add('hidden');
        profileCard.classList.remove('opacity-40', 'pointer-events-none');
    }
}

//Helper - Github ISO Date
function formatDate(isoString) {
    if (!isoString) return "Joined N/A";
    const date = new Date(isoString);
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `Joined ${day} ${month} ${year}`;
}

//Data Rendering
function renderProfile(user) {
    profileCard.classList.remove('hidden');

    avatar.src = user.avatar_url || "https://githubassets.com/images/modules/logos_page/Github-Mark.png";

    userName.textContent = user.name || user.login;  //Name & Username
    userUsername.textContent = `@${user.login}`;
    userUsernameLink.href = user.html_url;

    userJoined.textContent = formatDate(user.created_at); //join date

    if (user.bio) {
        userBio.textContent = user.bio;
        userBio.classList.remove('opacity-50', 'italic');
    }
    else {
        userBio.textContent = "This profile has no bio.";
        userBio.classList.add('opacity-50', 'italic');
    }

    if (user.blog) {
        const cleanUrl = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;

        userURL.textContent = user.blog;
        userURL.href = cleanUrl;

        userURL.parentElement.classList.remove('hidden');
    }
    else {
        userURL.parentElement.classList.add('hidden');
    }
}

function renderRepository(repos) {
    reposList.innerHTML = "";
    if (!repos || repos.length === 0) {
        reposContainer.classList.add('hidden');
        return;
    }
    const Topfive = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 5);

    Topfive.forEach(repos => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center text-slate-300 hover:text-[#00f2fe] hover:bg-white/10 border border-white/5 rounded-xl p-5 text-sm font-medium transition-allduration-200 cursor-pointer active:scale-[0.99] group/item";

        li.innerHTML = `<span>${repos.name}</span>
        <span class="text-xs text-slate-500 group-hover/item:text-[#4facfe] transition-colors duration-200">↗</span>`;

        li.addEventListener('click', () => {
            window.open(repos.html_url, '_blank');
        });
        reposList.appendChild(li);
    });
    reposContainer.classList.remove('hidden');
}