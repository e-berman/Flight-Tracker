import React from "react";
import { Link } from 'react-router-dom';

function ResultsPage() {

    return (
        <>
            <div className="header">
                <h1>Results Page</h1>
            </div>
            <div>
                <button>Send To Email</button>
            </div>
            <div>
                <Link to='/'>Search Again</Link>
            </div>            
        </>
    );
}

export default ResultsPage;