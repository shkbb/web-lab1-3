/**
 * models.js — OOP-модуль (ES6 класи) для структури резюме
 * 
 * Ієрархія класів:
 *   ResumeSection (базовий)
 *     ├── PersonalInfo
 *     ├── Experience
 *     ├── Education
 *     └── Skills
 *   Resume — головний клас, що об'єднує всі секції
 * 
 * Використовуються: наслідування, геттери/сеттери, інкапсуляція,
 * методи toHTML() та toJSON() / fromJSON().
 * 
 * "use strict" — суворий режим.
 */
"use strict";

// ============================================================
//  ResumeSection — абстрактний базовий клас
// ============================================================

class ResumeSection {
    /**
     * @param {string} type — тип секції ('personal', 'experience', ...)
     */
    constructor(type) {
        if (new.target === ResumeSection) {
            throw new Error('ResumeSection є абстрактним класом, його не можна створювати напряму');
        }
        this._type = type;
    }

    /** Геттер для типу секції */
    get type() {
        return this._type;
    }

    /**
     * toHTML — генерує HTML-рядок для секції.
     * Має бути перевизначений у дочірніх класах.
     */
    toHTML() {
        throw new Error('Метод toHTML() має бути реалізований у дочірньому класі');
    }

    /**
     * toJSON — серіалізація для localStorage.
     */
    toJSON() {
        throw new Error('Метод toJSON() має бути реалізований у дочірньому класі');
    }
}

// ============================================================
//  PersonalInfo — клас для збереження особистих даних
// ============================================================

class PersonalInfo extends ResumeSection {
    /**
     * @param {Object} data — { fullName, email, phone, age, address, summary }
     */
    constructor(data = {}) {
        super('personal');
        this._fullName = data.fullName || '';
        this._email    = data.email || '';
        this._phone    = data.phone || '';
        // Перетворення віку у число (type conversion)
        this._age      = Number(data.age) || 0;
        this._address  = data.address || '';
        this._summary  = data.summary || '';
    }

    // —— Геттери та сеттери для інкапсуляції ——

    get fullName()       { return this._fullName; }
    set fullName(value)  { this._fullName = String(value).trim(); }

    get email()          { return this._email; }
    set email(value)     { this._email = String(value).trim(); }

    get phone()          { return this._phone; }
    set phone(value)     { this._phone = String(value).trim(); }

    /** Сеттер age — автоматичне перетворення рядка у число */
    get age()            { return this._age; }
    set age(value) {
        const num = Number(value);
        if (Number.isNaN(num) || num <= 0) {
            console.warn(`[PersonalInfo] Невалідне значення віку: "${value}"`);
            this._age = 0;
        } else {
            this._age = Math.floor(num);
        }
    }

    get address()        { return this._address; }
    set address(value)   { this._address = String(value).trim(); }

    get summary()        { return this._summary; }
    set summary(value)   { this._summary = String(value).trim(); }

    /**
     * toHTML — створює HTML-розмітку для блоку особистих даних.
     * @returns {string}
     */
    toHTML() {
        const contacts = [];
        if (this._email)   contacts.push(`<span>📧 ${this._email}</span>`);
        if (this._phone)   contacts.push(`<span>📱 ${this._phone}</span>`);
        if (this._age)     contacts.push(`<span>🎂 ${this._age} р.</span>`);
        if (this._address) contacts.push(`<span>📍 ${this._address}</span>`);

        let html = `
            <div class="resume-head">
                <h2>${this._escapeHTML(this._fullName)}</h2>
                <div class="resume-contacts">${contacts.join('')}</div>
                ${this._summary ? `<p class="resume-summary">${this._escapeHTML(this._summary)}</p>` : ''}
            </div>`;
        return html;
    }

    toJSON() {
        return {
            type: this._type,
            fullName: this._fullName,
            email: this._email,
            phone: this._phone,
            age: this._age,
            address: this._address,
            summary: this._summary,
        };
    }

    /**
     * _escapeHTML — захист від XSS (приватний метод).
     */
    _escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// ============================================================
//  Experience — клас для досвіду роботи
// ============================================================

class Experience extends ResumeSection {
    /**
     * @param {Object} data — { company, position, startDate, endDate, description }
     */
    constructor(data = {}) {
        super('experience');
        this._company     = data.company || '';
        this._position    = data.position || '';
        this._startDate   = data.startDate || '';
        this._endDate     = data.endDate || '';
        this._description = data.description || '';
    }

