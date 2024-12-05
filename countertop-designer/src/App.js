// src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from "./components/Header";
import { CustomerForm } from "./components/CustomerForm";
import { CountertopCanvas } from "./components/CountertopCanvas";
import { StoneSelection } from "./components/StoneSelection";
import { InteractiveElements } from "./components/InteractiveElements";
import { Quotes } from "./components/Quotes";
import { ControlPanel } from "./components/ControlPanel";
import { SideMenu } from "./components/SideMenu";
import { PDFExport } from "./components/PDFExport";
import { ThreeDPreview } from "./components/ThreeDPreview";
import { MeasurementTools } from "./components/MeasurementTools";
import { ProjectManager } from "./components/ProjectManager";
import { TemplateSystem } from "./components/TemplateSystem";
import { useDrag } from "./hooks/useDrag";
import { saveQuote } from "./services/firebase";
import {
    updateCountertop,
    setSelectedIds,
    setActiveId,
    setZoom,
    updateCustomerInfo,
    undo,
    redo,
    saveToHistory
} from './store/slices/counterTopSlice';

export default function App() {
    const dispatch = useDispatch();
    const {
        countertops,
        selectedIds,
        activeId,
        zoom,
        showGrid,
        snapToGrid,
        customerInfo
    } = useSelector(state => state.counterTop);

    const [step, setStep] = useState(0);
    const [selectedStone, setSelectedStone] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [darkMode, setDarkMode] = useState(false);
    const [date, setDate] = useState(new Date());

    const { isDragging, startDrag, onDrag, stopDrag } = useDrag(zoom, snapToGrid);

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleNextStep = (stoneType, stoneDimensions) => {
        setSelectedStone(stoneType);
        setDimensions(stoneDimensions);
        setStep(1);
    };

    const handleCustomerInfoChange = (field, value) => {
        dispatch(updateCustomerInfo({ [field]: value }));
    };

    const handleMouseDown = (e, id) => {
        startDrag(e, id);
        if (e.shiftKey) {
            dispatch(setSelectedIds(selectedIds.includes(id) ? selectedIds : [...selectedIds, id]));
        } else {
            dispatch(setSelectedIds([id]));
        }
        dispatch(setActiveId(id));
    };

    const handleMouseMove = (e) => {
        const delta = onDrag(e);
        if (delta) {
            selectedIds.forEach(id => {
                const countertop = countertops.find(c => c.id === id);
                if (countertop) {
                    dispatch(updateCountertop({
                        id,
                        updates: {
                            x: countertop.x + delta.x,
                            y: countertop.y + delta.y
                        }
                    }));
                }
            });
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            stopDrag();
            dispatch(saveToHistory());
        }
    };

    const calculatePrice = () => {
        const area = dimensions.width * dimensions.height;
        const depthFactor = dimensions.depth || 1;
        const basePrice = 50;
        return area * depthFactor * basePrice;
    };

    const handleSaveQuote = async () => {
        try {
            const quote = {
                id: Date.now().toString(),
                customerInfo,
                countertops,
                selectedStone,
                dimensions,
                price: calculatePrice(),
                date: new Date().toISOString()
            };
            await saveQuote(quote);
            alert('Teklif başarıyla kaydedildi!');
        } catch (error) {
            console.error('Teklif kaydedilirken hata:', error);
            alert('Teklif kaydedilirken bir hata oluştu.');
        }
    };

    return (
        step === 0 ? (
            <StoneSelection onNext={handleNextStep} />
        ) : (
            <div className={darkMode ? "dark" : ""}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <Header
                        date={date}
                        showGrid={showGrid}
                        snapToGrid={snapToGrid}
                        canUndo={true}
                        canRedo={true}
                        onUndo={() => dispatch(undo())}
                        onRedo={() => dispatch(redo())}
                    />

                    <main className="container mx-auto p-4">
                        <CustomerForm
                            customerInfo={customerInfo}
                            onChange={handleCustomerInfoChange}
                        />

                        <div className="flex gap-4 mt-4">
                            <div className="flex-1">
                                <CountertopCanvas
                                    countertops={countertops}
                                    selectedIds={selectedIds}
                                    zoom={zoom}
                                    showGrid={showGrid}
                                    isDragging={isDragging}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                            </div>
                            <div className="w-96">
                                <div className="space-y-4">
                                    <ControlPanel />
                                    <SideMenu />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <ThreeDPreview />
                            <MeasurementTools />
                        </div>

                        <div className="mt-4 space-y-4">
                            <ProjectManager />
                            <TemplateSystem />
                            <Quotes />
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <PDFExport />
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
                            >
                                {darkMode ? '🌞' : '🌙'}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        )
    );
}