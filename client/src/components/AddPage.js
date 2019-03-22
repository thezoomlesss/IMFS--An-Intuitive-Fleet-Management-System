import React, { Component } from 'react';
import './../css/App.css';
import './../css/bootstrap.css';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withSnackbar } from 'notistack';
import Cookies from 'universal-cookie';
import TextField from '@material-ui/core/TextField';
const cookies = new Cookies();

var moment = require('moment');//  18/03/2019 13:35:42 PM

var cID;
class AddPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            region_name: '',
            country: '',
            main_county: '',
            regionSelect: 'none',
            vehicleSelect: 'none',
            availableRegions: null,
            availableVehicles: null,
            availableWarehouses: null,
            firstThirdHeight: 1,
            secondThirdHeight: 1,
            new_warehouse_name: '',
            capacity: '',
            latitude: '',
            longitude: '',
            country_code: '',
            area_code: '',
            phone_num: '',
            contact_email: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmitRegion = this.onSubmitRegion.bind(this);
        this.refreshRegions = this.refreshRegions.bind(this);
        this.refreshWarehouses = this.refreshWarehouses.bind(this);
        this.onSubmitWarehouse = this.onSubmitWarehouse.bind(this);
        this.onSubmitTransport = this.onSubmitTransport.bind(this);
        this.refreshVehicles = this.refreshVehicles.bind(this);


    }
    componentDidMount() {
        this.setState({

            regionSelect: 'none',
            SourceWarehouseSelect: 'none',
            DestWarehouseSelect: 'none',
            departureTime: 'none',
            arrivalTime: 'none',
            vehicleSelect: 'none',

        });
        cID = cookies.get('cID');

        this.refreshRegions();
        this.refreshWarehouses();
        this.refreshVehicles();
        var firstThirdHeightVal = this.refs.firstThird.clientHeight;
        var secondThirdHeightVal = this.refs.secondThird.clientHeight;
        console.log(firstThirdHeightVal + " " + secondThirdHeightVal)
        if (firstThirdHeightVal > secondThirdHeightVal) {
            secondThirdHeightVal = firstThirdHeightVal;
        } else {
            firstThirdHeightVal = secondThirdHeightVal;
        }
        this.refs.secondThird.style.Height = firstThirdHeightVal + 'px';
        this.refs.firstThird.style.Height = firstThirdHeightVal + 'px';
        this.setState({
            firstThirdHeight: firstThirdHeightVal,
            secondThirdHeight: secondThirdHeightVal,
        });



    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    onSubmitRegion(event) {
        event.preventDefault();
        if (this.state && this.state.region_name && this.state.country && this.state.main_county) {
            if (this.state.region_name.trim() !== "" && this.state.country.trim() !== "" && this.state.main_county.trim() !== "") {

                fetch('/putRegion?cid=1&region_name=' + this.state.region_name + '&region_country=' + this.state.country + '&region_county=' + this.state.main_county, { method: 'PUT' })
                    .then(res => res.status === 200 ?
                        (this.props.enqueueSnackbar('New region created.', { variant: 'success' }),
                            this.refreshRegions())
                        : this.props.enqueueSnackbar('Could not create a new region', { variant: 'error' }));

            }
        } else {
            this.props.enqueueSnackbar('Not enough details given to create a region', { variant: 'warning' });
        }
    }
    onSubmitWarehouse(event) {
        event.preventDefault();
        if (this.state.capacity && this.state.latitude && this.state.longitude &&
            this.state.country_code && this.state.area_code && this.state.phone_num &&
            this.state.contact_email && this.state.regionSelect) {
            if (this.state.capacity.trim() !== "" && this.state.latitude.trim() !== "" && this.state.longitude.trim() !== "" &&
                this.state.country_code.trim() !== "" && this.state.area_code.trim() !== "" && this.state.phone_num.trim() !== "" &&
                this.state.contact_email.trim() !== "" && this.state.regionSelect.trim() !== "") {
                fetch('/putWarehouse?cid=' + cID + '&name=' + this.state.new_warehouse_name + '&cap=' + this.state.capacity +
                    '&lat=' + this.state.latitude + '&long=' + this.state.longitude +
                    '&code1=' + this.state.country_code + '&code2=' + this.state.area_code +
                    '&phone=' + this.state.phone_num + '&email=' + this.state.contact_email + '&region_name=' + this.state.regionSelect
                    , { method: 'PUT' })
                    .then(res => res.status === 200 ?
                        (this.props.enqueueSnackbar('New warehouse created.', { variant: 'success' }),
                            this.refreshWarehouses())
                        : this.props.enqueueSnackbar('Could not create a new warehouse', { variant: 'error' }));
            }
        } else {
            this.props.enqueueSnackbar('Not enough details given to create a warehouse.', { variant: 'warning' });
        }
    }
    onSubmitTransport(event) {
        event.preventDefault();
        if (this.state && this.state.vehicleSelect && this.state.SourceWarehouseSelect && this.state.DestWarehouseSelect) {
            if (this.state.vehicleSelect !=="none" && this.state.SourceWarehouseSelect !== "none" && this.state.DestWarehouseSelect !== "none" && this.state.departureTime !== "none") {
                if (this.state.SourceWarehouseSelect !== this.state.DestWarehouseSelect) {
                    alert(this.state.departureTime);
                } else {
                    this.props.enqueueSnackbar('The source and destination warehouse can\'t be the same', { variant: 'warning' })
                }
            } else {
                this.props.enqueueSnackbar('You must fill all required fields', { variant: 'warning' })
            }
            // alert(this.state.SourceWarehouseSelect + ' ' +this.state.DestWarehouseSelect);
        }
    }
    refreshRegions() {
        fetch('/getRegions?cid=1')
            .then(res => res.json())
            .then(regions => this.setState({ availableRegions: regions }));
    }
    refreshWarehouses() {

        fetch('/getwarehouses?cid=' + cID)
            .then(res => res.json())
            .then(warehouses => this.setState({ availableWarehouses: warehouses }));
    }
    refreshVehicles(){
        fetch('/getTransports/vehicles?cid=' + cID)
            .then(res => res.json())
            .then(vehicles => this.setState({ availableVehicles: vehicles }));
    }
    render() {
        // if (this.state === null || this.state === undefined) {
        // return null;
        {

            return (
                <div>
                    {/* Add Warehouse */}
                    <Grow in={true} {...(true ? { timeout: 1700 } : {})}>
                        <div ref="firstThird" className="half-page-paper-holder third-page-paper">
                            <Paper className="paper addPaper">
                                <Typography component="h1" variant="h5">
                                    Add a new warehouse
                                </Typography>

                                <form className="addVehForm">

                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="number">Warehouse Name</InputLabel>
                                        <Input id="new_warehouse_name" name="new_warehouse_name" autoComplete="new_warehouse_name" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="number">Capacity</InputLabel>
                                        <Input id="capacity" name="capacity" autoComplete="capacity" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="text">Latitude</InputLabel>
                                        <Input id="latitude" name="latitude" autoComplete="latitude" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="text">Longitude</InputLabel>
                                        <Input id="longitude" name="longitude" autoComplete="longitude" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="number">Country Code</InputLabel>
                                        <Input id="country_code" name="country_code" autoComplete="country_code" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="text">Area Code</InputLabel>
                                        <Input id="area_code" name="area_code" autoComplete="area_code" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="text">Phone Number</InputLabel>
                                        <Input id="phone_num" name="phone_num" autoComplete="phone_num" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="number">Contact Email</InputLabel>
                                        <Input id="contact_email" name="contact_email" autoComplete="contact_email" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="selectForm">
                                        <InputLabel  >Region</InputLabel>
                                        {this.state && this.state.regionSelect ? <Select
                                            value={this.state.regionSelect}
                                            onChange={this.handleChange}
                                            name="regionSelect"
                                            inputProps={{
                                                name: 'regionSelect',
                                                id: 'region-simple',
                                            }}
                                        >
                                            {this.state && this.state.availableRegions ?
                                                this.state.availableRegions.map((text, index) => (
                                                    <MenuItem key={index} value={text['region_name']}>{text['region_name']}</MenuItem>
                                                ))
                                                : null}
                                        </Select> : null}
                                    </FormControl>
                                    <div className="addPageButtonContainer">
                                        <Button
                                            className="inrowField addButton"
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={this.onSubmitWarehouse}
                                        >
                                            Add Warehouse
                                    </Button>
                                    </div>
                                </form>
                            </Paper>

                        </div>
                    </Grow>



                    
                    {/* Add Region */}
                    <Grow in={true} {...(true ? { timeout: 1700 } : {})}>
                        <div ref="secondThird" className="half-page-paper-holder third-page-paper third-page-right">
                            <Paper className="paper addPaper ">
                                <Typography component="h1" variant="h5">
                                    Add a new region
                        </Typography>
                                <form className="addVehForm">
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="text">Region Name</InputLabel>
                                        <Input id="region_name" name="region_name" autoComplete="region name" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="text">Country</InputLabel>
                                        <Input id="country" name="country" autoComplete="country" required onChange={this.handleChange} autoFocus />
                                    </FormControl>
                                    <FormControl className="inrowField inRowInput" margin="normal" required >
                                        <InputLabel htmlFor="text">Main County</InputLabel>
                                        <Input id="main_county" name="main_county" autoComplete="main county" required onChange={this.handleChange} autoFocus />
                                    </FormControl>

                                    <div className="addPageButtonContainer">
                                        <Button
                                            className="inrowField addButton"
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={this.onSubmitRegion}
                                        >
                                            Add Region
                                    </Button>
                                    </div>
                                </form>
                            </Paper>
                        </div>
                    </Grow>











                    
                    {/* Add Transport */}
                    <Grow in={true} {...(true ? { timeout: 1700 } : {})}>
                        <div ref="thirdThird" className="half-page-paper-holder third-page-paper third-page-right">
                            <Paper className="paper addPaper ">
                                <Typography component="h1" variant="h5">
                                    Add a new transport
                                </Typography>
                                <form className="addVehForm">
                                    <FormControl className="selectForm fullWidth" required>
                                        <InputLabel  >Vehicle</InputLabel>
                                        {this.state && this.state.vehicleSelect ? <Select
                                            value={this.state.vehicleSelect}
                                            onChange={this.handleChange}
                                            name="vehicleSelect"
                                            inputProps={{
                                                name: 'vehicleSelect',
                                                id: 'vehicle-simple',
                                            }}
                                        >
                                            {this.state && this.state.availableVehicles ?
                                                this.state.availableVehicles.map((text, index) => (
                                                    <MenuItem key={index} value={text['number_plate']}>{ text['number_plate'].substring(0,2) + "-" + text['number_plate'].substring(2,4) + "-" + text['number_plate'].substring(4,8) }</MenuItem>
                                                ))
                                                : null}
                                        </Select> : null}
                                    </FormControl>
                                    <FormControl className="selectForm halfFormControl" required>
                                        <InputLabel  >Source Warehouse</InputLabel>
                                        {this.state && this.state.SourceWarehouseSelect ? <Select
                                            value={this.state.SourceWarehouseSelect}
                                            onChange={this.handleChange}
                                            name="SourceWarehouseSelect"
                                            inputProps={{
                                                name: 'SourceWarehouseSelect',
                                                id: 'warehouse-simple',
                                            }}
                                        >
                                            {this.state && this.state.availableWarehouses ?
                                                this.state.availableWarehouses.map((text, index) => (
                                                    <MenuItem key={index} value={text['warehouse_name']}>{text['warehouse_name']}</MenuItem>
                                                ))
                                                : null}
                                        </Select> : null}
                                    </FormControl>

                                    <TextField
                                        id="datetime-local"
                                        label="Departure Time *"
                                        type="datetime-local"
                                        className="selectForm datePicker halfDatePicker"
                                        onChange={this.handleChange}
                                        name="departureTime"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <FormControl className="selectForm halfFormControl" required>
                                        <InputLabel  >Destination Warehouse</InputLabel>
                                        {this.state && this.state.DestWarehouseSelect ? <Select
                                            value={this.state.DestWarehouseSelect}
                                            onChange={this.handleChange}
                                            name="DestWarehouseSelect"
                                            inputProps={{
                                                name: 'DestWarehouseSelect',
                                                id: 'warehouse-simple',
                                            }}
                                        >
                                            {this.state && this.state.availableWarehouses ?
                                                this.state.availableWarehouses.map((text, index) => (
                                                    <MenuItem key={index} value={text['warehouse_name']}>{text['warehouse_name']}</MenuItem>
                                                ))
                                                : null}
                                        </Select> : null}
                                    </FormControl>

                                    <TextField
                                        id="datetime-local"
                                        label="Estimated arrival time"
                                        type="datetime-local"
                                        className="selectForm datePicker halfDatePicker"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    <div className="addPageButtonContainer">
                                        <Button
                                            className="inrowField addButton"
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={this.onSubmitTransport}
                                        >
                                            Add Transport
                                    </Button>
                                    </div>
                                </form>
                            </Paper>
                        </div>
                    </Grow>








                    
                    {/* Add Vehicle */}
                    <Grow in={true} {...(true ? { timeout: 1700 } : {})}>
                        <Paper className="paper addPaper">
                            <Typography component="h1" variant="h5">
                                Add a new vehicle
                                </Typography>
                            <form className="addVehForm">
                                <FormControl className="inRowInput" margin="normal" required >
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input id="email" name="email" autoComplete="email" required autoFocus />
                                </FormControl>
                                <FormControl className="inRowInput" margin="normal" required >
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input id="email" name="email" autoComplete="email" required autoFocus />
                                </FormControl>
                                <FormControl className="inRowInput" margin="normal" required >
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input id="email" name="email" autoComplete="email" required autoFocus />
                                </FormControl>
                                <FormControl className="inRowInput" margin="normal" required >
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input id="email" name="email" autoComplete="email" required autoFocus />
                                </FormControl>
                                <FormControl className="inRowInput" margin="normal" required >
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input id="email" name="email" autoComplete="email" required autoFocus />
                                </FormControl>
                                <div className="addPageButtonContainer">
                                    <Button
                                        className="inrowField addButton"
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={this.onSubmitRegion}
                                    >
                                        Add Vehicle
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    </Grow>
                </div>
            );

        }
    }
}
export default withSnackbar(AddPage);