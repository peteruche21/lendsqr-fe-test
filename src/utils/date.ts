const userDateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
});

export function formatUserDate(value: string): string {
    const parts = userDateFormatter.formatToParts(new Date(value));
    const month = getDatePart(parts, 'month');
    const day = getDatePart(parts, 'day');
    const year = getDatePart(parts, 'year');
    const hour = getDatePart(parts, 'hour');
    const minute = getDatePart(parts, 'minute');
    const dayPeriod = getDatePart(parts, 'dayPeriod');

    return `${month} ${day}, ${year} ${hour}:${minute} ${dayPeriod}`;
}

function getDatePart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
    return parts.find((part) => part.type === type)?.value ?? '';
}
