const handleMouseDown = (e, id) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dispatch(setActiveId(id));
    startDrag(e, { x, y });
};

const handleMouseMove = (e) => {
    if (!isDragging) return;

    const delta = onDrag(e);
    if (delta) {
        dispatch(moveCountertop({
            id: activeId,
            x: delta.x,
            y: delta.y
        }));
    }
};