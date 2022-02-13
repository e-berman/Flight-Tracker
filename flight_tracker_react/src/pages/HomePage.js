import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function HomePage() {

    const [departingAirport, setDepartingAirport] = useState('');
    const [arrivingAirport, setArrivingAirport] = useState('');
    const [departingDate, setDepartingDate] = useState('');
    const [arrivingDate, setArrivingDate] = useState('');

    // with React v6, navigate replaces useHistory
    const navigate = useNavigate();

    // creates an flight and adds to database
    const createFlight = async () => {
        const newFlight = { departingAirport, arrivingAirport, departingDate, arrivingDate};
        const response = await fetch('/', {
            method: 'POST', 
            body: JSON.stringify(newFlight),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // error handling with response status check
        if (response.status === 201) {
            alert('Successfully added the flight');
        } else {
            alert(`Failed to add the flight. Status code = ${response.status}`);
        }
        navigate('/results');
    }


    return (
        <>
            <div className="header">
                <h1>Flight Tracker App</h1>
            </div>
            <div>
                <select>
                    <option>One Way</option>
                    <option>Round Trip</option>
                </select>
            </div>
            <div>
                <label>
                    Departing Airport:
                    <input 
                        type='text'
                        placeholder='Enter Airport Abbreviation..'
                        value={departingAirport}
                        onChange={e => setDepartingAirport(e.target.value)}/>
                </label>
                <AiOutlineQuestionCircle />
            </div>
            <div>
                <label>
                    Arriving Airport:
                    <input
                        type='text'
                        placeholder='Enter Airport Abbreviation..'
                        value={arrivingAirport}
                        onChange={e => setArrivingAirport(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                    Departure Date: 
                    <input
                        type='date'
                        placeholder='Enter Airport Abbreviation..'
                        value={departingDate}
                        onChange={e => setDepartingDate(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                    Return Date: 
                    <input
                        type='date'
                        placeholder='Enter Airport Abbreviation..'
                        value={arrivingDate}
                        onChange={e => setArrivingDate(e.target.value)}/>
                </label>
            </div>
            <div>
                <button onClick={createFlight}>Generate</button>
            </div>

            
        </>
    );
}

export default HomePage;