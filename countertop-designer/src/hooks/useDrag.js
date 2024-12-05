// src/hooks/useDrag.js
import { useState } from 'react';

export const useDrag = (zoom = 1, snapToGrid = false) => {
    const [isDragging, setIsDragging] = useState(false);
    const [lastPosition, setLastPosition] = useState(null);
    const [draggedId, setDraggedId] = useState(null);

    const startDrag = (e, id) => {
        setIsDragging(true);
        setLastPosition({ x: e.clientX, y: e.clientY });
        setDraggedId(id);
    };

    const onDrag = (e) => {
        if (!isDragging || !lastPosition) return null;

        let deltaX = (e.clientX - lastPosition.x) / zoom;
        let deltaY = (e.clientY - lastPosition.y) / zoom;

        if (snapToGrid) {
            deltaX = Math.round(deltaX / 20) * 20;
            deltaY = Math.round(deltaY / 20) * 20;
        }

        setLastPosition({ x: e.clientX, y: e.clientY });
        return { x: deltaX, y: deltaY };
    };

    const stopDrag = () => {
        setIsDragging(false);
        setLastPosition(null);
        setDraggedId(null);
    };

    return { isDragging, draggedId, startDrag, onDrag, stopDrag };
};