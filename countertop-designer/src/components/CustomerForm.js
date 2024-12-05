// src/components/CustomerForm.js
import React from "react";

export const CustomerForm = ({ customerInfo, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-lg shadow-md">
      {/* Sol Taraf: Müşteri Bilgileri */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Müşteri Bilgileri</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Ad soyad giriniz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adres</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Adres giriniz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              type="tel"
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Telefon numarası giriniz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="E-posta adresi giriniz"
            />
          </div>
        </div>
      </div>

      {/* Sağ Taraf: Ek Seçimler */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ek Detaylar</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Taş Türü</label>
            <select
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.stone}
              onChange={(e) => onChange("stone", e.target.value)}
            >
              <option value="">Taş türü seçin</option>
              <option value="granite">Granit</option>
              <option value="marble">Mermer</option>
              <option value="quartz">Kuvars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Yüzey</label>
            <select
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.surface}
              onChange={(e) => onChange("surface", e.target.value)}
            >
              <option value="">Yüzey seçin</option>
              <option value="polished">Cilalı</option>
              <option value="honed">Mat</option>
              <option value="leathered">Deri Dokulu</option>
              <option value="brushed">Fırçalanmış</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kenar Profili</label>
            <select
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.edgeProfile}
              onChange={(e) => onChange("edgeProfile", e.target.value)}
            >
              <option value="">Kenar profili seçin</option>
              <option value="straight">Düz</option>
              <option value="beveled">Pahlı</option>
              <option value="bullnose">Yarım Yuvarlak</option>
              <option value="ogee">Ogee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Evye</label>
            <select
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.sink}
              onChange={(e) => onChange("sink", e.target.value)}
            >
              <option value="">Evye seçin</option>
              <option value="undermount">Alttan Montaj</option>
              <option value="topmount">Üstten Montaj</option>
              <option value="farmhouse">Farmhouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Satış Temsilcisi</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.salesperson}
              onChange={(e) => onChange("salesperson", e.target.value)}
              placeholder="Satış temsilcisi adı"
            />
          </div>
        </div>
      </div>
    </div>
  );
};