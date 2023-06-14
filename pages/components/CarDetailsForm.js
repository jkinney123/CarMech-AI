import React from 'react';

const CarDetailsForm = ({ onDetailsSubmit }) => {
    const [make, setMake] = React.useState('');
    const [model, setModel] = React.useState('');
    const [year, setYear] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onDetailsSubmit({ make, model, year });
    };

    return (
        <div className="car-details-form">
            <form onSubmit={handleSubmit}>
                <label>
                    Car Make:
                    <input type="text" value={make} onChange={e => setMake(e.target.value)} />
                </label>
                <label>
                    Car Model:
                    <input type="text" value={model} onChange={e => setModel(e.target.value)} />
                </label>
                <label>
                    Year:
                    <input type="text" value={year} onChange={e => setYear(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default CarDetailsForm;
