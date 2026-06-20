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

//Event Listeners
searchBtn.addEventListener('click', handleSearch);

//Seach Input Box
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

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