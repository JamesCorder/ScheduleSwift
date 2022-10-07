import React, { Component } from 'react';
export default class MakeReservation extends Component {
    render() {
        return (
            <form className="reservation-form">
                <div className="form-header">
                    <h1>Reservation Form</h1>
                    <h2>[Business Name]</h2>
                    <h3>[Name of Reservation/Event]</h3>
                </div>
                {/* First Name and Last Name Fields */}
                <div className="form-body">
                    <div className="horizontal-group">
                        <div className="form-group left">
                            <label for="firstname" className="label-title">First Name</label>
                            <input 
                                type="text"
                                className="form-input" 
                                id="firstname"
                                placeholder="Enter Your First Name" 
                                required="required"
                            />
                        </div>
                        <div className="form-group right">
                            <label for="lastname" className="label-title">Last Name</label>
                            <input
                                type="text"
                                className="form-input"
                                id="lastname"
                                placeholder="Enter Your Last Name"
                                requried="required"
                            />   
                        </div>
                    </div>

                    {/* Email and Phone Number Fields */}
                    <div className="horizontal-group">
                        <div className="form-group left">
                            <label for="email" className="label-title">Email</label>
                            <input
                                type="email"
                                className="form-input-email"
                                id="email"
                                placeholder="email@example.com"
                                required="required"
                            />
                        </div>
                        <div className="form-group right">
                            <label for="phone" className="label-title">Phone Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                id="phone"
                                placeholder="XXX-XXX-XXXX"
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                required="required"
                            />
                        </div>
                    </div>

                    {/* Date and Time Fields */}
                    <div className="horizontal-group">
                        <div className="form-group left">
                            <label for="date" className="label-title">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                id="date"
                                required="required"
                            />
                        </div>
                        <div className="form-group right">
                            <label for="time" className="label-title">Time</label>
                            <div className="two-column">
                                <input
                                    type="time"
                                    className="form-input"
                                    id="starttime"
                                    required="required"
                                />
                                <div className="divider"></div>
                                <label for="endtime" className="label-title">to</label>
                                <div className="divider"></div>
                                <input
                                    type="time"                                        className="form-input"
                                    id="endtime"
                                    required="required"
                                />                                    
                            </div>
                        </div>
                    </div>
                    
                    {/* Item Fields */}
                    <div className="horizontal-group">
                        <div className="form-group left">
                            <div className="two-column">
                                <label for="item1" className="label-title">Number Of Item #1:</label>
                                <div className="divider"></div>
                                <input
                                    type="number"
                                    className="form-input-item"
                                    id="item1"
                                    min="0"
                                    max="10"
                                />
                            </div>
                        </div>
                        <div className="form-group right">
                            <label for="item2" className="label-title">Number Of Item #2:</label>
                            <div className="divider"></div>
                            <input
                                type="text"
                                className="form-input-item"
                                id="item2"
                                min="0"
                                max="10"
                            />
                        </div>
                    </div>

                    {/* Additional Information Field */}
                    <div className="form-group">
                        <label for="additionalinfo" className="label-title">Additional Information</label>
                        <textarea
                            rows="4"
                            cols="50"
                            className="form-input"
                            id="additionalinfo"
                            placeholder="Please include any important additional information about your reservation here."
                        />
                    </div>

                    {/* Reservation Notification Options */}
                    <label className="label-title">Please select your preferred method of communication for receiving notifications and reminders about this reservation.</label>
                    <div className="input-group">
                        <input
                            type="radio"
                            className="input-group-input"
                            name="communication"
                            id="option1"
                            value="email"
                            required="required"
                        />
                        <label className="input-group-label">Email</label>
                    </div>
                    <div className="input-group">
                    <input
                            type="radio"
                            className="input-group-input"
                            name="communication"
                            id="option2"
                            value="txtmessage"
                            required="required"
                        />
                        <label className="input-group-label">Text Message</label>
                    </div>
                    <br></br>

                    {/* Make Reservation and Cancel Buttons */}
                    <div class="form-footer">
                        <center>
                            <button type="submit" className="btn">Make Reservation</button>
                            <div className="divider"/>
                            <button type="submit" className="btn">Cancel</button>
                        </center>
                    </div>
                </div>
        </form>
        ) 
    }
}