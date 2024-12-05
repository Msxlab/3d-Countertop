// src/store/slices/counterTopSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    countertops: [],
    selectedIds: [],
    activeId: null,
    zoom: 1,
    showGrid: true,
    snapToGrid: false,
    customerInfo: {
        name: '',
        address: '',
        phone: '',
        email: '',
        stone: '',
        surface: '',
        edgeProfile: '',
        sink: '',
        salesperson: ''
    },
    history: {
        past: [],
        present: null,
        future: []
    }
};

const counterTopSlice = createSlice({
    name: 'counterTop',
    initialState,
    reducers: {
        // Tezgah işlemleri
        updateCountertop: (state, action) => {
            const { id, updates } = action.payload;
            const countertop = state.countertops.find(c => c.id === id);
            if (countertop) {
                Object.assign(countertop, updates);
            }
        },
        moveCountertop: (state, action) => {
            const { id, x, y } = action.payload;
            const countertop = state.countertops.find(c => c.id === id);
            if (countertop) {
                countertop.x = x;
                countertop.y = y;
            }
        },
        rotateCountertop: (state, action) => {
            const { id, angle } = action.payload;
            const countertop = state.countertops.find(c => c.id === id);
            if (countertop) {
                countertop.rotation = angle;
            }
        },
        updateCountertopDimensions: (state, action) => {
            const { id, width, height, depth } = action.payload;
            const countertop = state.countertops.find(c => c.id === id);
            if (countertop) {
                if (width) countertop.width = width;
                if (height) countertop.height = height;
                if (depth) countertop.depth = depth;
            }
        },
        addCountertop: (state, action) => {
            state.countertops.push(action.payload);
        },
        removeCountertop: (state, action) => {
            state.countertops = state.countertops.filter(c => c.id !== action.payload);
        },

        // Seçim işlemleri
        setSelectedIds: (state, action) => {
            state.selectedIds = action.payload;
        },
        setActiveId: (state, action) => {
            state.activeId = action.payload;
        },

        // Grid ve zoom kontrolleri
        setZoom: (state, action) => {
            state.zoom = action.payload;
        },
        setShowGrid: (state, action) => {
            state.showGrid = action.payload;
        },
        setSnapToGrid: (state, action) => {
            state.snapToGrid = action.payload;
        },

        // Müşteri bilgileri
        updateCustomerInfo: (state, action) => {
            state.customerInfo = { ...state.customerInfo, ...action.payload };
        },

        // Şablon işlemleri
        loadTemplate: (state, action) => {
            state.countertops = action.payload;
        },

        // Geçmiş işlemleri
        saveToHistory: (state) => {
            state.history.past.push({
                countertops: JSON.parse(JSON.stringify(state.countertops)),
                selectedIds: [...state.selectedIds],
                activeId: state.activeId
            });
            state.history.future = [];
        },
        undo: (state) => {
            if (state.history.past.length === 0) return;
            
            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);
            
            state.history.future.unshift({
                countertops: JSON.parse(JSON.stringify(state.countertops)),
                selectedIds: [...state.selectedIds],
                activeId: state.activeId
            });
            
            state.countertops = previous.countertops;
            state.selectedIds = previous.selectedIds;
            state.activeId = previous.activeId;
            state.history.past = newPast;
        },
        redo: (state) => {
            if (state.history.future.length === 0) return;
            
            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);
            
            state.history.past.push({
                countertops: JSON.parse(JSON.stringify(state.countertops)),
                selectedIds: [...state.selectedIds],
                activeId: state.activeId
            });
            
            state.countertops = next.countertops;
            state.selectedIds = next.selectedIds;
            state.activeId = next.activeId;
            state.history.future = newFuture;
        }
    }
});

export const {
    updateCountertop,
    moveCountertop,
    rotateCountertop,
    updateCountertopDimensions,
    addCountertop,
    removeCountertop,
    setSelectedIds,
    setActiveId,
    setZoom,
    setShowGrid,
    setSnapToGrid,
    updateCustomerInfo,
    loadTemplate,
    saveToHistory,
    undo,
    redo
} = counterTopSlice.actions;

export default counterTopSlice.reducer;