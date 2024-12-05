// src/utils/formatUtils.js
export const formatUtils = {
    formatDate: (date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    formatPhoneNumber: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },

    formatDimension: (value, unit = 'inç') => {
        return `${value.toFixed(2)} ${unit}`;
    },

    formatArea: (value) => {
        return `${value.toFixed(2)} ft²`;
    }
};