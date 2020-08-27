$(function() {

    // load confirmation gadget
    // BE.gadget.confirm('#bookeasy__confirmation-gadget', {
    //     thankYouText: 'Thank you for your booking, a booking summary will be emailed to you',
    //     pdfLinkText: 'Download your booking summary PDF now'
    // });



    //$w(function() {
        BE.gadget.confirm('#bookeasy__confirmation-gadget',{
            vcID:188,
            thankYouText: 'Thank you for your booking, a booking summary will be emailed to you'
        });
    //});

    var confirmStart = performance.now();
    $w.event.subscribe("Confirmation.Complete", function(data) {
       console.log('Confirmation.complete');
       console.log(data);

       var confirmEnd = performance.now();
       console.log('Confirmation took '+ (confirmEnd - confirmStart) +' ms.');

        /**
         * Here is how it is set up for google analytics (WHEN USING GOOGLE TAG MANAGER):
         * - in Google Analytics ADMIN, for the property, under Ecommerce, ensure Ecommerce is ON and ensure Ecommerce Enhanced is ON (this code only works with Enhanced ecommerce)
         * - replace existing google tag manager script code with this updated one which has support for "gtag" functions (update the GTM-XXXXXXXXX with your own)
         * <script async src="https://www.googletagmanager.com/gtag/js?id=GTM-XXXXXXXXX"></ script>
         * <script>window.dataLayer=window.dataLayer||[];
         * function gtag(){dataLayer.push(arguments);}
         * gtag('js',new Date());< /script>
         */
        var transaction = {};
        transaction.affiliation = "Bookeasy";
        transaction.itineraryID = data.ItineraryID;
        transaction.isPaid = data.IsPaid; // boolean: true for Instant vs false for Request
        transaction.totalAmount = data.TotalCost;
        transaction.bookings = data.Bookings;
        transaction.firstItemName = "";
        transaction.firstItemCategory = "";
        transaction.firstOperatorId = 0;
        transaction.firstOperatorName = "";
        transaction.gtag_ecommerce_enhanced_items = [];

        var items = [];
        jQuery.each(transaction.bookings, function(key, booking) {

            var item = {};
            item.name = booking.ItemName;
            item.category = booking.Type;
            item.operatorid = booking.CustomerId;
            item.operatorname = booking.CustomerName;
            item.itemname = booking.ItemName;
            item.price = booking.Total;
            items.push(item);

            if (!transaction.firstItemName && item.name) {
                transaction.firstItemName = item.name;
                transaction.firstItemCategory = item.category;
                transaction.firstOperatorId = item.operatorid;
                transaction.firstOperatorName = item.operatorname;
            }

            var gtagitem = {};
            gtagitem.id = booking.CustomerId;
            gtagitem.name = booking.ItemName;
            gtagitem.list_name = booking.CustomerName;
            gtagitem.brand = booking.CustomerName;
            gtagitem.category = booking.Type;
            gtagitem.variant = booking.ItemName;
            gtagitem.list_position = 1;
            gtagitem.quantity = 1;
            gtagitem.price = booking.Total;
            transaction.gtag_ecommerce_enhanced_items.push(gtagitem);

        });


        var debug = 1;
        if (debug) { console.log('transaction data'); console.log(transaction); }

        function customTrackingScriptBookingConfirmed(transaction, items) {

            // $customTrackingScriptCode
            gtag('config', 'UA-21306566-8', { 'send_page_view': false });

            gtag('event', 'purchase', {
                "transaction_id": transaction.itineraryID,
                "affiliation": transaction.affiliation,
                "value": transaction.totalAmount,
                "currency": "AUD",
                "tax": 0,
                "shipping": 0,
                "items": transaction.gtag_ecommerce_enhanced_items
            });

            var trackingEnd = performance.now();
            console.log('Tracking took '+ (trackingEnd - confirmStart) +' ms.');
        }

        function customTrackingScriptRunWhenReady() {
            if (typeof(gtag) !== "undefined") {
                customTrackingScriptBookingConfirmed(transaction, items);
            } else {
                setTimeout(function() { customTrackingScriptRunWhenReady(); }, 250);
            }
        }

        customTrackingScriptRunWhenReady();


    });





    $(document).ready(function() {

        function showrereference() {
            var referenceID = $('#bookeasy__confirmation-gadget  a').attr('href').split('=').reverse()[0];
            console.log(referenceID)
        }

        setTimeout(showrereference, 1000)
    });

 });
