import React, { useState, useRef, useEffect } from 'react';

//representa uma sticky note
const StickyNote = ({ note, onDelete, onUpdateText, onUpdatePosition }) => {
    const [text, setText] = useState(note.text || '');
    const [position, setPosition] = useState({ x: note.x, y: note.y });
    const noteRef = useRef(null);
    const dragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    //define a escrita de texto e posição
    useEffect(() => {
        setText(note.text || '');
        setPosition({ x: note.x, y: note.y });
    }, [note.text, note.x, note.y]);

    const handleTextChange = (e) => {
        setText(e.target.value);
        if (onUpdateText) {
            onUpdateText(note.id, e.target.value);
        }
    };

    //funções que permitem arrastar e largar as sticky notes 
    const handleMouseDown = (e) => {
        dragging.current = true;
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!dragging.current) return;
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        if (dragging.current) {
            dragging.current = false;
            if (onUpdatePosition) {
                onUpdatePosition(note.id, position.x, position.y);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [position]);

    return (
        <div
            ref={noteRef}
            onMouseDown={handleMouseDown}
            style={{
                backgroundColor: '#B6C7B5',
                padding: '10px',
                margin: '10px',
                borderRadius: '5px',
                position: 'absolute',
                top: position.y,
                left: position.x,
                cursor: 'move',
                width: '200px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                userSelect: 'none'
            }}
        >
            <textarea
                value={text}
                onChange={handleTextChange}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ width: '100%', height: '100px', border: 'none', outline: 'none', resize: 'none' }}
            />
            <button onClick={() => onDelete(note.id)} className='btnSecundario p-1 rounded-2'>Delete</button>
        </div>
    );
};

//gere a lista de sticky notes
const StickyNotesContainer = ({ notes, setNotes }) => {
    //adicionar nova sticky note
    const addNote = () => {
        const newNote = {
            id: Date.now(),
            text: '',
            x: 100 + Math.random() * 300,
            y: 100 + Math.random() * 300,
        };
        setNotes((prev) => [...prev, newNote]);
    };

    //eliminar
    const deleteNote = (id) => {
        setNotes((prev) => prev.filter(note => note.id !== id));
    };

    //update do texto
    const updateNoteText = (id, newText) => {
        setNotes((prev) =>
            prev.map(note => (note.id === id ? { ...note, text: newText } : note))
        );
    };

    //update da posição
    const updateNotePosition = (id, x, y) => {
        setNotes((prev) =>
            prev.map(note => (note.id === id ? { ...note, x, y } : note))
        );
    };

    return (
        <div>
            <button 
                onClick={addNote} 
                style={{ 
                    position: 'fixed', 
                    bottom: '20px', 
                    right: '350px', 
                    zIndex: 10000,
                    padding: '10px 15px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    backgroundColor: '#6B8E78',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}
                title="Add Sticky Note"
            >
                Add Sticky Note
            </button>
            {notes.map(note => (
                <StickyNote
                    key={note.id}
                    note={note}
                    onDelete={deleteNote}
                    onUpdateText={updateNoteText}
                    onUpdatePosition={updateNotePosition}
                />
            ))}
        </div>
    );
};

export default StickyNotesContainer;