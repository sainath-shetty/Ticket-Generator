import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';

const NumberToText = () => {
    const [isLoading, setisLoading] = useState(false);
    const [text, setText] = useState("");
    const [time, setTime] = useState("");
    const [now, setCurrTime] = useState("");
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState("");
    const [charge, setCharge] = useState("");
    const [numplate, setNumPlate] = useState("");
    const handleClick = () => {
        setisLoading(true);
        Tesseract.recognize(
            image,
            'eng',
            {
                logger: m => {
                    console.log(m);
                    if (m.status === 'recognizing text') {
                        const progress = parseInt(m.progress * 100);
                        console.log('Progress:', progress);
                        setProgress(progress);
                    }
                }
            }
        ).then(({ data: { text } }) => {
            setText(text);
            setisLoading(false);
            sendRequest(text); // Send request only after text is recognized
        });
    };
    let enteredTime = 0;

    const sendRequest = async (recognizedText) => {
        try {
            const response = await axios.post("http://localhost:5000/vehicle/enter", { numPlate: recognizedText, enterTime: new Date().toString() });
            if (response.data.timeEntered) {
                // enteredTime = response.data.timeEntered;
                // setTime(response.data.timeEntered);
                // const date = new Date(response.data.timeEntered * 1000);
                // date.setUTCHours(date.getUTCHours() + 5);
                // date.setUTCMinutes(date.getUTCMinutes() + 30);
                console.log("Inside if sendReq");
                setNumPlate(response.data.numPlate);
                const date1 = (new Date());
                setCurrTime(date1.toString());
                //converting string stored in database into dateformat
                const date2 = new Date(response.data.timeEntered);
                setTime(response.data.timeEntered);
                const difference = date1 - date2;
                const durationInHours = difference / (1000 * 60);
                // const parkingcharge = 10;

                setCharge(durationInHours > 60 ? 20 * durationInHours : 10);

                setDuration(durationInHours.toString());
                // console.log(formattedTime);
                // setTime((new Date().getTime() - enteredTime) / (1000 * 60 * 60));
                // setTime(enteredTime);


            }


        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='container' style={{ height: "100vh", width: "100%" }}>
            <div className='row h-100'>
                <div className='col-md-5 mx-auto d-flex flex-column align-items-center' >
                    {!isLoading && <h1 className="mt-5 mb-4 pb-5 ">Parking </h1>}
                    {/*form*/}
                    {
                        !isLoading && !text &&
                        <>
                            <input type="file" className='form-control mt-5' onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}></input>
                            <input type="button" className='form-control btn btn-primary at-4 mt-3' value="Convert" onClick={handleClick} />
                        </>
                    }
                    {/*progressbar*/}
                    {
                        isLoading && (
                            <>
                                <p className='text-center mt-5'> Converting :- {progress}%</p>
                                <progress className="form-control mt-5" value={progress} max="100">
                                    {progress}%{' '}
                                </progress>{' '}
                            </>
                        )
                    }
                    {/*text area*/}
                    {
                        !isLoading && text &&
                        (
                            <h1>
                                {time === "" ? "No. plate registered" :
                                    <>
                                        <div className="card" style={{ width: "100%" }}>
                                            <img src="https://media.istockphoto.com/id/1464242685/vector/parking-ticket-for-car-paper-receipt-in-pay-machine-on-exit-pos-terminal-before-barrier-for.jpg?s=612x612&w=0&k=20&c=H-n1MfDVo_XmNs0mxl1rIwgP8HS8kdLt3xEgbb1BsfU=" className="card-img-top" alt="..." />
                                            <div className="card-body">
                                                <h2 className="card-title">Parking Bill</h2>
                                                <h4 className="card-text">DETAILS</h4>
                                            </div>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">Vehicle No.:
                                                    <h4 className="card-text">{`${numplate}"`}</h4>
                                                </li>
                                                <li className="list-group-item">Entered Time:
                                                    <h4 className="card-text">{time}</h4>
                                                </li>
                                                <li className="list-group-item">Exit Time:
                                                    <h4 className="card-text">{now}</h4></li>
                                                <li className="list-group-item">Parking Duration(in min):
                                                    <h4 className="card-text">{duration}</h4> </li>
                                                <li className="list-group-item">within 1 hour:
                                                    <h4 className="card-text">Rs 10</h4> </li>
                                                <li className="list-group-item">Amount/hour(more than 1 hr):
                                                    <h4 className="card-text">Rs 20</h4> </li>
                                                <li className="list-group-item">Amount:
                                                    <h4 className="card-text">{charge}</h4> </li>

                                            </ul>
                                            <div className="card-body">

                                                <a href="#" className="card-link center">Print</a>

                                            </div>
                                        </div>
                                    </>


                                }
                            </h1>
                        )

                    }
                    {
                        !isLoading && text &&
                        (
                            <h1>
                                Generate ticket
                            </h1>)

                    }
                </div>
            </div>
        </div>
    );
};

export default NumberToText;
