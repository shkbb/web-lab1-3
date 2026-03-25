"use strict";


const DOM = {
    tabs:              document.getElementById('tabs'),
    sections: {
        personal:   document.getElementById('sectionPersonal'),
        experience: document.getElementById('sectionExperience'),
        education:  document.getElementById('sectionEducation'),
        skills:     document.getElementById('sectionSkills'),
    },
    experienceEntries: document.getElementById('experienceEntries'),
    educationEntries:  document.getElementById('educationEntries'),
    resumePreview:     document.getElementById('resumePreview'),
    previewPlaceholder: document.getElementById('previewPlaceholder'),
    toastContainer:    document.getElementById('toastContainer'),

    btnGenerate:  document.getElementById('btnGenerate'),
    btnSave:      document.getElementById('btnSave'),
    btnLoad:      document.getElementById('btnLoad'),
    btnClear:     document.getElementById('btnClear'),
    btnPrint:     document.getElementById('btnPrint'),
    btnAddExp:    document.getElementById('btnAddExperience'),
    btnAddEdu:    document.getElementById('btnAddEducation'),
};

let currentResume = new Resume();
window.__resume = currentResume;

let expCounter = 0;
let eduCounter = 0;



function switchTab(tabName) {

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));


    const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    const section = DOM.sections[tabName];
    if (tab) tab.classList.add('active');
    if (section) section.classList.add('active');
}

DOM.tabs.addEventListener('click', function (e) {
    const tab = e.target.closest('.tab');
    if (tab) {
        switchTab(tab.dataset.tab);
    }
});


function createExperienceEntry() {
    expCounter++;
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.entryId = `exp-${expCounter}`;

    card.innerHTML = `
        <div class="entry-header">
            <span class="entry-number">Досвід #${expCounter}</span>
            <button type="button" class="btn-remove-entry" title="Видалити">✕</button>
        </div>
        <div class="form-group">
            <label>Компанія <span class="req">*</span></label>
            <input type="text" name="company" placeholder="Google, Epam…">
            <span class="error-msg"></span>
        </div>
        <div class="form-group">
            <label>Посада <span class="req">*</span></label>
            <input type="text" name="position" placeholder="Frontend Developer">
            <span class="error-msg"></span>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Початок <span class="req">*</span></label>
                <input type="text" name="startDate" placeholder="01.2020">
                <span class="error-msg"></span>
            </div>
            <div class="form-group">
                <label>Кінець</label>
                <input type="text" name="endDate" placeholder="12.2023 або залиште порожнім">
                <span class="error-msg"></span>
            </div>
        </div>
        <div class="form-group">
            <label>Опис</label>
            <textarea name="description" rows="2" placeholder="Коротко опишіть основні обов'язки…"></textarea>
            <span class="error-msg"></span>
        </div>
    `;


    card.querySelector('.btn-remove-entry').addEventListener('click', function () {
        card.style.animation = 'fadeIn 0.2s ease reverse';
        setTimeout(() => card.remove(), 200);
    });

    return card;
}

DOM.btnAddExp.addEventListener('click', function () {
    DOM.experienceEntries.appendChild(createExperienceEntry());
});


function createEducationEntry() {
    eduCounter++;
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.entryId = `edu-${eduCounter}`;

    card.innerHTML = `
        <div class="entry-header">
            <span class="entry-number">Освіта #${eduCounter}</span>
            <button type="button" class="btn-remove-entry" title="Видалити">✕</button>
        </div>
        <div class="form-group">
            <label>Навчальний заклад <span class="req">*</span></label>
            <input type="text" name="institution" placeholder="КПІ, ЛНУ…">
            <span class="error-msg"></span>
        </div>
        <div class="form-group">
            <label>Спеціальність / ступінь <span class="req">*</span></label>
            <input type="text" name="degree" placeholder="Бакалавр комп'ютерних наук">
            <span class="error-msg"></span>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Рік початку <span class="req">*</span></label>
                <input type="text" name="startYear" placeholder="2018" inputmode="numeric">
                <span class="error-msg"></span>
            </div>
            <div class="form-group">
                <label>Рік закінчення</label>
                <input type="text" name="endYear" placeholder="2022 або залиште порожнім" inputmode="numeric">
                <span class="error-msg"></span>
            </div>
        </div>
    `;

    card.querySelector('.btn-remove-entry').addEventListener('click', function () {
        card.style.animation = 'fadeIn 0.2s ease reverse';
        setTimeout(() => card.remove(), 200);
    });

    return card;
}

DOM.btnAddEdu.addEventListener('click', function () {
    DOM.educationEntries.appendChild(createEducationEntry());
});

function collectPersonalData() {
    return {
        fullName: document.getElementById('fullName').value,
        email:    document.getElementById('email').value,
        phone:    document.getElementById('phone').value,
        age:      document.getElementById('age').value,
        address:  document.getElementById('address').value,
        summary:  document.getElementById('summary').value,
    };
}


