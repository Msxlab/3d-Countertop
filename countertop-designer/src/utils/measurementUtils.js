// src/utils/priceCalculator.js
export const priceCalculator = {
    calculateTotal: (countertop, materials, options = {}) => {
        const area = (countertop.width * countertop.height) / 144; // foot kare cinsinden
        const perimeter = 2 * (countertop.width + countertop.height) / 12; // foot cinsinden
        
        // Baz fiyat hesaplama
        const materialPrice = materials[countertop.material]?.pricePerSquareFoot || 50;
        let price = area * materialPrice;
        
        // Yüzey işlemi ek ücreti
        if (options.finish) {
            price *= options.finish.priceMultiplier || 1;
        }
        
        // Kenar profili ek ücreti
        if (options.edgeProfile) {
            price += perimeter * (options.edgeProfile.pricePerLinearFoot || 0);
        }
        
        // Derinlik çarpanı
        const depthFactor = countertop.depth > 1.5 ? (countertop.depth / 1.5) : 1;
        price *= depthFactor;
        
        return price;
    },

    calculateTax: (subTotal, taxRate = 0.18) => {
        return subTotal * taxRate;
    },

    formatPrice: (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);
    }
};