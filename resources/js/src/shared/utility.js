export const updateObject = (oldObject, updatedProps) => ({
    ...oldObject, ...updatedProps
});

export const convertDate = date => {
    const d = new Date(date)
    const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });

    return dtf.formatToParts(d).map(({ value }) => value).join('');
};

export const getQueryParam = (search, name) => new URLSearchParams(search).get(name);

export const checkValidity = (value, rules) => {
    let isValid = true;

    if (rules.required) isValid = (value.trim() !== '' && isValid);

    if (rules.minLength) isValid = (value.length >= rules.minLength && isValid);

    if (rules.maxLength) isValid = (value.length <= rules.maxLength && isValid);

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = (pattern.test(value) && isValid);
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = (pattern.test(value) && isValid);
    }

    return isValid;
};