    get company()          { return this._company; }
    set company(value)     { this._company = String(value).trim(); }

    get position()         { return this._position; }
    set position(value)    { this._position = String(value).trim(); }

    get startDate()        { return this._startDate; }
    set startDate(value)   { this._startDate = String(value).trim(); }

    get endDate()          { return this._endDate; }
    set endDate(value)     { this._endDate = String(value).trim(); }

    get description()      { return this._description; }
    set description(value) { this._description = String(value).trim(); }

    /** Форматований період роботи */
    get period() {
        if (this._startDate && this._endDate) {
            return `${this._startDate} — ${this._endDate}`;
        }
        if (this._startDate) {
            return `${this._startDate} — дотепер`;
        }
        return '';
    }

    toHTML() {
        return `
            <div class="resume-item">
                <h4>${this._escapeHTML(this._position)}</h4>
                <div class="item-subtitle">${this._escapeHTML(this._company)}</div>
                ${this.period ? `<div class="item-period">${this._escapeHTML(this.period)}</div>` : ''}
                ${this._description ? `<div class="item-desc">${this._escapeHTML(this._description)}</div>` : ''}
            </div>`;
    }

    toJSON() {
        return {
            type: this._type,
            company: this._company,
            position: this._position,
            startDate: this._startDate,
            endDate: this._endDate,
            description: this._description,
        };
    }

    _escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// ============================================================
//  Education — клас для освіти
// ============================================================

class Education extends ResumeSection {
    /**
     * @param {Object} data — { institution, degree, startYear, endYear }
     */
    constructor(data = {}) {
        super('education');
        this._institution = data.institution || '';
        this._degree      = data.degree || '';
        // Перетворення у числа
        this._startYear   = Number(data.startYear) || 0;
        this._endYear     = Number(data.endYear) || 0;
    }

    get institution()       { return this._institution; }
    set institution(value)  { this._institution = String(value).trim(); }

    get degree()            { return this._degree; }
    set degree(value)       { this._degree = String(value).trim(); }

    /** Сеттер startYear — перетворення у число */
    get startYear()         { return this._startYear; }
    set startYear(value) {
        this._startYear = Number(value) || 0;
    }

    /** Сеттер endYear — перетворення у число */
    get endYear()           { return this._endYear; }
    set endYear(value) {
        this._endYear = Number(value) || 0;
    }

    /** Форматований період навчання */
    get period() {
        if (this._startYear && this._endYear) {
            return `${this._startYear} — ${this._endYear}`;
        }
        if (this._startYear) {
            return `${this._startYear} — дотепер`;
        }
        return '';
    }

    toHTML() {
        return `
            <div class="resume-item">
                <h4>${this._escapeHTML(this._degree)}</h4>
                <div class="item-subtitle">${this._escapeHTML(this._institution)}</div>
                ${this.period ? `<div class="item-period">${this.period}</div>` : ''}
            </div>`;
    }

    toJSON() {
        return {
            type: this._type,
            institution: this._institution,
            degree: this._degree,
            startYear: this._startYear,
            endYear: this._endYear,
        };
    }

    _escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// ============================================================
//  Skills — клас для навичок
// ============================================================

class Skills extends ResumeSection {
    /**
     * @param {Object} data — { list: string[] } або { skills: 'a, b, c' }
     */
    constructor(data = {}) {
        super('skills');
        if (Array.isArray(data.list)) {
            this._list = data.list.map(s => String(s).trim()).filter(Boolean);
        } else if (typeof data.skills === 'string') {
            this._list = data.skills.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            this._list = [];
        }
    }

    /** Масив навичок */
    get list()       { return [...this._list]; }
    set list(value) {
        if (Array.isArray(value)) {
            this._list = value.map(s => String(s).trim()).filter(Boolean);
        }
    }

    /** Додати навичку */
    addSkill(skill) {
        const s = String(skill).trim();
        if (s && !this._list.includes(s)) {
            this._list.push(s);
        }
    }

    /** Видалити навичку */
    removeSkill(skill) {
        this._list = this._list.filter(s => s !== skill);
    }

    toHTML() {
        if (this._list.length === 0) return '';
        const tags = this._list.map(s =>
            `<span class="skill-tag">${this._escapeHTML(s)}</span>`
        ).join('');
        return `<div class="skills-list">${tags}</div>`;
    }

