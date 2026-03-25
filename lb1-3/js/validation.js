/**
 * validation.js — Модуль валідації даних
 * 
 * Використовує замикання (closures) та каррінг (currying) для
 * створення гнучких функцій-валідаторів. Кожна функція повертає
 * об'єкт { valid: boolean, message: string }.
 * 
 * "use strict" — увімкнення суворого режиму JavaScript.
 */
"use strict";

// ============================================================
//  Утіліти: каррінг та замикання
// ============================================================

/**
 * curry — загальна функція каррінгу.
 * Приймає функцію з кількома аргументами і повертає ланцюг
 * функцій, кожна з яких приймає один аргумент.
 *
 * @param {Function} fn — функція для каррінгу
 * @returns {Function} — каррована версія fn
 *
 * Приклад:
 *   const add = (a, b) => a + b;
 *   const curriedAdd = curry(add);
 *   curriedAdd(1)(2); // 3
 */
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function (...nextArgs) {
            return curried.apply(this, args.concat(nextArgs));
        };
    };
}

// ============================================================
//  Базові валідатори (використовують замикання)
// ============================================================

/**
 * createValidator — замикання, що створює валідатор із набором правил.
 *
 * @param {Array<{ check: Function, message: string }>} rules
 * @returns {Function} — функція(value) → { valid, message }
 */
function createValidator(rules) {
    // Замикання: rules зберігається у лексичному оточенні
    return function validate(value) {
        for (const rule of rules) {
            if (!rule.check(value)) {
                return { valid: false, message: rule.message };
            }
        }
        return { valid: true, message: '' };
    };
}

/**
 * required — перевірка, що значення не порожнє.
 * @param {string} value
 * @returns {{ valid: boolean, message: string }}
 */
function required(value) {
    const v = typeof value === 'string' ? value.trim() : value;
    if (!v && v !== 0) {
        return { valid: false, message: 'Це поле є обов\'язковим' };
    }
    return { valid: true, message: '' };
}

/**
 * minLength — каррована функція перевірки мінімальної довжини.
 * Використовує curry для часткового застосування.
 *
 * Приклад:
 *   const min3 = minLength(3);
 *   min3("Hi");  // { valid: false, message: '...' }
 *   min3("Hey"); // { valid: true, message: '' }
 */
const minLength = curry(function (min, value) {
    if (String(value).trim().length < min) {
        return { valid: false, message: `Мінімальна довжина: ${min} символів` };
    }
    return { valid: true, message: '' };
});

/**
 * maxLength — каррована перевірка максимальної довжини.
 */
const maxLength = curry(function (max, value) {
    if (String(value).trim().length > max) {
        return { valid: false, message: `Максимальна довжина: ${max} символів` };
    }
    return { valid: true, message: '' };
});

/**
 * isEmail — перевірка формату email.
 */
function isEmail(value) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(String(value).trim())) {
        return { valid: false, message: 'Введіть корректну email адресу' };
    }
    return { valid: true, message: '' };
}

/**
 * isPhone — перевірка формату телефону (мінімум 7 цифр).
 */
function isPhone(value) {
    const digits = String(value).replace(/\D/g, '');
    if (digits.length < 7) {
        return { valid: false, message: 'Введіть коректний номер телефону' };
    }
    return { valid: true, message: '' };
}

/**
 * isPositiveInt — перевірка, що значення є додатнім цілим числом.
 * Використовується для перетворення тексту у число (вік, рік).
 */
function isPositiveInt(value) {
    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
        return { valid: false, message: 'Введіть додатнє ціле число' };
    }
    return { valid: true, message: '' };
}

/**
 * isAgeValid — перевірка діапазону віку (14–120).
 */
function isAgeValid(value) {
    const num = Number(value);
    if (num < 14 || num > 120) {
        return { valid: false, message: 'Вік має бути від 14 до 120 років' };
    }
    return { valid: true, message: '' };
}

/**
 * isYearValid — перевірка року (1950 — поточний рік + 10).
 */
const isYearValid = curry(function (label, value) {
    const num = Number(value);
    const maxYear = new Date().getFullYear() + 10;
    if (num < 1950 || num > maxYear) {
        return { valid: false, message: `${label}: рік має бути від 1950 до ${maxYear}` };
    }
    return { valid: true, message: '' };
});

// ============================================================
//  Складені валідатори для кожного поля форми
// ============================================================

/**
 * Валідатори для PersonalInfo.
 * Кожен — масив функцій, які виконуються послідовно.
 */
const personalValidators = {
    fullName: [required, minLength(2), maxLength(100)],
    email:    [required, isEmail],
    phone:    [required, isPhone],
    age:      [required, isPositiveInt, isAgeValid],
};

/**
 * Валідатори для одного запису Experience.
 */
const experienceValidators = {
    company:   [required, minLength(2)],
    position:  [required, minLength(2)],
    startDate: [required],
    endDate:   [],  // не обов'язково (може бути «до цього часу»)
    description: [],
};

/**
 * Валідатори для одного запису Education.
 */
const educationValidators = {
    institution: [required, minLength(2)],
    degree:      [required, minLength(2)],
    startYear:   [required, isPositiveInt, isYearValid('Рік початку')],
    endYear:     [],  // може бути порожнім, якщо навчається зараз
};

/**
 * Валідатори для Skills.
 */
const skillsValidators = {
    skills: [required, minLength(2)],
};

// ============================================================
//  Головна функція валідації
// ============================================================

/**
 * validateFields — валідація набору полів за заданою схемою.
 *
 * @param {Object} data   — об'єкт { fieldName: value }
 * @param {Object} schema — об'єкт { fieldName: [validator1, validator2, ...] }
 * @returns {{ valid: boolean, errors: Object }}
 *
 * Приклад:
 *   validateFields({ fullName: '' }, personalValidators);
 *   // → { valid: false, errors: { fullName: "Це поле є обов'язковим" } }
 */
function validateFields(data, schema) {
    const errors = {};
    let valid = true;

    for (const [field, validators] of Object.entries(schema)) {
        const value = data[field] !== undefined ? data[field] : '';
        for (const validate of validators) {
            const result = validate(value);
            if (!result.valid) {
                errors[field] = result.message;
                valid = false;
                break; // показуємо лише першу помилку
            }
        }
    }

    return { valid, errors };
}

// Логування для перевірки у DevTools
console.log('[validation.js] Модуль валідації завантажено');