function collectExperienceData() {
    const entries = [];
    DOM.experienceEntries.querySelectorAll('.entry-card').forEach(card => {
        entries.push({
            company:     card.querySelector('[name="company"]').value,
            position:    card.querySelector('[name="position"]').value,
            startDate:   card.querySelector('[name="startDate"]').value,
            endDate:     card.querySelector('[name="endDate"]').value,
            description: card.querySelector('[name="description"]').value,
        });
    });
    return entries;
}


function collectEducationData() {
    const entries = [];
    DOM.educationEntries.querySelectorAll('.entry-card').forEach(card => {
        entries.push({
            institution: card.querySelector('[name="institution"]').value,
            degree:      card.querySelector('[name="degree"]').value,
            startYear:   card.querySelector('[name="startYear"]').value,
            endYear:     card.querySelector('[name="endYear"]').value,
        });
    });
    return entries;
}

function collectSkillsData() {
    return {
        skills: document.getElementById('skillsInput').value,
    };
}


function showFieldError(input, message) {
    input.classList.add('invalid');
    const errSpan = input.parentElement.querySelector('.error-msg');
    if (errSpan) errSpan.textContent = message;
}


function clearFieldError(input) {
    input.classList.remove('invalid');
    const errSpan = input.parentElement.querySelector('.error-msg');
    if (errSpan) errSpan.textContent = '';
}


function clearAllErrors() {
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}


function validateAll() {
    clearAllErrors();
    let allValid = true;
    let firstInvalidTab = null;


    const personalData = collectPersonalData();
    const personalResult = validateFields(personalData, personalValidators);
    if (!personalResult.valid) {
        allValid = false;
        if (!firstInvalidTab) firstInvalidTab = 'personal';
        for (const [field, msg] of Object.entries(personalResult.errors)) {
            const input = document.getElementById(field);
            if (input) showFieldError(input, msg);
        }
    }


    DOM.experienceEntries.querySelectorAll('.entry-card').forEach(card => {
        const data = {
            company:   card.querySelector('[name="company"]').value,
            position:  card.querySelector('[name="position"]').value,
            startDate: card.querySelector('[name="startDate"]').value,
            endDate:   card.querySelector('[name="endDate"]').value,
            description: card.querySelector('[name="description"]').value,
        };
        const result = validateFields(data, experienceValidators);
        if (!result.valid) {
            allValid = false;
            if (!firstInvalidTab) firstInvalidTab = 'experience';
            for (const [field, msg] of Object.entries(result.errors)) {
                const input = card.querySelector(`[name="${field}"]`);
                if (input) showFieldError(input, msg);
            }
        }
    });

    DOM.educationEntries.querySelectorAll('.entry-card').forEach(card => {
        const data = {
            institution: card.querySelector('[name="institution"]').value,
            degree:      card.querySelector('[name="degree"]').value,
            startYear:   card.querySelector('[name="startYear"]').value,
            endYear:     card.querySelector('[name="endYear"]').value,
        };
        const result = validateFields(data, educationValidators);
        if (!result.valid) {
            allValid = false;
            if (!firstInvalidTab) firstInvalidTab = 'education';
            for (const [field, msg] of Object.entries(result.errors)) {
                const input = card.querySelector(`[name="${field}"]`);
                if (input) showFieldError(input, msg);
            }
        }
    });


    const skillsData = collectSkillsData();
    const skillsResult = validateFields(skillsData, skillsValidators);
    if (!skillsResult.valid) {
        allValid = false;
        if (!firstInvalidTab) firstInvalidTab = 'skills';
        for (const [field, msg] of Object.entries(skillsResult.errors)) {
            const input = document.getElementById('skillsInput');
            if (input) showFieldError(input, msg);
        }
    }


    if (firstInvalidTab) {
        switchTab(firstInvalidTab);
    }

    return allValid;
}


function generateResume() {
    console.log('[app.js] Генерація резюме...');

    if (!validateAll()) {
        showToast('Будь ласка, виправте помилки у формі', 'error');
        return;
    }

    currentResume = new Resume();
    window.__resume = currentResume;


    currentResume.setPersonalInfo(collectPersonalData());


    currentResume.clearExperience();
    collectExperienceData().forEach(data => currentResume.addExperience(data));

    currentResume.clearEducation();
    collectEducationData().forEach(data => currentResume.addEducation(data));


    currentResume.setSkills(collectSkillsData());


    if (DOM.previewPlaceholder) {
        DOM.previewPlaceholder.style.display = 'none';
    }
    currentResume.render(DOM.resumePreview);

    attachEditButtons();

    showToast('Резюме успішно створено!', 'success');
    console.log('[app.js] Резюме створено:', currentResume.toJSON());

    const info = currentResume.personalInfo;
    if (info) {
        console.log(`[app.js] Тип age: ${typeof info.age}, значення: ${info.age}`);
        alert(`Резюме створено! Вік (тип: ${typeof info.age}): ${info.age}`);
    }
}

