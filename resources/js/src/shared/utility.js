export const updateObject = (oldObject, updatedProps) => ({
    ...oldObject, ...updatedProps
});

export const parseMoment = item => item.format('YYYY-MM-DD HH:mm:ss');

export const convertDate = date => {
    if (!date) return 'Undefined';
    const d = new Date(date)
    const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });

    return dtf.formatToParts(d).map(({ value }) => value).join('');
};

const twoDigits = number => number < 10 ? '0' + number : number;

export const convertTime = date => {
    if (!date) return 'Undefined';
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    return `${twoDigits(hours)} : ${twoDigits(minutes)} : ${twoDigits(seconds)}`;
}

export const getQueryParam = (search, name) => new URLSearchParams(search).get(name);

export const timeFromTimestamp = timestamp => {
    const totalSeconds = Math.round(timestamp);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds - hours * 3600 - minutes * 60;

    return `${twoDigits(hours)} : ${twoDigits(minutes)} : ${twoDigits(seconds)}`;
}

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