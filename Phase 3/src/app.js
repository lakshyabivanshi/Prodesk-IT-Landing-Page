const form = document.getElementById('coverLetterForm');
const outputContainer = document.getElementById('outputContainer');
const outputBox = document.getElementById('Outputbox');
const copyBtn = document.getElementById('copyBtn');
const loadingState = document.getElementById('loadingState');
const submitBtn = document.getElementById('submitBtn');

let globalGeneratedText = "";

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const company = document.getElementById('company').value;
    const skills = document.getElementById('skills').value;

    const resumeFile = document.getElementById('resume').files[0];

    submitBtn.disabled = true;
    submitBtn.textContent = "Generating with AI";
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed')

    loadingState.classList.remove('hidden');
    outputContainer.classList.add('hidden');
    outputBox.textContent = "";


    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('role', role);
        formData.append('company', company);
        formData.append('skills', skills);

        if(resumeFile){
            formData.append('resume', resumeFile);
        }

        const response = await fetch('http://localhost:5000/api/generate', {
            method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.text) {
            globalGeneratedText = data.text;
            outputBox.innerHTML = marked.parse(globalGeneratedText);
            outputContainer.classList.remove('hidden');
            copyBtn.textContent = "Copy to Clipboard"
        }
        else {
            alert("Error: " + (data.error || "Failed to generate cover letter."));
        }
    } catch (err) {
        console.error("Frontend Fetch Error: ", err);
        alert("Could not connect to the API server.")
    } finally {
        loadingState.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = "Generate Cover Letter";
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
});

copyBtn.addEventListener('click', function () {
    if (!globalGeneratedText) return;

    navigator.clipboard.writeText(globalGeneratedText).then(() => {
        copyBtn.textContent = "✔ Copied!";

        setTimeout(() => {
            copyBtn.textContent = "Copy to Clipboard"
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});