DOM.btnGenerate.addEventListener('click', generateResume);


function attachEditButtons() {
    DOM.resumePreview.querySelectorAll('.btn-edit-section').forEach(btn => {
        btn.addEventListener('click', function () {
            const section = btn.dataset.edit;
            switchTab(section);

            const formSection = DOM.sections[section];
            if (formSection) {
                formSection.classList.add('highlight-section');
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => formSection.classList.remove('highlight-section'), 1500);
            }
        });
    });
}


const STORAGE_KEY = 'resume_constructor_data';

function saveToLocalStorage() {
    const data = {
        personal:   collectPersonalData(),
        experience: collectExperienceData(),
        education:  collectEducationData(),
        skills:     collectSkillsData(),
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showToast('Дані збережено у localStorage', 'success');
        console.log('[app.js] Дані збережено:', data);
    } catch (e) {
        showToast('Помилка збереження: ' + e.message, 'error');
        console.error('[app.js] Помилка збереження:', e);
    }
}


function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            showToast('Збережених даних не знайдено', 'info');
            return;
        }

        const data = JSON.parse(raw);
        console.log('[app.js] Завантажені дані:', data);


        if (data.personal) {
            document.getElementById('fullName').value = data.personal.fullName || '';
            document.getElementById('email').value    = data.personal.email || '';
            document.getElementById('phone').value    = data.personal.phone || '';
            document.getElementById('age').value      = data.personal.age || '';
            document.getElementById('address').value  = data.personal.address || '';
            document.getElementById('summary').value  = data.personal.summary || '';
        }

        DOM.experienceEntries.innerHTML = '';
        expCounter = 0;
        if (Array.isArray(data.experience)) {
            data.experience.forEach(exp => {
                const card = createExperienceEntry();
                card.querySelector('[name="company"]').value     = exp.company || '';
                card.querySelector('[name="position"]').value    = exp.position || '';
                card.querySelector('[name="startDate"]').value   = exp.startDate || '';
                card.querySelector('[name="endDate"]').value     = exp.endDate || '';
                card.querySelector('[name="description"]').value = exp.description || '';
                DOM.experienceEntries.appendChild(card);
            });
        }

        DOM.educationEntries.innerHTML = '';
        eduCounter = 0;
        if (Array.isArray(data.education)) {
            data.education.forEach(edu => {
                const card = createEducationEntry();
                card.querySelector('[name="institution"]').value = edu.institution || '';
                card.querySelector('[name="degree"]').value      = edu.degree || '';
                card.querySelector('[name="startYear"]').value   = edu.startYear || '';
                card.querySelector('[name="endYear"]').value     = edu.endYear || '';
                DOM.educationEntries.appendChild(card);
            });
        }

    
        if (data.skills) {
            document.getElementById('skillsInput').value = data.skills.skills || '';
        }

        showToast('Дані успішно завантажено!', 'success');
    } catch (e) {
        showToast('Помилка завантаження: ' + e.message, 'error');
        console.error('[app.js] Помилка завантаження:', e);
    }
}

function clearAll() {
    if (!confirm('Ви впевнені, що хочете очистити всі дані?')) return;


    document.getElementById('fullName').value = '';
    document.getElementById('email').value    = '';
    document.getElementById('phone').value    = '';
    document.getElementById('age').value      = '';
    document.getElementById('address').value  = '';
    document.getElementById('summary').value  = '';

    DOM.experienceEntries.innerHTML = '';
    DOM.educationEntries.innerHTML  = '';
    expCounter = 0;
    eduCounter = 0;

    document.getElementById('skillsInput').value = '';


    DOM.resumePreview.innerHTML = '';
    if (DOM.previewPlaceholder) {
        DOM.resumePreview.appendChild(DOM.previewPlaceholder);
        DOM.previewPlaceholder.style.display = '';
    }


    clearAllErrors();

    localStorage.removeItem(STORAGE_KEY);

    currentResume = new Resume();
    window.__resume = currentResume;

    switchTab('personal');
    showToast('Усі дані очищено', 'info');
    console.log('[app.js] Усі дані очищено');
}

DOM.btnSave.addEventListener('click', saveToLocalStorage);
DOM.btnLoad.addEventListener('click', loadFromLocalStorage);
DOM.btnClear.addEventListener('click', clearAll);


DOM.btnPrint.addEventListener('click', function () {
    window.print();
});


function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}


(function init() {
    DOM.experienceEntries.appendChild(createExperienceEntry());
    DOM.educationEntries.appendChild(createEducationEntry());

    console.log('[app.js] Застосунок ініціалізовано. Використовуйте window.__resume для доступу до об\'єкта Resume.');
    console.log('[app.js] Доступні класи: PersonalInfo, Experience, Education, Skills, Resume');
})();
