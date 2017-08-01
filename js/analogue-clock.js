var AnalogueClock = React.createClass({
    displayName: 'AnalogueClock',

    getInitialState: function () {
        return {
            timeZone: 'Local Timezone',
            timeZoneValue: null,
            secondsStyle: null,
            minutesStyle: null,
            hoursStyle: null,
            seconds: 0,
            minutes: 0,
            hours: 0,
            period: null
        };
    },
    componentWillMount: function () {
        timerMain.addThemeCSS('/css/analogue-clock.css');//works!
        this.checkTime();
    },
    // timeSetter: function (hours, minutes) {
    //     this.setState({ hour: hours }, () => {});
    //     this.setState({ minute: minutes }, () => {});
    // },
    timeZoneSetter: function (timeZone,timeZoneValue) {
        this.setState({ timeZone: timeZone }, () => {
            console.log('from theme component timezone: ' + this.state.timeZone );
        });
        this.setState({ timeZoneValue: timeZoneValue }, () => {
            console.log('from theme component timezonevalue: ' + this.state.timeZoneValue );
            // this.checkTime('1', '1');
        });
    },
    timeZoneGetter: function () {
        return 'timeZone: ' + this.state.timeZone;
    },
    checkTime: function () {

//THIS FUNCTION TICKS ALREADY! when state is set react changes the value!

        //one function keeps ticking accoridng to the state values
        //another function checks that the state values are up to date
        //these two act asycronously (wich is great!)
        console.log('----- checkTime -----');
        var setTimeoutValue = 500; //run every 15 seconds = 15000, every 1000 was what it was set at.
        var setApplyTime = 0; //run in the current second
        var currentTime = new Date();

        //check milliseconds to find the correct minute to show.
        //always wait untl the next available minute.

        //also, as long as the ntp time is known to a second, then any seconds after that time can be counted, allowing correct setting of time.?

        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        // var hours = currentTime.getUTCHours();
        // var minutes = currentTime.getUTCMinutes();
        // var seconds = currentTime.getUTCSeconds();

        if ( this.state.timeZoneValue !== null ) {

            hours = currentTime.getUTCHours();
            minutes = currentTime.getUTCMinutes();

            console.log('this.state.timeZoneValue !== null');
            var timeZoneTime = timerMain.timezoneTheme(this.state.timeZone,hours,minutes);
            console.log(timeZoneTime);
            hours = parseInt(timeZoneTime.hours);
            minutes = parseInt(timeZoneTime.minutes);
            // hours = parseInt(hours) + parseInt(timeZoneTime.hours);
            // minutes = parseInt(minutes) + parseInt(timeZoneTime.minutes);

        } else {
            console.log('this.state.timeZoneValue === null');

        }

        if (hours < 12) {
            // console.log('AM');
            this.state.period = 'AM';
        } else {
            // console.log('PM');
            this.state.period = 'PM';
        }

        //console.log('minutes: ' + currentTime.getMinutes());
        //console.log('hours: ' + currentTime.getHours());
        //console.log('seconds: ' + currentTime.getSeconds());
        console.log('milliseconds: ' + currentTime.getMilliseconds());

        //calculate current time values as degrees on c clock
        seconds = seconds * 6; //add an extra second?
        minutes = minutes * 6;
        hours = hours * 30; //there are ony 24 hours, so 30 degrees per hour
        // var seconds = currentTime.getSeconds() * 6; //add an extra second?
        // var minutes = currentTime.getMinutes() * 6;
        // var hours = currentTime.getHours() * 30; //there are ony 24 hours, so 30 degrees per hour
        // console.log('seconds as degrees: '+seconds );
        // console.log('minutes as degrees: '+minutes );
        // console.log('hours as degrees: '+hours );


        //in any case set to start at the next second....!!!!!

        if( currentTime.getMilliseconds() >= 500 ) {
            //add one second to the time and then set timeout to start at the ms left till the next second
            //this is only to apply the time, remember that the clock will always add one second each time it runs.
            console.log('Start NEXT second');
            //this.setState({seconds: parseInt(seconds,10) + 1}, () => {});//end seconds
            //setApplyTime = 1000-currentTime.getMilliseconds();
            //console.log('Time till next second: '+setApplyTime);
            seconds = seconds + 6;
        } else {
            //seconds = seconds - 6;
        }


        setApplyTime = 1000 - currentTime.getMilliseconds();//was: 1000 - currentTime.getMilliseconds() or 0
        console.log('Time till next second: ' + setApplyTime);


        setTimeout(function () {

            //form styles to be added to the clock
            var setSecondsStyle = {
                WebkitTransform: 'rotateZ(' + seconds + 'deg)',
                transform: 'rotateZ(' + seconds + 'deg)'
            };

            var setMinuteStyle = {
                WebkitTransform: 'rotateZ(' + minutes + 'deg)',
                transform: 'rotateZ(' + minutes + 'deg)'
            };

            var setHourStyle = {
                WebkitTransform: 'rotateZ(' + hours + 'deg)',
                transform: 'rotateZ(' + hours + 'deg)'
            };

            // reorder these as when they get applied the style changes!!!! currently out of sync with the time value changes...?
            //are these not being used?

            //apply styles to the clock
            this.setState({ secondsStyle: setSecondsStyle }, () => {}); //moves the second hand by setting the style
            this.setState({ minutesStyle: setMinuteStyle }, () => {}); //moves minute hand by setting the style
            this.setState({ hoursStyle: setHourStyle }, () => {});

//none of theses vales are needed, only the setTimeOut with checkTime inside.
            //set state to have initial values
            this.setState({ second: parseInt(seconds, 10) }, () => {
                this.setState({ minute: parseInt(minutes, 10) }, () => {
                    this.setState({ hour: parseInt(hours, 10) }, () => {
                        setTimeout(function () {
                            this.checkTime();
                        }.bind(this), setTimeoutValue); //every 15 seconds, the time is checked. maybe it should do this each second?
                    }); //end seconds
                }); //end seconds
            }); //end seconds
        }.bind(this), setApplyTime);
    },
    render: function () {
        return React.createElement(
            'div',
            { id: 'clockFace' },
            React.createElement(
                'div',
                { id: 'digit-12', className: 'doubleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '12'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-1', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '1'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-2', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '2'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-3', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '3'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-4', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '4'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-5', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '5'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-6', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '6'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-7', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '7'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-8', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '8'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-9', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '9'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-10', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '10'
                )
            ),
            React.createElement(
                'div',
                { id: 'digit-11', className: 'singleDigit' },
                React.createElement(
                    'span',
                    { className: 'textNode' },
                    '11'
                )
            ),
            React.createElement(
                'div',
                { id: 'secHand', style: this.state.secondsStyle },
                React.createElement('div', { id: 'secHandLeft' }),
                React.createElement('div', { id: 'secHandRight' })
            ),
            React.createElement(
                'div',
                { id: 'minHand', style: this.state.minutesStyle },
                React.createElement('div', { id: 'minHandLeft' }),
                React.createElement('div', { id: 'minHandRight' })
            ),
            React.createElement(
                'div',
                { id: 'hourHand', style: this.state.hoursStyle },
                React.createElement('div', { id: 'hourHandLeft' }),
                React.createElement('div', { id: 'hourHandRight' })
            ),
            React.createElement(
                'div',
                { id: 'period' },
                this.state.period
            )
        );
    }
});
//ReactDOM.render(React.createElement(AnalogueClock, null), document.getElementById('clock-display'));

//Starts clock at run time but also allows the call of: myRegistrationModal.testConsole() - this way member functions of a component can be called from outside the component.
//this can be considered the interface with which to access a component's member functions?
// let myRegistrationModal = ReactDOM.render(React.createElement(AnalogueClock, null), document.getElementById('clock-display'));
var myRegistrationModal = ReactDOM.render(React.createElement(AnalogueClock, null), document.getElementById('clock-display'));



