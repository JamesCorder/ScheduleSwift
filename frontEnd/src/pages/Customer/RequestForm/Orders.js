import * as React from 'react';
import { getIP } from '../../..';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import { Navigate, useNavigate, useLocation, UNSAFE_DataRouterContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSlotProps } from '@mui/base';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Logo from '../Logo.png';
import EventIcon from '@mui/icons-material/Event';
import Title from './Title';
import {TableCell, Table, TableBody, TableRow} from '@mui/material';
import { Button, TextField, Grid, Typography, Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import { ValidatorForm } from 'react-material-ui-form-validator';

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    const box = [];
    const notesBox = [];
    const paymentBox = [];
    const receiptTypo = [];
    const { state } = useLocation();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [numReservableItems, setNumReservableItems] = useState([]);
    const [nameArray, setNameArray] = useState([]);
    const [minArray, setMinArray] = useState([]);
    const [maxArray, setMaxArray] = useState([]);
    const [availableArray, setAvailableArray] = useState([]);
    const [priceArray, setPriceArray] = useState([]);
    const [total, setTotal] = useState(0);
    const [numPeople, setNumPeople] = useState([]);
    const [maxNumPeople, setMaxNumPeople] = useState([]);
    const [availableNumPeople, setAvailableNumPeople] = useState([]);
    const [numArray, setNumArray] = useState([]);
    const [reservationID, setReservationID] = useState(null);
    const businessName = state.businessName;
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(null);
    const [exception, setException] = useState(-1);
    const [openTime, setOpenTime] = useState(Dayjs | null);
    const [closeTime, setCloseTime] = useState(Dayjs | null);
    const [closed, setClosed] = useState('');
    const [dates, setDates] = useState([]);
    const [MAXSTRING, setMAXSTRING] = useState(null);
    const [notes, setNotes] = useState([]);
    const [checked, setChecked] = useState(false);
    const [paymentRequire, setPaymentRequire] = useState("none");
    const [paymentValue, setPaymentValue] = useState(0);
    const [hasError, setHasError] = useState(false);
    const[open, setOpen] = React.useState(false);
    const [storedNumPeople, setStoredNumPeople] = useState(null);
    const [storedStartTime, setStoredStartTime] = useState(null);
    const [storedEndTime, setStoredEndTime] = useState(null);
    const [storedCurrentDate, setStoredCurrentDate] = useState(null);
    const [storedNumArray, setStoredNumArray] = useState([]);
    const _ = require('lodash');

    const handleOpen = (event) => {
        setHasError(false);
        if(!hasError) {
            setOpen(true);
            event.preventDefault();
        }

    }
    const handleClose = () => setOpen(false);
    const style={
        position: 'absolute',
        top: "50%",
        left: "50%",
        transform: 'translate(-50%,-50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    
    useEffect(() => {
        insertValues();
    }, [])

    function updatePayment() {
        let str = "";
        if (paymentRequire != "none") {
            if (paymentRequire.includes("deposit")) {
                str = `You are required to pay a deposit of `;
                if (paymentRequire.includes("Per")) {
                    str = str.concat(`at least ${paymentValue.toFixed(1)}%`);
                } else {
                    str = str.concat(`at least $${paymentValue.toFixed(2)}`);
                }
            } else if (paymentRequire.includes("require")) {
                str = `You are required to pay all the expenses up front.`
            } else {
                str = `You can any pay any amount at any time`
            }
            paymentBox.push(str);
        }
    }
    function updateNotesBox() {
        if (notesBox.length === 0 && notes.length > 0) {
            notesBox.push(<Title>Reservation Policies and Notes</Title>);
            notesBox.push(
            <Table size="small">
                <TableBody>
                    {notes.map((note, index) => (
                        <TableRow>
                            <TableCell><strong>{note.note}</strong></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>);
            notesBox.push(
                <Grid container><Checkbox required onChange={(e) => {setChecked(e.target.checked)}}/><p style={{color:"#98622E"}} component="h5" variant="h8">
                    *I Agree with all the policies set by the facility for their reservations.
                </p></Grid>
            );
        }
    }

    function getDates(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/getExceptionDates", {
            businessName: businessName
        }).then((result) => {
            setDates(result.data.result);
        })
    }

    function dayDiff(start, end) {
        var arg1 = new Date(start);
        var arg2 = new Date(end);
        return Math.abs(arg1 - arg2);
    }
    const validForm = () => {
        if (notesBox.length > 0 && !checked) {
            return false;
        }
        if (parseInt(numPeople) > parseInt(availableNumPeople) || parseInt(numPeople) <= 0 || numPeople === undefined) {
            return false;
        }
        let totReservables = 0;
        for (let i = 0; i < numReservableItems; i++) {
            console.log(numArray[i]);
            if (parseInt(numArray[i]) > parseInt(maxArray[i]) || parseInt(numArray[i]) < parseInt(minArray[i]) || numArray[i] === undefined) {
                return false;
            }
            totReservables += parseInt(numArray[i]);
            if (i === numReservableItems - 1 && totReservables === 0) {
                return false;
            }
        }
        if (currentDate === null || startTime === null || endTime === null) {
            return false;
        }
        let openHour = new Date((openTime[new Date(currentDate).getDay()])).getHours();
        let openMinute = new Date((openTime[new Date(currentDate).getDay()])).getMinutes();
        let closeHour = new Date((closeTime[new Date(currentDate).getDay()])).getHours();
        let closeMinute = new Date((closeTime[new Date(currentDate).getDay()])).getMinutes();
        if (exception >= 0) {
            openHour = new Date(dates[exception].startTime).getHours();
            openMinute = new Date(dates[exception].startTime).getMinutes();
            closeHour = new Date(dates[exception].endTime).getHours();
            closeMinute = new Date(dates[exception].endTime).getMinutes();
        }
        const startHour = new Date(startTime).getHours();
        const startMinute = new Date(startTime).getMinutes();
        if (startHour < openHour || (startHour === openHour && startMinute < openMinute)) {
            return false;
        }
        const endHour = new Date(endTime).getHours();
        const endMinute = new Date(endTime).getMinutes();
        if (endHour > closeHour || (closeHour === endHour && endMinute > closeMinute)) {
            return false;
        }
        if (startHour > endHour || (endHour === startHour && endMinute <= startMinute)) {
            return false;
        }
        return true;
    }

    function updateMaxString(availableNumPeople, nameArray, availableArray) {
        var string = `Max Party Size: ${availableNumPeople}`

        for (let i = 0; i < nameArray.length; i++) {
            string += `, Max ${nameArray[i]}: ${availableArray[i]}`; 
        }

        setMAXSTRING(string);
    }

    function timeDiff(start, end) {
        var arg1 = new Date(start);
        var arg2 = new Date(end);
        arg1.setDate((new Date(currentDate)).getDate());
        arg2.setDate((new Date(currentDate)).getDate());
        if (arg1.toString() === arg2.toString()) {
            return 0;
        }
        return arg1.getTime() - arg2.getTime();
    }

    function getConcurrent(date, start, end, maxNumPeople, maxArray, nameArray) {
        if (date == null || maxArray == null) {
            return;
        }
        var stringdate = "";
        if (date.$M) {
            var valArr = (new String(date)).split(" ");
            if (date.$M + 1 < 10) {
                stringdate = `${date.$y}-0${date.$M + 1}-${valArr[1]}`
            } else {
                stringdate = `${date.$y}-${date.$M + 1}-${valArr[1]}`
            }
        } else if (new String(date).includes("00:00:00")) {
            var valArr = (new String(date)).split(" ");
            if (new Date(date).getMonth() + 1 < 10) {
                stringdate = `${new Date(date).getFullYear()}-0${new Date(date).getMonth() + 1}-${valArr[2]}`
            } else {
                stringdate = `${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1}-${valArr[2]}`
            }
        } else {
            var day = date;
            if (new String(date).includes("T")) {
                day = new Date(date);
            } else if (new String(date).includes("00:00:00")) {
                new Date(`${date}T00:00`);
            }
            if (day.getMonth() + 1 < 10) {
                stringdate = `${day.getYear()}-0${day.getMonth() + 1}-`
            } else {
                stringdate = `${day.getFullYear()}-${day.getMonth() + 1}-`
            }
            if (parseInt(day.getDay()) < 10) {
                stringdate = stringdate.concat(`0${day.getDay()}`);
            } else {
                stringdate = stringdate.concat(`${day.getDay()}`);
            }
        }
        Axios.post("http://" + getIP() + ":3001/api/getMaxAvailable", {
            businessName: businessName,
            date: stringdate
        }).then((result) => {
            if (result.data.err) {
                console.log("There are no reservations that day.");
                setAvailableArray(maxArray);
                setAvailableNumPeople(maxNumPeople);
                updateMaxString(maxNumPeople, nameArray, maxArray);
            } else {
                result = result.data.result;
                var arrayInBlock = [...result];
                // BUILD LIST OF ALL CONCURRENT RESERVATIONS IN SLOT
                for (let i = 0; i < result.length; i++) {
                    if (result[i].isReserved && (result[i].ID != reservationID && result[i].ID != state.ID)) {
                        if ((timeDiff(start, result[i].endTime) < 0 && 
                        timeDiff(end, result[i].startTime) > 0) || 
                        (timeDiff(start, result[i].endTime) > 0 && 
                        timeDiff(end, result[i].startTime) < 0)) {
                            //continue
                        }
                        else {
                            arrayInBlock[i] = 0;
                        }
                    } else {
                        arrayInBlock[i] = 0;
                    }
                }

                // BY INCREMENTS OF 5 MINS FILL ARRAY OF AVAILABILITIES
                var temp = start;
                // console.log(new Date(temp + 1000000), end);
                // To improve time we could increase this value, 5 is the most accurate as increasing it would lose precision
                var interval = 5;
                var allAvailable = [];
                var allMaxPeople = [];
                while (timeDiff(new Date(temp), end) < 0) {
                    var next = new Date(temp).getTime() + interval * 60000;
                    let people = parseInt(maxNumPeople);
                    let available = [...maxArray];
                    for (let i = 0; i < arrayInBlock.length; i++) {
                        if (arrayInBlock[i] !== 0) {
                            if ((timeDiff(temp, result[i].endTime) < 0 && 
                            timeDiff(next, result[i].startTime) > 0) || 
                            (timeDiff(temp, result[i].endTime) > 0 && 
                            timeDiff(next, result[i].startTime) < 0)) {
                                var numReservable = result[i].numReservable.split(";");
                                for (let j = 0; j < numReservable.length; j++) {
                                    available[j] = available[j] - numReservable[j];
                                }
                                people = people - result[i].numPeople;
                            }
                        }
                    }
                    allAvailable.push(available);
                    allMaxPeople.push(people);
                    temp = next;
                }

                // PICK SMALLEST VALUE FOR EACH ITEM
                var endAvailable = [...maxArray];
                var endPeople = maxNumPeople;

                const numReservables = nameArray.length;
                for (let i = 0; i < allAvailable.length; i++) {
                    for (let j = 0; j < numReservables; j++) {
                        if (allAvailable[i][j] < endAvailable[j]) {
                            endAvailable[j] = allAvailable[i][j];
                        }
                    }
                    if (allMaxPeople[i] < endPeople) {
                        endPeople = allMaxPeople[i];
                    }
                }

                setAvailableArray(endAvailable);
                setAvailableNumPeople(parseInt(endPeople));
                updateMaxString(endPeople, nameArray, endAvailable);
            }
        })
    }

    function getNotes(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/reservationGetNotes", {
            businessName: state.businessName
        }).then((result) => {
            const notes = result.data.result;
            setNotes(notes);
        })
    }

    function calculateTotal(numReserve, price, num) {
        var tot = 0;
        for (let i = 0; i < numReserve; i++) {
            if (num[i]) {
                tot = tot + parseFloat(price[i]) * num[i];
            }
        }
        setTotal(tot.toFixed(2));
    }

    function insertValues() {
        let ReservedItems = "";
        let maxs = "";
        let maxPeople = 0;
        let prices = "";
        getNotes(props.businessName);
        Axios.post("http://" + getIP() + ":3001/api/getFacilitysData", {
            businessName: businessName
        }).then((result) => {
            if (result.data.err) {
                alert("Facility data missing!");
            } else {
                if (result.data.result[0].paymentRequire != "none") {
                    setPaymentRequire(result.data.result[0].paymentRequire);
                    setPaymentValue(parseFloat(result.data.result[0].paymentValue));
                } 
                getDates(businessName);
                // UPDATE NUM OF RESERVABLES
                if (!result.data.result[0].numReservable) {
                    setNumReservableItems(1);
                } else {
                    setNumReservableItems(parseInt(result.data.result[0].numReservable));
    
                    // UPDATE NUM OF RESERVABLES
                    maxPeople = result.data.result[0].numPeople;
                    setMaxNumPeople(maxPeople);
                    setAvailableNumPeople(maxPeople);
    
                    // UPDATE NAMES
                    ReservedItems = String(result.data.result[0].reservableItem).split(";");
                    setNameArray(ReservedItems);
                    
                    // UPDATE PRICES
                    prices = String(result.data.result[0].prices).split(";");
                    setPriceArray(prices);
    
                    // UPDATE MAXIMUMS
                    maxs = String(result.data.result[0].maxs).split(";");
                    setMaxArray(maxs);
                    setAvailableArray(maxs);
    
                    updateMaxString(maxPeople, ReservedItems, maxs)
    
                    // UPDATE MINIMUMS
                    let mins = String(result.data.result[0].mins).split(";");
                    setMinArray(mins);
    
                    let Sun = result.data.result[0].Sun;
                    let Mon = result.data.result[0].Mon;
                    let Tues = result.data.result[0].Tues;
                    let Wed = result.data.result[0].Wed;
                    let Thurs = result.data.result[0].Thurs;
                    let Fri = result.data.result[0].Fri;
                    let Sat = result.data.result[0].Sat;
                    let full = `${Sun};${Mon};${Tues};${Wed};${Thurs};${Fri};${Sat}`;
                    let val = full.split(';');
                    let closed = [];
                    let open = [];
                    let close = [];
                    for (let i = 0; i < 14; i++) {
                        if (i % 2 === 0) {
                            if (val[i] === 'null' || val[i] === "") {
                                closed.push(1);
                                open.push(currentDate);
                            } else {
                                closed.push(0);
                                open.push(val[i]);
                            }
                        } else {
                            if (val[i] === 'null' || val[i] === "") {
                                close.push(currentDate);
                            } else {
                                close.push(val[i]);
                            }
                        }
                    }
                    setClosed(closed);
                    setOpenTime(open);
                    setCloseTime(close);
                }
            }
        })
        if (state.ID) {
            setReservationID(state.ID);
            // getNumArray
            Axios.post("http://" + getIP() + ":3001/api/getReservation", {
                ID: state.ID
            }).then((result) => {
                // UPDATE numValues
                let numValues = String(result.data.result[0].numReservable).split(";");
                setNumArray(numValues);
                calculateTotal(numValues.length, prices, numValues)
                setNumPeople(result.data.result[0].numPeople);
                setStartTime(result.data.result[0].startTime);
                var date = new Date(`${result.data.result[0].reservationDate}T00:00`);
                Axios.post("http://" + getIP() + ":3001/api/getExceptionDates", {
                    businessName: state.businessName
                }).then((result) => {
                    const datesTemp = result.data.result;
                    for (let i = 0; i < datesTemp.length; i++) {
                        if (new Date(datesTemp[i].date + "T00:00").toString() === (new Date(date)).toString() && datesTemp[i].startTime !== "closed") {
                            setException(parseInt(i));
                            break;
                        } else {
                            setException(parseInt(-1)); 
                    }}
                })
                setEndTime(result.data.result[0].endTime);
                setCurrentDate(date);
                getConcurrent(date,
                    result.data.result[0].startTime, result.data.result[0].endTime, 
                    maxPeople, maxs, ReservedItems)
                setStoredNumPeople(result.data.result[0].numPeople);
                setStoredStartTime(result.data.result[0].startTime);
                setStoredEndTime(result.data.result[0].endTime);
                setStoredNumArray(numValues);
                setStoredCurrentDate(date);
            })
        } else {
            getConcurrent(null, null, null, null, maxPeople, maxs, ReservedItems)
        }
    }

    function makeBox(max) {
        for (let element = 1; element <= numReservableItems; element++) {
            // Then the code pushes each time it loops to the empty array I initiated.
            // alert(minArray[element - 1]);
            box.push(
                <Grid container spacing={2}>
                    <Grid  item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        name={'Reserved' + element}
                        label={'Reserved ' + element}
                        type={element}
                        id={element}
                        value={nameArray[element - 1]}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    </Grid>
                    <Grid  item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        name={'Price' + element}
                        label={'Price ' + element}
                        id={element}
                        value={`$${priceArray[element - 1]}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    </Grid>
                    <Grid  item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        name={'Value' + element}
                        label={'# of Units '}
                        type="number"
                        id={element}
                        InputProps={{ inputProps: { min: minArray[element - 1], max: maxArray[element - 1], step: 1
                        } } }
                        value={numArray[element - 1]}
                        onChange={(newValue) => { 
                            let newArr = [...numArray];
                            newArr[element - 1] = (newValue.target.value !== ""?newValue.target.value:"0");
                            setNumArray(newArr);
                            calculateTotal(priceArray.length, priceArray, newArr);
                        }}
                    />
                    </Grid>
                </Grid>
            );
            }
    }
    function makeReceipt() {
        let tot = 0;
        for (let i = 0; i < numReservableItems; i++) {
            tot = tot + numArray[i];
        }
        if (tot === 0) {
            alert('Need to reserve at least one item');
            return;
        }
        let ReservedItems = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (ReservedItems === "") {
                ReservedItems = ReservedItems.concat(nameArray[element]);
            } else {
                ReservedItems = ReservedItems.concat(";", nameArray[element]);
            }
        }
        let prices = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (prices === "") {
                prices = prices.concat(priceArray[element]);
            } else {
                prices = prices.concat(";", priceArray[element]);
            }
        }
        let numReserved = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (numReserved === "") {
                numReserved = numReserved.concat(numArray[element]);
            } else {
                numReserved = numReserved.concat(";", numArray[element]);
            }
        }
        const reservedItemsSplit = ReservedItems.split(";");
        const numberReservedSplit = numReserved.split(";");
        const pricesSplit = prices.split(";");
        for (let i = 0; i < reservedItemsSplit.length; i++) {
            receiptTypo.push(
                <div>
                <Typography id='modal-modal-description'><pre>{reservedItemsSplit[i]}: </pre></Typography>
                <Typography id='modal-modal-description'><pre>     Quantity Reserved: {numberReservedSplit[i]}</pre></Typography>
                <Typography id='modal-modal-description'><pre>     Price: ${pricesSplit[i]}/unit</pre></Typography>
                </div>
            )
        }


    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let tot = 0;
        for (let i = 0; i < numReservableItems; i++) {
            tot = tot + numArray[i];
        }
        if (tot === 0) {
            alert('Need to reserve at least one item');
            return;
        }
        let ReservedItems = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (ReservedItems === "") {
                ReservedItems = ReservedItems.concat(nameArray[element]);
            } else {
                ReservedItems = ReservedItems.concat(";", nameArray[element]);
            }
        }
        let prices = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (prices === "") {
                prices = prices.concat(priceArray[element]);
            } else {
                prices = prices.concat(";", priceArray[element]);
            }
        }
        let numReserved = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (numReserved === "") {
                numReserved = numReserved.concat(numArray[element]);
            } else {
                numReserved = numReserved.concat(";", numArray[element]);
            }
        }
        if (!reservationID) {
            Axios.post("http://" + getIP() + ":3001/api/createReservation", {
                businessName: businessName,
                reservationDate: currentDate,
                reservable: ReservedItems,
                price: prices,
                startTime: startTime,
                endTime: endTime,
                reservedBy: state.username,
                numPeople: numPeople,
                numReservable: numReserved,
                
            }).then((result) => {
                setReservationID(result.data.id);
                alert(`Your reservation has been saved!\nAn confirmation email has been sent to you containing your Reservation ID and reservation details.`);
                setOpen(false);
                setStoredNumArray(numArray);
                setStoredCurrentDate(currentDate);
                setStoredNumPeople(numPeople);
                setStoredStartTime(startTime);
                setStoredEndTime(endTime);
            })
        } else {
            // UPDATE RESERVATION INSTEAD
            if (new Date(currentDate).getTime() === new Date(storedCurrentDate).getTime() && new Date(startTime).getTime() === new Date(storedStartTime).getTime() &&
            new Date(endTime).getTime() === new Date(storedEndTime).getTime() && parseInt(numPeople) === parseInt(storedNumPeople) && (numArray.join() === storedNumArray.join())) {
                    alert("Please modify the reservation before submitting the form.");
            } else {
                Axios.post("http://" + getIP() + ":3001/api/updateReservation", {
                    ID: reservationID,
                    businessName: businessName,
                    reservationDate: currentDate,
                    reservable: ReservedItems,
                    price: prices,
                    startTime: startTime,
                    endTime: endTime,
                    reservedBy: state.username,
                    numPeople: numPeople,
                    numReservable: numReserved
                }).then((result) => {
                    alert(`Your reservation has been updated!\nAn confirmation email has been sent to you containing your Reservation ID and updated reservation details.`);
                    setOpen(false);
                })
                setStoredNumArray(numArray);
                setStoredCurrentDate(currentDate);
                setStoredNumPeople(numPeople);
                setStoredStartTime(startTime);
                setStoredEndTime(endTime);
            }
        }
    }

    if (MAXSTRING) {
    return (
        <React.Fragment>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <EventIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {businessName} Reservation Request Form
                </Typography>
                <Typography style={{color:"#98622E"}} component="h5" variant="h8">
                    * Prices are assigned per unit of reservable item.
                </Typography>
                <Typography style={{color:"#98622E"}} component="h5" variant="h8">
                    * Remaining reservable units are:
                </Typography>
                <Typography style={{color:"#98402E"}} component="h5" variant="h10">
                    {MAXSTRING}
                </Typography>
                <Typography component="p" variant="p" fontWeight="bold">
                    Reservation ID: #{reservationID}
                </Typography>
                <Box component="form" id='my-form' validate="true" sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="business"
                                fullWidth
                                id="business"
                                label="Business"
                                defaultValue={businessName}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="reservationDate"
                                    label="Select Date"
                                    validate="true"
                                    value={currentDate}
                                    InputProps={{ onKeyDown: (event) => { event.preventDefault();} } }
                                    onChange={(newValue) => {setCurrentDate(newValue); 
                                        getConcurrent(newValue, startTime, endTime, maxNumPeople, maxArray, nameArray);
                                        for (let i = 0; i < dates.length; i++) {
                                            if ((new Date(dates[i].date + "T00:00").toString() === (new Date(newValue)).toString() && dates[i].startTime !== "closed")) {
                                                setException(parseInt(i));
                                                break;
                                            } else {
                                                setException(parseInt(-1)); 
                                            }}
                                    }}
                                    renderInput={(params) => <TextField {...params}/>}
                                    shouldDisableDate={(date) => {
                                        for (let i = 0; i < dates.length; i++) {
                                            if (new Date(dates[i].date + "T00:00").toString() === date.$d.toString() && dates[i].startTime === "closed") {
                                                return true;
                                            }
                                            else if (new Date(dates[i].date + "T00:00").toString() === date.$d.toString()) {
                                                return false;
                                            }
                                        }
                                        if (closed[new Date(date).getDay()] || date < new Date()) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Start Time"
                                    value={startTime}
                                    fullWidth
                                    InputProps={{ onKeyDown: (event) => { event.preventDefault();} } }
                                    onChange={(newValue) => { setStartTime(newValue);
                                        getConcurrent(currentDate, newValue, endTime, maxNumPeople, maxArray, nameArray) }}
                                    renderInput={(params) => <TextField {...params} required/>}
                                    shouldDisableTime={(timeValue, clockType) => {
                                        let openHour = new Date((openTime[new Date(currentDate).getDay()])).getHours();
                                        let openMinute = new Date((openTime[new Date(currentDate).getDay()])).getMinutes();
                                        let closeHour = new Date((closeTime[new Date(currentDate).getDay()])).getHours();
                                        let closeMinute = new Date((closeTime[new Date(currentDate).getDay()])).getMinutes();
                                        if (exception >= 0) {
                                            openHour = new Date(dates[exception].startTime).getHours();
                                            openMinute = new Date(dates[exception].startTime).getMinutes();
                                            closeHour = new Date(dates[exception].endTime).getHours();
                                            closeMinute = new Date(dates[exception].endTime).getMinutes();
                                        }
                                        if ((clockType === 'hours' && timeValue < openHour) || (clockType === 'hours' && timeValue >= closeHour && closeMinute === 0) || 
                                        (clockType === 'hours' && timeValue > closeHour && closeMinute > 0)) {
                                            return true;
                                        }
                                    if (((new Date(startTime).getHours()) === openHour && clockType === 'minutes' && timeValue < openMinute)
                                        || ((new Date(startTime).getHours()) === closeHour && clockType === 'minutes' && timeValue >= closeMinute)) {
                                            return true;
                                        }
                                    if (clockType === 'minutes' && timeValue % 5) {
                                            return true;
                                        }
                                    return false;
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="End Time"
                                    value={endTime}
                                    fullWidth
                                    InputProps={{ onKeyDown: (event) => { event.preventDefault();} } }
                                    onChange={(newValue) => { setEndTime(newValue); 
                                        getConcurrent(currentDate, startTime, newValue, maxNumPeople, maxArray, nameArray) }}
                                    renderInput={(params) => <TextField {...params} required />}
                                    shouldDisableTime={(timeValue, clockType) => {
                                        let openHour = new Date((openTime[new Date(currentDate).getDay()])).getHours()
                                        let openMinute = new Date((openTime[new Date(currentDate).getDay()])).getMinutes()
                                        let closeHour = new Date((closeTime[new Date(currentDate).getDay()])).getHours()
                                        let closeMinute = new Date((closeTime[new Date(currentDate).getDay()])).getMinutes()
                                        if (exception >= 0) {
                                            openHour = new Date(dates[exception].startTime).getHours();
                                            openMinute = new Date(dates[exception].startTime).getMinutes();
                                            closeHour = new Date(dates[exception].endTime).getHours();
                                            closeMinute = new Date(dates[exception].endTime).getMinutes();
                                        }
                                        if ((clockType === 'hours' && timeValue < openHour) || 
                                            (clockType === 'hours' && timeValue > closeHour)) {
                                                return true;
                                            }
                                        if ((clockType === 'minutes' && (new Date(endTime).getHours()) === openHour && timeValue <= openMinute)
                                            || ((new Date(endTime).getHours()) === closeHour && clockType === 'minutes' && timeValue > closeMinute)) {
                                                return true;
                                            }
                                        if ((clockType === 'hours' && timeValue < (new Date(startTime).getHours()))
                                            || ((new Date(startTime).getHours()) === (new Date(endTime).getHours()) && 
                                                clockType === 'minutes' && timeValue <= (new Date(startTime).getMinutes()) )) {
                                                return true;
                                            }
                                        if (clockType === 'minutes' && timeValue % 5) {
                                                return true;
                                            }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    name="numPeople"
                                    label="Party Size"
                                    type="number"
                                    id="numPeople"
                                    InputProps={{ inputProps: { max: availableNumPeople,  min: 1, step: 1 } }}
                                    value={numPeople}
                                    onChange={(newValue) => { 
                                        setNumPeople(newValue.target.value===""?parseInt(0):parseInt(newValue.target.value));
                                        getConcurrent(currentDate, startTime, endTime, maxNumPeople, maxArray, nameArray);
                                    }}
                                />
                            </Grid>
                        {/* And here I render the box array */}
                            {/* There is going to be a max of 10 items */}
                            {makeBox(availableArray)}
                            <Grid item xs={12} sm={6}>
                                {box[0]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[1]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[2]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[3]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[4]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[5]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[6]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[7]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[8]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[9]}
                            </Grid>
                    </Grid>
                    {updatePayment()}
                    <Typography component="p" variant="p">
                        Total: ${parseFloat(total).toFixed(2)} {paymentBox[0]}
                    </Typography>
                    <br></br>
                    {updateNotesBox()}
                    {notesBox[0]}
                    {notesBox[1]}
                    {notesBox[2]}
                    <Button
                        form='my-form'
                        type='submit'
                        disabled={ (validForm() && !(new Date(currentDate).getTime() === new Date(storedCurrentDate).getTime() && new Date(startTime).getTime() === new Date(storedStartTime).getTime() &&
                            new Date(endTime).getTime() === new Date(storedEndTime).getTime() && parseInt(numPeople) === parseInt(storedNumPeople) && (_.isEqual(numArray, storedNumArray)))) ? false : true}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleOpen}
                    >
                        Save
                    </Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        disableEscapeKeyDown
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                    >
                    <Box sx={style}>
                        {makeReceipt()}
                        <Typography id="modal-modal-title" align="center">Itemized Receipt</Typography>
                        <Grid item xs={12} sm={6}>
                                {receiptTypo[0]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[1]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[2]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[3]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[4]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[5]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[6]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[7]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[8]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {receiptTypo[9]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography id="modal-modal-description"><pre>Total: ${total}</pre></Typography>
                            </Grid>
                        <Button align="center" onClick={handleClose}>Cancel</Button>
                        <Button align="center" form='my-form' onClick={handleSubmit}>Submit</Button>
                    </Box>
                    </Modal>
                </Box>
            </Box>
        </React.Fragment>
    );
    } else {
        return(
            <React.Fragment>
                Awaiting results or the reservation form for {businessName} is still unformatted.
            </React.Fragment>);
    }
}