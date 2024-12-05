// src/components/PDFExport.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';

export const PDFExport = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const { customerInfo, countertops } = useSelector(state => state.counterTop);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const doc = new jsPDF();
            let yPos = 20;

            // Logo ve Başlık
            doc.setFontSize(20);
            doc.text('Tezgah Tasarım Teklifi', 105, yPos, { align: 'center' });
            
            // Tarih
            doc.setFontSize(10);
            yPos += 10;
            doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, yPos);

            // Müşteri Bilgileri
            yPos += 20;
            doc.setFontSize(14);
            doc.text('Müşteri Bilgileri', 20, yPos);
            
            yPos += 10;
            doc.setFontSize(12);
            doc.text(`Ad Soyad: ${customerInfo.name}`, 20, yPos);
            yPos += 8;
            doc.text(`Adres: ${customerInfo.address}`, 20, yPos);
            yPos += 8;
            doc.text(`Telefon: ${customerInfo.phone}`, 20, yPos);
            yPos += 8;
            doc.text(`E-posta: ${customerInfo.email}`, 20, yPos);

            // Malzeme Bilgileri
            yPos += 20;
            doc.setFontSize(14);
            doc.text('Malzeme Detayları', 20, yPos);
            
            yPos += 10;
            doc.setFontSize(12);
            doc.text(`Taş Türü: ${customerInfo.stone}`, 20, yPos);
            yPos += 8;
            doc.text(`Yüzey: ${customerInfo.surface}`, 20, yPos);
            yPos += 8;
            doc.text(`Kenar Profili: ${customerInfo.edgeProfile}`, 20, yPos);

            // Tezgah Detayları
            yPos += 20;
            doc.setFontSize(14);
            doc.text('Tezgah Detayları', 20, yPos);

            let totalArea = 0;
            countertops.forEach((countertop, index) => {
                yPos += 15;
                doc.setFontSize(12);
                doc.text(`Parça ${index + 1}:`, 20, yPos);
                yPos += 8;
                doc.text(`Boyutlar: ${countertop.width}" × ${countertop.height}" × ${countertop.depth}"`, 30, yPos);
                yPos += 8;
                const area = ((countertop.width * countertop.height) / 144).toFixed(2);
                totalArea += parseFloat(area);
                doc.text(`Alan: ${area} ft²`, 30, yPos);
            });

            // Toplam Alan
            yPos += 15;
            doc.text(`Toplam Alan: ${totalArea.toFixed(2)} ft²`, 20, yPos);

            // Canvas Görüntüsü
            yPos += 20;
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData, 'JPEG', 20, yPos, 170, 100);
                yPos += 110;
            }

            // Şartlar ve Koşullar
            yPos += 10;
            doc.setFontSize(10);
            doc.text('Şartlar ve Koşullar:', 20, yPos);
            yPos += 8;
            doc.text('1. Bu teklif 30 gün geçerlidir.', 20, yPos);
            yPos += 6;
            doc.text('2. Üretim için %50 ön ödeme gereklidir.', 20, yPos);
            yPos += 6;
            doc.text('3. Üretim süresi onaydan sonra 2-3 haftadır.', 20, yPos);
            yPos += 6;
            doc.text('4. Ölçüler yerinde kontrol edilecektir.', 20, yPos);

            // PDF'i indir
            doc.save(`tezgah-teklifi-${customerInfo.name.replace(/\s+/g, '-')}.pdf`);
        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            alert('PDF oluşturulurken bir hata oluştu.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg 
                     hover:bg-green-700 transition-colors disabled:bg-gray-400 
                     disabled:cursor-not-allowed"
        >
            {isGenerating ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Oluşturuluyor...</span>
                </>
            ) : (
                <>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    <span>PDF İndir</span>
                </>
            )}
        </button>
    );
};