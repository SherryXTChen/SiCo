import React from 'react';

const InstructionList = ({ numTryOnLeft, handleNextPage }) => {
    const style = {
        position: 'fixed',
        top: 0,
        right: 0,
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
    };

    return (
        <div style={style}>
            <h2>Instructions:</h2>
            <ol style={{ justifyContent: 'left', paddingLeft: '20px', paddingRight: '20px' }}>
                <li>Pick a garment and size</li>
                {numTryOnLeft > 0 && (<li>Try on <b>{numTryOnLeft}</b> more garments</li>)}
                {numTryOnLeft <= 0 && (<div>
                    <li>Try on more garments</li>
                    <li>Continue when ready</li>
                </div>)}
            </ol>
            {numTryOnLeft <= 0 && (<button className="done-button" id="nextPageButton"
                style={{ justifyContent: 'center', width: '100%' }}
                onClick={() => {
                    handleNextPage();
                }}
            >Continue</button>)}
        </div>
    );
};

export default InstructionList;