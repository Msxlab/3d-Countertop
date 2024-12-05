// src/components/MeasurementTools.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const MeasurementTools = () => {
    const dispatch = useDispatch();
    const [activeTool, setActiveTool] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [startPoint, setStartPoint] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tempMeasurement, setTempMeasurement] = useState(null);

    const { zoom, countertops } = useSelector(state => state.counterTop);

    const tools = [
        {
            id: 'linear',
            name: 'Doğrusal Ölçüm',
            icon: '📏',
            description: 'İki nokta arası mesafeyi ölçer'
        },
        {
            id: 'angle',
            name: 'Açı Ölçümü',
            icon: '📐',
            description: 'İki çizgi arasındaki açıyı ölçer'
        },
        {
            id: 'area',
            name: 'Alan Ölçümü',
            icon: '⬛',
            description: 'Seçilen alanı hesaplar'
        }
    ];

    const pixelsToInches = (pixels) => {
        return (pixels / zoom) / 20; // 20 piksel = 1 inç
    };

    const calculateMeasurement = (start, end, type) => {
        switch (type) {
            case 'linear':
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return {
                    value: pixelsToInches(distance),
                    unit: 'inç',
                    type: 'linear',
                    start,
                    end
                };

            case 'angle':
                if (!start.midPoint) return null;
                const angle1 = Math.atan2(start.end.y - start.midPoint.y, 
                                        start.end.x - start.midPoint.x);
                const angle2 = Math.atan2(end.y - start.midPoint.y, 
                                        end.x - start.midPoint.x);
                let angle = (angle2 - angle1) * 180 / Math.PI;
                if (angle < 0) angle += 360;
                return {
                    value: angle,
                    unit: 'derece',
                    type: 'angle',
                    points: [start.end, start.midPoint, end]
                };

            case 'area':
                const width = Math.abs(end.x - start.x);
                const height = Math.abs(end.y - start.y);
                const area = pixelsToInches(width) * pixelsToInches(height);
                return {
                    value: area,
                    unit: 'inç²',
                    type: 'area',
                    points: [start, end]
                };

            default:
                return null;
        }
    };

    const handleCanvasMouseDown = (e) => {
        if (!activeTool) return;

        const rect = e.target.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        if (activeTool === 'angle' && startPoint && !startPoint.midPoint) {
            setStartPoint({
                ...startPoint,
                midPoint: point
            });
        } else {
            setStartPoint(point);
            setIsDrawing(true);
        }
    };

    const handleCanvasMouseMove = (e) => {
        if (!isDrawing || !startPoint) return;

        const rect = e.target.getBoundingClientRect();
        const currentPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        const measurement = calculateMeasurement(startPoint, currentPoint, activeTool);
        setTempMeasurement(measurement);
    };

    const handleCanvasMouseUp = () => {
        if (!isDrawing || !startPoint || !tempMeasurement) return;

        setMeasurements([...measurements, {
            ...tempMeasurement,
            id: Date.now()
        }]);

        setIsDrawing(false);
        setStartPoint(null);
        setTempMeasurement(null);

        if (activeTool === 'angle') {
            setStartPoint({
                end: tempMeasurement.points[tempMeasurement.points.length - 1],
                midPoint: null
            });
        }
    };

    const removeMeasurement = (id) => {
        setMeasurements(measurements.filter(m => m.id !== id));
    };

    return (
        <div className="flex flex-col h-full">
            {/* Araç Çubuğu */}
            <div className="p-4 border-b">
                <div className="flex gap-2">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => setActiveTool(
                                activeTool === tool.id ? null : tool.id
                            )}
                            className={`p-2 rounded-lg flex items-center gap-2 
                                     ${activeTool === tool.id 
                                       ? 'bg-blue-500 text-white' 
                                       : 'bg-gray-100 hover:bg-gray-200'}`}
                            title={tool.description}
                        >
                            <span>{tool.icon}</span>
                            <span className="hidden md:inline">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Ölçüm Listesi */}
            <div className="p-4 flex-grow overflow-auto">
                <h3 className="font-medium mb-2">Ölçümler</h3>
                <div className="space-y-2">
                    {measurements.map(measurement => (
                        <div
                            key={measurement.id}
                            className="flex justify-between items-center p-2 bg-gray-50 
                                     rounded hover:bg-gray-100"
                        >
                            <div>
                                <span className="font-medium">
                                    {measurement.type === 'linear' ? 'Mesafe' :
                                     measurement.type === 'angle' ? 'Açı' : 'Alan'}:
                                </span>
                                <span className="ml-2">
                                    {measurement.value.toFixed(2)} {measurement.unit}
                                </span>
                            </div>
                            <button
                                onClick={() => removeMeasurement(measurement.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};