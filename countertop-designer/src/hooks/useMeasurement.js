// src/hooks/useMeasurement.js
import { useState, useCallback } from 'react';

export const useMeasurement = (zoom = 1) => {
    const [measurements, setMeasurements] = useState([]);
    const [activeMeasurement, setActiveMeasurement] = useState(null);

    const startMeasurement = useCallback((point) => {
        setActiveMeasurement({
            startPoint: point,
            endPoint: point,
            type: 'linear'
        });
    }, []);

    const updateMeasurement = useCallback((point) => {
        if (activeMeasurement) {
            setActiveMeasurement({
                ...activeMeasurement,
                endPoint: point
            });
        }
    }, [activeMeasurement]);

    const completeMeasurement = useCallback(() => {
        if (activeMeasurement) {
            const dx = activeMeasurement.endPoint.x - activeMeasurement.startPoint.x;
            const dy = activeMeasurement.endPoint.y - activeMeasurement.startPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy) / zoom;

            setMeasurements([...measurements, {
                ...activeMeasurement,
                distance,
                id: Date.now()
            }]);
            setActiveMeasurement(null);
        }
    }, [activeMeasurement, measurements, zoom]);

    const removeMeasurement = useCallback((id) => {
        setMeasurements(prev => prev.filter(m => m.id !== id));
    }, []);

    return {
        measurements,
        activeMeasurement,
        startMeasurement,
        updateMeasurement,
        completeMeasurement,
        removeMeasurement
    };
};