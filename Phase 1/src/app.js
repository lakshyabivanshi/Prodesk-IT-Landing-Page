const form = document.getElementById('coverLetterForm');
const outputContainer = document.getElementById('outputContainer');
const outputBox = document.getElementById('Outputbox');
const copyBtn = document.getElementById('copyBtn');

let globalGeneratedText = "";

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const company = document.getElementById('company').value;
    const skills = document.getElementById('skills').value;

    globalGeneratedText = `Dear Hiring Manager at ${company},
I am writing to express my strong interest in the ${role} position at your esteemed company. My name is ${name}, and I am confident that my background matches the requirements for this role.
Over the course of my career, I have developed key competencies in ${skills}, which align perfectly with the challenges of this position. I am eager to bring my dedication and skills to ${company}.
Thank you for your time and consideration. I look forward to the possibility of discussing how my background fits your needs.
    
Sincerely,
${name}`;

    outputBox.textContent = globalGeneratedText;
    outputContainer.classList.remove('hidden');

    copyBtn.textContent = "Copy to Clipboard";
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