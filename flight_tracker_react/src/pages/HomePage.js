import React from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

function HomePage() {

    return (
        <>
            <div className="header">
                <h1>Flight Tracker App</h1>
            </div>
            <div>
                <input type='text' placeholder='Enter Airport Name..'/>
                <AiOutlineQuestionCircle />
            </div>
            <div>
                <label>
                    Departure Date: 
                    <input type='date'/>
                </label>
            </div>
            <div>
                <label>
                    Return Date: 
                    <input type='date'/>
                </label>
            </div>
            <div>
                <button>Generate</button>
            </div>

            
        </>
    );
}

export default HomePage;