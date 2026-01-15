import React from 'react';
import { Rnd } from 'react-rnd';

const OverlayLayer = ({ overlays, onUpdate, onDelete }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none', // Let clicks pass through to video controls if not on overlay
                overflow: 'hidden'
            }}
        >
            {overlays.map((overlay) => (
                <Rnd
                    key={overlay.id}
                    size={{ width: overlay.width, height: overlay.height }}
                    position={{ x: overlay.x, y: overlay.y }}
                    onDragStop={(e, d) => {
                        onUpdate(overlay.id, { x: d.x, y: d.y });
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        onUpdate(overlay.id, {
                            width: parseInt(ref.style.width, 10),
                            height: parseInt(ref.style.height, 10),
                            ...position,
                        });
                    }}
                    bounds="parent"
                    style={{
                        pointerEvents: 'auto', // Re-enable pointer events for the overlays
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        userSelect: 'none'
                    }}
                >
                    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                        {/* Delete Button (visible on hover could be better, but keeping simple) */}
                        <button
                            onClick={() => onDelete(overlay.id)}
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#ff4444',
                                border: '2px solid white',
                                color: 'white',
                                zIndex: 10,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            X
                        </button>

                        {/* Content */}
                        {overlay.type === 'image' ? (
                            <img
                                src={overlay.content}
                                alt="overlay"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                            />
                        ) : (
                            <span style={{ pointerEvents: 'none', padding: '10px' }}>{overlay.content}</span>
                        )}
                    </div>
                </Rnd>
            ))}
        </div>
    );
};

export default OverlayLayer;