    toJSON() {
        return {
            type: this._type,
            list: [...this._list],
        };
    }

    _escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// ============================================================
//  Resume — головний клас, що об'єднує всі секції
// ============================================================

class Resume {
    constructor() {
        /** @type {PersonalInfo|null} */
        this._personalInfo = null;
        /** @type {Experience[]} */
        this._experience = [];
        /** @type {Education[]} */
        this._education = [];
        /** @type {Skills|null} */
        this._skills = null;
    }

    // —— Геттери ——

    get personalInfo() { return this._personalInfo; }
    get experience()   { return [...this._experience]; }
    get education()    { return [...this._education]; }
    get skills()       { return this._skills; }

    // —— Сеттери / мутатори ——

    setPersonalInfo(data) {
        this._personalInfo = new PersonalInfo(data);
        console.log('[Resume] PersonalInfo встановлено:', this._personalInfo);
    }

    addExperience(data) {
        this._experience.push(new Experience(data));
    }

    clearExperience() {
        this._experience = [];
    }

    addEducation(data) {
        this._education.push(new Education(data));
    }

    clearEducation() {
        this._education = [];
    }

    setSkills(data) {
        this._skills = new Skills(data);
    }

    // —— Рендеринг ——

    /**
     * render — створює повну HTML-розмітку резюме.
     * Використовує DOM-методи для побудови контейнера та вставки
     * HTML з кожної секції.
     *
     * @param {HTMLElement} container — DOM-елемент для вставки
     */
    render(container) {
        // Очистка контейнера
        container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'resume-rendered';

        // Особисті дані
        if (this._personalInfo) {
            wrapper.innerHTML += this._personalInfo.toHTML();
        }

        // Досвід роботи
        if (this._experience.length > 0) {
            let block = `
                <div class="resume-block">
                    <div class="resume-block-title">
                        💼 Досвід роботи
                        <button class="btn-edit-section" data-edit="experience">✏️ Редагувати</button>
                    </div>`;
            for (const exp of this._experience) {
                block += exp.toHTML();
            }
            block += '</div>';
            wrapper.innerHTML += block;
        }

        // Освіта
        if (this._education.length > 0) {
            let block = `
                <div class="resume-block">
                    <div class="resume-block-title">
                        🎓 Освіта
                        <button class="btn-edit-section" data-edit="education">✏️ Редагувати</button>
                    </div>`;
            for (const edu of this._education) {
                block += edu.toHTML();
            }
            block += '</div>';
            wrapper.innerHTML += block;
        }

        // Навички
        if (this._skills && this._skills.list.length > 0) {
            let block = `
                <div class="resume-block">
                    <div class="resume-block-title">
                        ⚡ Навички
                        <button class="btn-edit-section" data-edit="skills">✏️ Редагувати</button>
                    </div>`;
            block += this._skills.toHTML();
            block += '</div>';
            wrapper.innerHTML += block;
        }

        container.appendChild(wrapper);
        console.log('[Resume] Резюме відрендерено у DOM');
    }

    // —— Серіалізація (localStorage) ——

    /**
     * toJSON — серіалізує всі дані резюме у JSON-об'єкт.
     */
    toJSON() {
        return {
            personalInfo: this._personalInfo ? this._personalInfo.toJSON() : null,
            experience:   this._experience.map(e => e.toJSON()),
            education:    this._education.map(e => e.toJSON()),
            skills:       this._skills ? this._skills.toJSON() : null,
        };
    }

    /**
     * fromJSON — відновлює стан резюме з JSON-об'єкта.
     * (Статичний фабричний метод)
     *
     * @param {Object} json
     * @returns {Resume}
     */
    static fromJSON(json) {
        const resume = new Resume();
        if (json.personalInfo) {
            resume._personalInfo = new PersonalInfo(json.personalInfo);
        }
        if (Array.isArray(json.experience)) {
            resume._experience = json.experience.map(e => new Experience(e));
        }
        if (Array.isArray(json.education)) {
            resume._education = json.education.map(e => new Education(e));
        }
        if (json.skills) {
            resume._skills = new Skills(json.skills);
        }
        console.log('[Resume] Відновлено з JSON:', resume);
        return resume;
    }
}

// Логування
console.log('[models.js] OOP-модуль завантажено. Класи: ResumeSection, PersonalInfo, Experience, Education, Skills, Resume');
