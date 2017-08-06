var FlipClock = React.createClass({
    displayName: 'flipClock',

    getInitialState: function () {
        return {
            timeZone: 'Local Timezone',
            timeZoneValue: null,
            halt: null,
            imgPreload: [],

            hourTenTop: null,
            hourTenMiddle: null,
            hourTenBottom: null,

            hourUnitTop: null,
            hourUnitMiddle: null,
            hourUnitBottom: null,

            minuteTenTop: null,
            minuteTenMiddle: null,
            minuteTenBottom: null,

            minuteUnitTop: null,
            minuteUnitMiddle: null,
            minuteUnitBottom: null,

            middleItemHourClass: null,
            middleItemMinuteClass: null,
            hour: 0,
            minute: 0,
            second: 0
        };
    },
    componentWillMount: function () {

            timerMain.addThemeCSS('/css/flip-clock.css');//works!

            var setHoursTenTopStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setHoursTenMiddleStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setHourTenBottomStyle = {
                backgroundImage: "url('images/10.jpg')"
            };

            var setHoursUnitTopStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setHoursUnitMiddleStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setHoursUnitBottomStyle = {
                backgroundImage: "url('images/10.jpg')"
            };

            var setMinuteTenStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setMinuteTenMiddleStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setMinuteTenBottomStyle = {
                backgroundImage: "url('images/10.jpg')"
            };

            var setMinuteUnitTopStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setMinuteUnitMiddleStyle = {
                backgroundImage: "url('images/0.jpg')"
            };
            var setMinuteUnitBottomStyle = {
                backgroundImage: "url('images/10.jpg')"
            };

            this.setState({ hourTenTop: setHoursTenTopStyle }, () => {});
            this.setState({ hourTenMiddle: setHoursTenMiddleStyle }, () => {});
            this.setState({ hourTenBottom: setHourTenBottomStyle }, () => {});

            this.setState({ hourUnitTop: setHoursUnitTopStyle }, () => {});
            this.setState({ hourUnitMiddle: setHoursUnitMiddleStyle }, () => {});
            this.setState({ hourUnitBottom: setHoursUnitBottomStyle }, () => {});

            this.setState({ minuteTenTop: setMinuteTenStyle }, () => {});
            this.setState({ minuteTenMiddle: setMinuteTenMiddleStyle }, () => {});
            this.setState({ minuteTenBottom: setMinuteTenBottomStyle }, () => {});

            this.setState({ minuteUnitTop: setMinuteUnitTopStyle }, () => {});
            this.setState({ minuteUnitMiddle: setMinuteUnitMiddleStyle }, () => {});
            this.setState({ minuteUnitBottom: setMinuteUnitBottomStyle }, () => {});

            var images = [
                "images/0.jpg",
                "images/1.jpg",
                "images/2.jpg",
                "images/3.jpg",
                "images/4.jpg",
                "images/5.jpg",
                "images/6.jpg",
                "images/7.jpg",
                "images/8.jpg",
                "images/9.jpg",
                "images/10.jpg",
                "images/11.jpg",
                "images/12.jpg",
                "images/13.jpg",
                "images/14.jpg",
                "images/15.jpg",
                "images/16.jpg",
                "images/17.jpg",
                "images/18.jpg",
                "images/19.jpg"
            ];
            this.preloadImages(images);

            this.checkTime('1');
    },
    halt: function(params, callback) {
        this.setState({ halt: 'halt' }, () => {
            console.log('halt applied to flip-clock');
            callback(params);
        });
    },
    preloadImages: function(args) {
            var images = [];
            for (var i = 0; i < args.length; i++) {
                images[i] = new Image();
                images[i].src = args[i];
            }//end for
            this.setState({ imgPreload: images }, () => {
                console.log('from set imgPreload:');
                console.log(this.state.imgPreload);
            });
    },
    timeGetter: function () {
        return 'hours: '+this.state.hour+' -- minutes: '+this.state.minute+' -- seconds: '+this.state.second;
    },
    timeZoneSetter: function (timeZone,timeZoneValue) {
        this.setState({ timeZone: timeZone }, () => {
            console.log('from theme component timezone: ' + this.state.timeZone );
        });
        this.setState({ timeZoneValue: timeZoneValue }, () => {
            console.log('from theme component timezonevalue: ' + this.state.timeZoneValue );
            this.checkTime('1', '1');
        });
    },
    timeZoneGetter: function () {
        return 'timeZone: ' + this.state.timeZone;
    },
    checkTime: function (runImmediate, runOnce) {

        console.log('----- checkTime Flip Clock -----');
        var setApplyTime = 0; //run in the current second
        var currentTime = new Date();

        console.log('minutes: ' + currentTime.getMinutes());
        console.log('seconds: ' + currentTime.getSeconds());
        console.log('milliseconds: ' + currentTime.getMilliseconds());

        var minutes = currentTime.getMinutes();
        var hours = currentTime.getHours();


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

        if(runImmediate === '-1') {
            minutes = minutes+1;
        }

        if(runImmediate === '-1') {
            setApplyTime = 60000 - ( ( currentTime.getSeconds() * 1000 )+currentTime.getMilliseconds() );
        } else {
            setApplyTime = 0;
        }

        console.log('Time till next minute in milliseconds: ' + setApplyTime);
        console.log('Time till next minute in seconds: ' + (setApplyTime/1000) );

        var hoursTenVal = 0;
        var hoursUnitVal = 0;
        var minuteTenVal = 0;
        var minuteUnitVal = 0;

        if (hours.toString().length === 2) {
            hoursTenVal = hours.toString().charAt(0);
            hoursUnitVal = hours.toString().charAt(1);
        } else {
            hoursTenVal = 0;
            hoursUnitVal = hours.toString().charAt(0);
        }

        if (minutes.toString().length === 2) {
            minuteTenVal = minutes.toString().charAt(0);
            minuteUnitVal = minutes.toString().charAt(1);
        } else {
            minuteTenVal = 0;
            minuteUnitVal = minutes.toString().charAt(0); 
        }

        // console.log('hoursTenVal: '+hoursTenVal );
        // console.log('hoursUnitVal: '+hoursUnitVal );
        // console.log('minuteTenVal: '+minuteTenVal );
        // console.log('minuteUnitVal: '+minuteUnitVal );

        var currentTimeZone = this.state.timeZone;


//reorder so it doesn't apply styles after being halted
//it doesn't actually do that because it will always (mostly) be called by run many?
        setTimeout(function () {

            if ( this.state.timeZone === currentTimeZone ) {
                console.log('this.state.timeZone === currentTimeZone');

                if (this.state.hour != hours) {

                    this.setState({ hour: hours }, () => {});

                    var setHoursTenTopStyle = {
                        backgroundImage: "url('images/"+hoursTenVal+".jpg')"
                    };
                    var setHoursTenMiddleStyle = {
                        backgroundImage: "url('images/"+hoursTenVal+".jpg')"
                    };
                    var setHourTenBottomStyle = {
                        backgroundImage: "url('images/"+(parseInt(hoursTenVal)+10)+".jpg')"
                    };

                    var setHoursUnitTopStyle = {
                        backgroundImage: "url('images/"+hoursUnitVal+".jpg')"
                    };
                    var setHoursUnitMiddleStyle = {
                        backgroundImage: "url('images/"+hoursUnitVal+".jpg')"
                    };
                    var setHoursUnitBottomStyle = {
                        backgroundImage: "url('images/"+(parseInt(hoursUnitVal)+10)+".jpg')"
                    };

                    this.setState({ middleItemHourClass: 'middle' }, () => {});

                    this.setState({ hourTenTop: setHoursTenTopStyle }, () => {});
                    this.setState({ hourTenMiddle: setHoursTenMiddleStyle }, () => {});

                    this.setState({ hourUnitTop: setHoursUnitTopStyle }, () => {});
                    this.setState({ hourUnitMiddle: setHoursUnitMiddleStyle }, () => {});

                    setTimeout(function () {
                        // middle.style.opacity = '0';
                        // middle.removeAttribute("class");
                        // bottom.style.backgroundImage = "url('images/"+(parseInt(regEx)+11)+".jpg')";

                        this.setState({ middleItemHourClass: '' }, () => {});//this does all items!!!!!!
                        this.setState({ hourTenBottom: setHourTenBottomStyle }, () => {});
                        this.setState({ hourUnitBottom: setHoursUnitBottomStyle }, () => {});

                    }.bind(this), 100);

                }//end if


                if (this.state.minute != minutes) {

                    this.setState({ minute: minutes }, () => {});

                    var setMinuteTenStyle = {
                        backgroundImage: "url('images/"+minuteTenVal+".jpg')"
                    };
                    var setMinuteTenMiddleStyle = {
                        backgroundImage: "url('images/"+minuteTenVal+".jpg')"
                    };
                    var setMinuteTenBottomStyle = {
                        backgroundImage: "url('images/"+(parseInt(minuteTenVal)+10)+".jpg')"
                    };

                    var setMinuteUnitTopStyle = {
                        backgroundImage: "url('images/"+minuteUnitVal+".jpg')"
                    };
                    var setMinuteUnitMiddleStyle = {
                        backgroundImage: "url('images/"+minuteUnitVal+".jpg')"
                    };
                    var setMinuteUnitBottomStyle = {
                        backgroundImage: "url('images/"+(parseInt(minuteUnitVal)+10)+".jpg')"
                    };

                    this.setState({ middleItemMinuteClass: 'middle' }, () => {});

                    this.setState({ minuteTenTop: setMinuteTenStyle }, () => {});
                    this.setState({ minuteTenMiddle: setMinuteTenMiddleStyle }, () => {});

                    this.setState({ minuteUnitTop: setMinuteUnitTopStyle }, () => {});
                    this.setState({ minuteUnitMiddle: setMinuteUnitMiddleStyle }, () => {});

                    setTimeout(function () {
                        // middle.style.opacity = '0';
                        // middle.removeAttribute("class");
                        // bottom.style.backgroundImage = "url('images/"+(parseInt(regEx)+11)+".jpg')";

                        this.setState({ middleItemMinuteClass: '' }, () => {});//this does all items!!!!!!
                        this.setState({ minuteTenBottom: setMinuteTenBottomStyle }, () => {});
                        this.setState({ minuteUnitBottom: setMinuteUnitBottomStyle }, () => {});

                    }.bind(this), 100);//was 100

                }//end if

            } else {
                console.log('this.state.timeZone !== currentTimeZone');
                console.log('this.state.halt: '+this.state.halt);
                if ( this.state.halt == null ) {
                    this.checkTime('1', '1');//run again for immediate apply
                }//end if
            }//else


            if ( runOnce !== '1' && this.state.halt == null ) {
                console.log('run many');
                this.checkTime('-1', '-1');
            }//end if

        }.bind(this), setApplyTime);




    // function addOne(){

    //     setTimeout(function(){

    //         var topNum = top1.style.backgroundImage;
    //         console.log(topNum);

    //         var regEx = String(topNum).match(/\/(.*)\.jpg/g);
    //         //console.log(regEx);
    //         regEx = String(regEx).replace(".jpg", "");
    //         regEx = String(regEx).replace("\/", "");
    //         console.log(regEx);

    //done till here!

// middle given opacity of 1 and the class set to middle
// 100ms later, middle is given an opacity of 0, the class is removed, and bottom is given its final background image

    //         setTimeout(function () {

    //             top1.style.backgroundImage = "url('images/"+(parseInt(regEx)+1)+".jpg')";
    //             middle.style.backgroundImage = "url('images/"+(parseInt(regEx)+1)+".jpg')";
    //             middle.setAttribute("class", "middle");
    //             middle.style.opacity = '1';

    //             setTimeout(function () {
    //                 middle.style.opacity = '0';
    //                 middle.removeAttribute("class");
    //                 bottom.style.backgroundImage = "url('images/"+(parseInt(regEx)+11)+".jpg')";
    //             }, 100);

    //         }, 1000);   

    //     }, 1000);//wait 10 seconds

    // }

    },
    render: function () {
        return React.createElement(
            'div',
            { 'class': 'flip-clock-container' },
            React.createElement(
                'div',
                { className: 'hourTenContainer' },
                React.createElement('div', { id: 'hourTenTop', style: this.state.hourTenTop }),
                React.createElement('div', { id: 'hourTenMiddle', className: this.state.middleItemHourClass, style: this.state.hourTenMiddle }),
                React.createElement('div', { id: 'hourTenBottom', style: this.state.hourTenBottom })
            ),
            React.createElement(
                'div',
                { className: 'hourUnitContainer' },
                React.createElement('div', { id: 'hourUnitTop', style: this.state.hourUnitTop }),
                React.createElement('div', { id: 'hourUnitMiddle', className: this.state.middleItemHourClass, style: this.state.hourUnitMiddle }),
                React.createElement('div', { id: 'hourUnitBottom', style: this.state.hourUnitBottom })
            ),
            React.createElement(
                'div',
                { className: 'time-divider' },
                React.createElement(
                    'span',
                    { className: 'time-divider-dot' },
                    '.'
                ),
                React.createElement(
                    'span',
                    { className: 'time-divider-dot' },
                    '.'
                )
            ),
            React.createElement(
                'div',
                { className: 'minuteTenContainer' },
                React.createElement('div', { id: 'minuteTenTop', style: this.state.minuteTenTop }),
                React.createElement('div', { id: 'minuteTenMiddle', className: this.state.middleItemMinuteClass, style: this.state.minuteTenMiddle }),
                React.createElement('div', { id: 'minuteTenBottom', style: this.state.minuteTenBottom })
            ),
            React.createElement(
                'div',
                { className: 'minuteUnitContainer' },
                React.createElement('div', { id: 'minuteUnitTop', style: this.state.minuteUnitTop }),
                React.createElement('div', { id: 'minuteUnitMiddle', className: this.state.middleItemMinuteClass, style: this.state.minuteUnitMiddle }),
                React.createElement('div', { id: 'minuteUnitBottom', style: this.state.minuteUnitBottom })
            ),
            React.createElement('div', { id: 'timeZone' }, 'Showing the time in: '+this.state.timeZone)
        );
    }
});

// if ( typeof myVar === 'undefined' ){
//     var myRegistrationModal = {};
// }
// let myRegistrationModal = ReactDOM.render(React.createElement(FlipClock, null), document.getElementById('clock-display'));
// var myRegistrationModal = ReactDOM.render(React.createElement(FlipClock, null), document.getElementById('clock-display'));

var FlipClockRef = ReactDOM.render(React.createElement(FlipClock, null), document.getElementById('clock-display'));

