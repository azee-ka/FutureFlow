import React, { useState, useEffect } from 'react';
import './home.css';
import StockGraph from '../graph/graph';


const FlowHome = () => {
    return (
        <div className='flow-home'>
            <div className='flow-home-navbar'>

            </div>
            <div className='flow-home-center'>
                <StockGraph />
            </div>
            <div className='flow-home-footer'>

            </div>
        </div>
    );
}

export default FlowHome;