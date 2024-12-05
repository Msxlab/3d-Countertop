// src/hooks/useHistory.js
import { useState } from 'react';

export const useHistory = (initialState) => {
    const [past, setPast] = useState([]);
    const [present, setPresent] = useState(initialState);
    const [future, setFuture] = useState([]);

    const push = (newState) => {
        setPast([...past, present]);
        setPresent(newState);
        setFuture([]);
    };

    const undo = () => {
        if (past.length === 0) return present;

        const newPast = past.slice(0, -1);
        const newPresent = past[past.length - 1];

        setPast(newPast);
        setPresent(newPresent);
        setFuture([present, ...future]);

        return newPresent;
    };

    const redo = () => {
        if (future.length === 0) return present;

        const [newPresent, ...newFuture] = future;

        setPast([...past, present]);
        setPresent(newPresent);
        setFuture(newFuture);

        return newPresent;
    };

    return {
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        undo,
        redo,
        push,
        present
    };
};