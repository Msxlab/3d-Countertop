// src/services/calculationService.js
export const calculationService = {
    // Malzeme optimizasyonu
    calculateOptimalCuts: (dimensions, stockSize = { width: 120, height: 240 }) => {
        // En iyi kesim planını hesapla
        const pieces = dimensions.sort((a, b) => b.area - a.area);
        const layouts = [];
        let currentStock = { ...stockSize, used: [] };
        
        pieces.forEach(piece => {
            let placed = false;
            
            // Mevcut stokta yer ara
            for (let y = 0; y <= stockSize.height - piece.height; y++) {
                for (let x = 0; x <= stockSize.width - piece.width; x++) {
                    if (checkSpace(currentStock, x, y, piece)) {
                        currentStock.used.push({
                            ...piece,
                            x,
                            y
                        });
                        placed = true;
                        break;
                    }
                }
                if (placed) break;
            }
            
            // Yeni stok gerekirse
            if (!placed) {
                layouts.push(currentStock);
                currentStock = {
                    ...stockSize,
                    used: [{ ...piece, x: 0, y: 0 }]
                };
            }
        });
        
        layouts.push(currentStock);
        return layouts;
    },

    // Maliyet hesaplama
    calculateTotalCost: (countertop, options) => {
        const {
            material,
            edge,
            cutouts,
            finish,
            installation
        } = options;

        // Temel alan maliyeti
        const area = countertop.width * countertop.height;
        let totalCost = area * material.pricePerSquareMeter;

        // Kenar maliyeti
        const perimeter = 2 * (countertop.width + countertop.height);
        totalCost += perimeter * edge.pricePerMeter;

        // Kesim maliyetleri
        cutouts.forEach(cutout => {
            totalCost += cutout.price;
        });

        // Yüzey işlemi
        totalCost += area * finish.pricePerSquareMeter;

        // Montaj
        if (installation) {
            totalCost += installation.basePrice;
            totalCost += area * installation.pricePerSquareMeter;
        }

        return {
            subtotal: totalCost,
            tax: totalCost * 0.18, // %18 KDV
            total: totalCost * 1.18
        };
    },

    // Teknik özellikler
    calculateTechnicalSpecs: (countertop) => {
        return {
            weight: calculateWeight(countertop),
            supportPoints: calculateSupportPoints(countertop),
            stressPoints: identifyStressPoints(countertop),
            recommendations: generateRecommendations(countertop)
        };
    }
};

// Yardımcı fonksiyonlar
function checkSpace(stock, x, y, piece) {
    // Verilen konumda parça için yer var mı kontrol et
    for (const used of stock.used) {
        if (rectanglesOverlap(
            { x, y, width: piece.width, height: piece.height },
            used
        )) {
            return false;
        }
    }
    return true;
}

function rectanglesOverlap(rect1, rect2) {
    return !(
        rect1.x + rect1.width <= rect2.x ||
        rect2.x + rect2.width <= rect1.x ||
        rect1.y + rect1.height <= rect2.y ||
        rect2.y + rect2.height <= rect1.y
    );
}

function calculateWeight(countertop) {
    // Malzemeye göre ağırlık hesapla
    const densities = {
        granite: 2.7, // g/cm³
        marble: 2.5,
        quartz: 2.65
    };
    
    const volume = countertop.width * countertop.height * countertop.thickness;
    return volume * (densities[countertop.material] || 2.6);
}

function calculateSupportPoints(countertop) {
    // Destek noktalarını hesapla
    const maxSpan = 600; // mm
    const points = [];
    
    for (let x = 0; x < countertop.width; x += maxSpan) {
        points.push({
            x: Math.min(x + maxSpan/2, countertop.width),
            y: countertop.height / 2
        });
    }
    
    return points;
}

function identifyStressPoints(countertop) {
    // Stres noktalarını belirle
    const stressPoints = [];
    
    // Kesim ve montaj noktaları
    countertop.cutouts?.forEach(cutout => {
        stressPoints.push({
            x: cutout.x,
            y: cutout.y,
            risk: calculateStressRisk(cutout)
        });
    });
    
    return stressPoints;
}

function generateRecommendations(countertop) {
    // Öneriler oluştur
    const recommendations = [];
    
    // Boyut kontrolleri
    if (countertop.width > 3000) {
        recommendations.push({
            type: 'warning',
            message: 'Ek destek önerilir'
        });
    }
    
    // Malzeme önerileri
    if (countertop.material === 'marble' && countertop.application === 'kitchen') {
        recommendations.push({
            type: 'info',
            message: 'Mutfak için granit veya kuvars önerilir'
        });
    }
    
    return recommendations;
}