import Mover from './imgs/Canvas/mover.svg';
import Ligar from './imgs/Canvas/ligar.svg';
import Texto from './imgs/Canvas/texto.svg';
import Desenhar from './imgs/Canvas/desenhar.svg';
import StickyNote from './imgs/Canvas/stickyNote.svg';

import { useState } from 'react';

function Toolbar({ onToggleLinkMode, onToggleDrawMode, onToggleStickyNoteMode }) {
    const [linkMode, setLinkMode] = useState(false);
    const [drawMode, setDrawMode] = useState(false);
    const [stickyNoteMode, setStickyNoteMode] = useState(false);

    //para ligar e desligar o modo de criar ligações
    const handleLigarClick = () => {
        const newLinkMode = !linkMode;
        setLinkMode(newLinkMode);
        if (onToggleLinkMode) {
            onToggleLinkMode(newLinkMode);
        }
        if (newLinkMode && drawMode) {
            setDrawMode(false);
            if (onToggleDrawMode) {
                onToggleDrawMode(false);
            }
        }
    };

    //para ligar e desligar o modo de desenho
    const handleDesenharClick = () => {
        const newDrawMode = !drawMode;
        setDrawMode(newDrawMode);
        if (onToggleDrawMode) {
            onToggleDrawMode(newDrawMode);
        }
        if (newDrawMode && linkMode) {
            setLinkMode(false);
            if (onToggleLinkMode) {
                onToggleLinkMode(false);
            }
        }
    };

    //para ligar e desligar o modo de adicionar notas
    const handleStickyNoteClick = () => {
        const newStickyNoteMode = !stickyNoteMode;
        setStickyNoteMode(newStickyNoteMode);
        if (onToggleStickyNoteMode) {
            onToggleStickyNoteMode(newStickyNoteMode);
        }
    };

    return (
        <div className="toolbar d-flex justify-content-center align-items-center gap-4" style={{ bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, position: 'fixed', padding: '10px', borderRadius: '10px' }}>
            <button className="toolbar-btn" style={{  cursor: 'default', opacity: 0.5 }} tabIndex={-1} aria-disabled="true">
                <img src={Mover} alt="Mover" />
                </button> {/*icone desativado*/}
            <button className="toolbar-btn" onClick={handleLigarClick} style={{ border: linkMode ? '2px solid blue' : 'none' }}>
                <img src={Ligar} alt="Ligar" />
            </button>
            <button className="toolbar-btn"style={{ cursor: 'default', opacity: 0.5 }} tabIndex={-1} aria-disabled="true">
                <img src={Texto} alt="Texto" />
            </button> {/*icone desativado*/}
            <button className="toolbar-btn" onClick={handleDesenharClick} style={{ border: drawMode ? '2px solid blue' : 'none' }}>
                <img src={Desenhar} alt="Desenhar" />
            </button>
            <button className="toolbar-btn" onClick={handleStickyNoteClick} style={{ border: stickyNoteMode ? '2px solid blue' : 'none' }}>
                <img src={StickyNote} alt="Sticky Note" />
            </button>
        </div>
    );
}

export default Toolbar;