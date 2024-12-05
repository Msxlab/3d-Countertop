// src/services/customerService.js
import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where,
    orderBy 
} from 'firebase/firestore';

export const customerService = {
    // Yeni müşteri ekleme
    addCustomer: async (customerData) => {
        try {
            const customersRef = collection(db, 'customers');
            const docRef = await addDoc(customersRef, {
                ...customerData,
                createdAt: new Date().toISOString(),
                status: 'active'
            });
            return docRef.id;
        } catch (error) {
            console.error('Müşteri eklenirken hata:', error);
            throw error;
        }
    },

    // Müşteri listesini getirme
    getCustomers: async (filters = {}) => {
        try {
            const customersRef = collection(db, 'customers');
            let q = query(customersRef, orderBy('createdAt', 'desc'));

            if (filters.status) {
                q = query(q, where('status', '==', filters.status));
            }
            if (filters.type) {
                q = query(q, where('type', '==', filters.type));
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Müşteriler yüklenirken hata:', error);
            throw error;
        }
    },

    // Müşteri güncelleme
    updateCustomer: async (customerId, updatedData) => {
        try {
            const customerRef = doc(db, 'customers', customerId);
            await updateDoc(customerRef, {
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Müşteri güncellenirken hata:', error);
            throw error;
        }
    },

    // Müşteri silme
    deleteCustomer: async (customerId) => {
        try {
            const customerRef = doc(db, 'customers', customerId);
            await deleteDoc(customerRef);
            return true;
        } catch (error) {
            console.error('Müşteri silinirken hata:', error);
            throw error;
        }
    },

    // Müşteri projeleri
    getCustomerProjects: async (customerId) => {
        try {
            const projectsRef = collection(db, 'projects');
            const q = query(
                projectsRef, 
                where('customerId', '==', customerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Müşteri projeleri yüklenirken hata:', error);
            throw error;
        }
    },

    // Müşteri teklifleri
    getCustomerQuotes: async (customerId) => {
        try {
            const quotesRef = collection(db, 'quotes');
            const q = query(
                quotesRef, 
                where('customerId', '==', customerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Müşteri teklifleri yüklenirken hata:', error);
            throw error;
        }
    }
};