// src/hooks/useZoom.js
import { useState, useCallback } from 'react';

export const useZoom = (initialZoom = 1, minZoom = 0.1, maxZoom = 5) => {
    const [zoom, setZoom] = useState(initialZoom);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    const zoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev * 1.2, maxZoom));
    }, [maxZoom]);

    const zoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev / 1.2, minZoom));
    }, [minZoom]);

    const resetZoom = useCallback(() => {
        setZoom(initialZoom);
        setPanOffset({ x: 0, y: 0 });
    }, [initialZoom]);

    const handlePan = useCallback((dx, dy) => {
        setPanOffset(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
        }));
    }, []);

    const setZoomLevel = useCallback((newZoom) => {
        const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        setZoom(clampedZoom);
    }, [minZoom, maxZoom]);

    return {
        zoom,
        panOffset,
        zoomIn,
        zoomOut,
        resetZoom,
        handlePan,
        setZoomLevel
    };
};