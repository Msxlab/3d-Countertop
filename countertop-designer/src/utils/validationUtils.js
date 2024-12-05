// src/utils/validationUtils.js
export const validationUtils = {
    validateCustomerInfo: (info) => {
        const errors = {};

        if (!info.name?.trim()) {
            errors.name = 'İsim zorunludur';
        }

        if (!info.email?.trim()) {
            errors.email = 'E-posta zorunludur';
        } else if (!/\S+@\S+\.\S+/.test(info.email)) {
            errors.email = 'Geçerli bir e-posta adresi girin';
        }

        if (!info.phone?.trim()) {
            errors.phone = 'Telefon zorunludur';
        } else if (!/^\d{10}$/.test(info.phone.replace(/\D/g, ''))) {
            errors.phone = 'Geçerli bir telefon numarası girin';
        }

        if (!info.address?.trim()) {
            errors.address = 'Adres zorunludur';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    validateDimensions: (dimensions) => {
        const errors = {};

        if (!dimensions.width || dimensions.width <= 0) {
            errors.width = 'Geçerli bir genişlik girin';
        }

        if (!dimensions.height || dimensions.height <= 0) {
            errors.height = 'Geçerli bir yükseklik girin';
        }

        if (!dimensions.depth || dimensions.depth <= 0) {
            errors.depth = 'Geçerli bir derinlik girin';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};
