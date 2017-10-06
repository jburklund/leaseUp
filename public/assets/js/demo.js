type = ['', 'info', 'success', 'warning', 'danger'];


demo = {
    initPickColor: function() {
        $('.pick-class-label').click(function() {
            var new_class = $(this).attr('new-class');
            var old_class = $('#display-buttons').attr('data-class');
            var display_div = $('#display-buttons');
            if (display_div.length) {
                var display_buttons = display_div.find('.btn');
                display_buttons.removeClass(old_class);
                display_buttons.addClass(new_class);
                display_div.attr('data-class', new_class);
            }
        });
    },

    initFullScreenGoogleMap: function() {

        var map;
        var elevator;
        var locations = [];
        var mapOptions = {
            zoom: 11,
            center: new google.maps.LatLng(41.4993, -81.6944),
            // mapTypeId: 'terrain',
            scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
            styles: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }]
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        $.ajax({
                method: "GET",
                url: "/api/centers"
            })
            // Fill modal with tenant info
            .done(function(data) {
                console.log(data);

                /// PUSH CENTER DATA INTO LOCATION ARRAY
                for (i = 0; i < data.length; i++) {
                    var location = data[i].centerStreet + ', ' + data[i].centerCity + ', ' + data[i].centerState + ' ' + data[i].centerZip;
                    var title = data[i].centerName;
                    console.log(location);
                    console.log(title);
                    locations.push({ title: title, location: location });
                }
            });

        console.log(locations);
        JSON.stringify(locations);


        // "35970 Detroit Road, Avon, Ohio 44011", "23000 Broadway Avenue, Bedford, Ohio 44146", "25001 Cedar Road, Lyndhurst, Ohio 44124", "9150 Mentor Avenue, Mentor, Ohio 44060", "3447 Steelyard Drive, Cleveland, Ohio 44109", "1876 Warrensville Center Road, South Euclid, Ohio 44121", "36363 Eulid Avenue, Willoughby, Ohio 44094"


        var addresses = ["35970 Detroit Road, Avon, Ohio 44011", "23000 Broadway Avenue, Bedford, Ohio 44146", "25001 Cedar Road, Lyndhurst, Ohio 44124", "9150 Mentor Avenue, Mentor, Ohio 44060", "3447 Steelyard Drive, Cleveland, Ohio 44109", "1876 Warrensville Center Road, South Euclid, Ohio 44121", "36363 Eulid Avenue, Willoughby, Ohio 44094"];

        for (var x = 0; x < locations.length; x++) {
            $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + locations[x].location + '&sensor=false', null, function(data) {
                var p = data.results[0].geometry.location
                var latlng = new google.maps.LatLng(p.lat, p.lng);
                new google.maps.Marker({
                    position: latlng,
                    map: map
                });

            });
        }

    },

    //     var locationArray = [];




    //     function geocodeLocation(location) {
    //         var geocoder = new google.maps.Geocoder();
    //         geocoder.geocode({
    //             'address': location
    //         }, function(results, status) {
    //             console.log(results);
    //             console.log(results[0].geometry.viewport.f.b)
    //             console.log(results[0].geometry.viewport.b.f)
    //         })
    //     }



    //     function geocodeAddress(location) {
    //         var geocoder = new google.maps.Geocoder();
    //         geocoder.geocode({
    //             'address': location
    //         }, function(results, status) {
    //             // Drop a pin on map for each geocoded address
    //             if (status == 'OK') {
    //                 console.log(results);
    //                 console.log(results[0].geometry.viewport.f.b);
    //                 console.log(results[0].geometry.viewport.b.f);
    //                 var lat = parseInt(results[0].geometry.viewport.f.b);
    //                 var lng = parseInt(results[0].geometry.viewport.b.f);

    //                 // var latlon = results[0].geometry.viewport.f.b ", " + results[0].geometry.viewport.b.f;

    //                 window.mapInstance.setCenter({ lat: -34, lng: 151 });

    //                 var marker = new google.maps.Marker({
    //                     map: window.mapInstance,
    //                     position: results[0].geometry.location,
    //                     title: location.name
    //                 });

    //                 var infowindow = new google.maps.InfoWindow({
    //                     content: location.name + "<br>" + location.centerStreet + "<br>" + location.centerCity + ' ' + location.centerState + ' ' + locationArray.centerZip,
    //                     map: map
    //                 });

    //                 google.maps.event.addListener(marker, 'click', function() {
    //                     infowindow.open(map, this);
    //                 });

    //                 // Error alert
    //             } else {
    //                 alert("geocode of " + address + " failed:" + status);
    //             }
    //         });
    //     }

    //     var mapOptions = {
    //         zoom: 13,
    //         center: myLatlng,
    //         scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
    //         styles: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }]

    //     }



    //     // var marker = new google.maps.Marker({
    //     //     position: myLatlng,
    //     //     title: "Hello World!"
    //     // });

    //     // To add the marker to the map, call setMap();
    //     marker.setMap(map);
    // },


    initAnimationsArea: function() {
        $('.animationsArea .btn').click(function() {
            animation_class = $(this).data('animation-class');

            $parent = $(this).closest('.animationsArea');

            $parent.find('.btn').removeClass('btn-fill');

            $(this).addClass('btn-fill');

            $parent.find('.animated')
                .removeAttr('class')
                .addClass('animated')
                .addClass(animation_class);

            $parent.siblings('.header').find('.title small').html('class: <code>animated ' + animation_class + '</code>');
        });
    },

    showSwal: function(type) {
        if (type == 'basic') {
            swal("Here's a message!");

        } else if (type == 'title-and-text') {
            swal("Here's a message!", "It's pretty, isn't it?")

        } else if (type == 'success-message') {
            swal("Good job!", "You clicked the button!", "success")

        } else if (type == 'warning-message-and-confirmation') {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn btn-info btn-fill",
                confirmButtonText: "Yes, delete it!",
                cancelButtonClass: "btn btn-danger btn-fill",
                closeOnConfirm: false,
            }, function() {
                swal("Deleted!", "Your imaginary file has been deleted.", "success");
            });

        } else if (type == 'warning-message-and-cancel') {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    swal("Deleted!", "Your imaginary file has been deleted.", "success");
                } else {
                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                }
            });

        } else if (type == 'custom-html') {
            swal({
                title: 'HTML example',
                html: 'You can use <b>bold text</b>, ' +
                    '<a href="http://github.com">links</a> ' +
                    'and other HTML tags'
            });

        } else if (type == 'auto-close') {
            swal({
                title: "Auto close alert!",
                text: "I will close in 2 seconds.",
                timer: 2000,
                showConfirmButton: false
            });
        } else if (type == 'input-field') {
            swal({
                    title: 'Input something',
                    html: '<p><input id="input-field" class="form-control">',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: false
                },
                function() {
                    swal({
                        html: 'You entered: <strong>' +
                            $('#input-field').val() +
                            '</strong>'
                    });
                })
        }
    },

    initFormExtendedSliders: function() {

        // Sliders for demo purpose in refine cards section
        if ($('#slider-range').length != 0) {
            $("#slider-range").slider({
                range: true,
                min: 0,
                max: 500,
                values: [75, 300],
            });
        }
        if ($('#refine-price-range').length != 0) {
            $("#refine-price-range").slider({
                range: true,
                min: 0,
                max: 999,
                values: [100, 850],
                slide: function(event, ui) {
                    min_price = ui.values[0];
                    max_price = ui.values[1];
                    $(this).siblings('.price-left').html('&euro; ' + min_price);
                    $(this).siblings('.price-right').html('&euro; ' + max_price)
                }
            });
        }

        if ($('#slider-default').length != 0 || $('#slider-default2').length != 0) {
            $("#slider-default, #slider-default2").slider({
                value: 70,
                orientation: "horizontal",
                range: "min",
                animate: true
            });
        }
    },

    initFormExtendedDatetimepickers: function() {
        $('.datetimepicker').datetimepicker({
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-chevron-up",
                down: "fa fa-chevron-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            }
        });

        $('.datepicker').datetimepicker({
            format: 'MM/DD/YYYY',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-chevron-up",
                down: "fa fa-chevron-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            }
        });

        $('.timepicker').datetimepicker({
            //          format: 'H:mm',    // use this format if you want the 24hours timepicker
            format: 'h:mm A', //use this format if you want the 12hours timpiecker with AM/PM toggle
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-chevron-up",
                down: "fa fa-chevron-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            }
        });
    },

    initFullCalendar: function() {
        $calendar = $('#fullCalendar');

        today = new Date();
        y = today.getFullYear();
        m = today.getMonth();
        d = today.getDate();

        $calendar.fullCalendar({
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay',
                right: 'prev,next today'
            },
            defaultDate: today,
            selectable: true,
            selectHelper: true,
            titleFormat: {
                month: 'MMMM YYYY', // September 2015
                week: "MMMM D YYYY", // September 2015
                day: 'D MMM, YYYY' // Tuesday, Sep 8, 2015
            },
            select: function(start, end) {

                // on select we show the Sweet Alert modal with an input
                swal({
                    title: 'Create an Event',
                    html: '<br><input class="form-control" placeholder="Event Title" id="input-field">',
                    showCancelButton: true,
                    closeOnConfirm: true
                }, function() {

                    var eventData;
                    event_title = $('#input-field').val();

                    if (event_title) {
                        eventData = {
                            title: event_title,
                            start: start,
                            end: end
                        };
                        $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                    }

                    $calendar.fullCalendar('unselect');

                });
            },
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: "/api/tenants/events"

            // color classes: [ event-blue | event-azure | event-green | event-orange | event-red 

        });
    }


}