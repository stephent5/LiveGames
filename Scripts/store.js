var Store = function (userObj) {

    var storeitems, ubbillingobject, lastfbid;

    function convertFaceBookCreditsValueToUsersCurrency(CreditsValue, currencyData_in) {
        try{
            var currmap = {
                USD: '$',
                EUR: '€', //... cover whichever currencies are relevant to your app
                GBP: '£'
            }

            var currencyData = typeof currencyData_in != 'object' ? JSON.parse(currencyData_in) : currencyData_in;
            
            if (currencyData.currency) {
                currencyData = currencyData.currency;
            }

            var currency = currmap[currencyData.user_currency]
                || currencyData.user_currency, // in case the map doesn't cover it
            rate = currencyData.currency_exchange_inverse,
            offset = currencyData.currency_offset;

            // JS Math.round only rounds to int, so work around that
            var localPrice = String(Math.round(CreditsValue * rate * offset));

            // Using string operations - you could also use floor(division) and mod
            offset = {1:0, 10:-1, 100:-2, 1000: -3}[offset];
            var minorUnits = localPrice.substr(offset),
                majorUnits = localPrice.substring(0, localPrice.length + offset) || "0",
                separator = (1.1).toLocaleString()[1]; // use the locale-correct decimal

            var displayPrice = currency + String(majorUnits) +
                (minorUnits ? separator + minorUnits : '');
            return displayPrice;
        } catch (ex) { return "price unknown";}
    }


    return {
        storeitems: storeitems,
        ubbillingobject: ubbillingobject,

        //function to display/hide store
        resetinventory: function () {
            //reset inventory screen
            $('#' + displaymode + '_checkout').hide();
            $('#' + displaymode + '_billing').hide();
            $('#' + displaymode + '_inventory').show();
        }, //end resetinventory
        showstore: function () {
            if ($('.storepopup').is(":visible") == true) {
                $('.storepopup').fadeOut('fast');
                // $('.tooltip-shade').hide();
                Store.resetinventory();
            } else {
                //if in here then the user has clicked to view the store
                _gaq.push(['_trackEvent', 'Clicks', 'ShowStore']);
                Store.GetStoreItems();
                $('.storepopup').fadeIn('fast');
                // $('.tooltip-shade').show();
            }
        }, //end store

        GetMyStorePurchases: function () { //goes to DB and gets store items i have attempted to buy
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/GetStorePurchases",
                        type: "POST",
                        data: "&u=" + user.id + "&fu=" + user.fbuserid,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("GetMyStorePurchases", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            var mypurchases = typeof response != 'object' ? JSON.parse(response) : response;

                            var html = "";
                            for (var i = 0; i < mypurchases.length; i++) {
                                //output 

                                if (mypurchases[i].p == 4) //this item was bought using facebookcredits - we need to convert credits to a genuine currency here!! 
                                {
                                    //we CAN display the price of each item here!!!!!!!!
                                    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                                    var FBPriceDetails = convertFaceBookCreditsValueToUsersCurrency(mypurchases[i].price.toFixed(2), user.CurrencyData);
                                    //var adjustedprice = (Store.storeitems[i].price.toFixed(2) / 10).toFixed(2);
                                    
                                    html += "<p class='purchasehistory_row'><span class='time'>" + mypurchases[i].time + "</span> - <span class='name'>" + mypurchases[i].name + " </span> for <span class='price'>" + FBPriceDetails + "</span>";
                                }
                                else
                                {
                                    html += "<p class='purchasehistory_row'><span class='time'>" + mypurchases[i].time + "</span> - <span class='name'>" + mypurchases[i].name + " </span> for <span class='price'>" + mypurchases[i].cs + "" + mypurchases[i].price + "</span>";
                                }
                                
                                if (mypurchases[i].status == 1) {
                                    //billed  - complete
                                    html += " <span class='status complete'>Purchase Complete</span>";
                                }
                                else if (mypurchases[i].status == -1) {
                                    //not billed - complete
                                    html += " <span class='status fail'>Purchase Failed - Not Billed</span>";
                                }
                                else if (mypurchases[i].status == 0) {
                                    //processing
                                    html += " <span class='status processing'>Purchase Processing....</span>";
                                }
                                html += "</p>";
                            }
                            $('#' + displaymode + '_storepurchases').html(html);
                            refreshScroller(myStorePurchasesScroller, "storepurchases");
                        }
                    }
            );
        }, //end GetMyStorePurchases

        GetStoreItems: function (ItemToDisplay) { //goes to DB and gets store items
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/GetStoreItems",
                        type: "POST",
                        data: "fixtureID=" + GetCurrentfixtureID() + "&userid=" + user.id + "&p=" + getPlatform(),
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("GetStoreItems", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            Store.storeitems = typeof response != 'object' ? JSON.parse(response) : response;

                            if (ItemToDisplay) {
                                //we want to display a particular item - not the entire list of items
                                for (var i = 0; i < Store.storeitems.length; i++) {
                                    if (Store.storeitems[i].name.toLowerCase().indexOf(ItemToDisplay) > 0) {
                                        //this item is the store item!!!!
                                        Store.confirmPurchase(i, true);
                                    }
                                }
                            }
                            else {
                                //display the list of all our store items
                                Store.DisplayStoreItems(response);
                            }
                        }
                    }
            );
        }, //end GetStoreItems


        DisplayStoreItems: function (listofstoreitems) {
            var storehtml = "";
            for (var i = 0; i < Store.storeitems.length; i++) {
                if (getPlatform() == 2) { //IOS 
                    //we CAN display the price of each item here!!!!!!!!
                    storehtml += '<div style="width:25%; float:left; text-align:center;"> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/' + Store.storeitems[i].imgurl + '" border="0" alt="200"  /><br /><strong>' + Store.storeitems[i].cs + Store.storeitems[i].price.toFixed(2) + '</strong><br /> <div class="button" onclick="Store.DisplayStoreItem(' + i + '); return false;">More Info</div></div>'; //
                }



                /* //this has changed as of sep 3 2013
                //- since we've updated to the new facebook credits mechanism here we will not tell the user the price of the item until they
                //click more info - facebook will then present the details to the user!!!!
                else if (getPlatform() == 4) //facebookcredits 
                {
                    //we CAN display the price of each item here!!!!!!!!
                    var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
                    var FBPriceDetails = convertFaceBookCreditsValueToUsersCurrency(Store.storeitems[i].price.toFixed(2), user.CurrencyData);
                    //var adjustedprice = (Store.storeitems[i].price.toFixed(2) / 10).toFixed(2);
                    storehtml += '<div style="width:25%; float:left; text-align:center;"> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/' + Store.storeitems[i].imgurl + '" border="0" alt="200"  /><br /><strong>' + FBPriceDetails + '</strong><br /> <div class="button" onclick="Store.DisplayStoreItem(' + i + '); return false;">More Info</div></div>'; //
                }
                */



                else {
                    //default - web!!!
                    //we can NOT display the price untill we call Jimbo's UB API
                    storehtml += '<div style="width:25%; float:left; text-align:center;"> <img src="https://d2q72sm6lqeuqa.cloudfront.net/images/' + Store.storeitems[i].imgurl + '" border="0" alt="200"  /><br /> <div class="button" onclick="Store.DisplayStoreItem(' + i + '); return false;">More Info</div></div>'; //<strong>' + this.storeitems[i].pricedescription + '</strong><br />
                }
            }
            $('#' + displaymode + '_inventory').html(storehtml);
            //$('#' + displaymode + '_inventory').show();
        }, //end DisplayStoreItems


        DisplayStoreItem: function (i, displayotherstoreitems) {  //show confirm purchase screen
            _gaq.push(['_trackEvent', 'Clicks', 'ShowStoreItem_' + Store.storeitems[i].name]);

            if (getPlatform() == 2) { //IOS

                $('.itemdescriptiondetails').html("<p><strong>" + Store.storeitems[i].name + "</strong> <br />" + Store.storeitems[i].description + "</p><br />");

                $('#' + displaymode + '_inventory').fadeOut('fast', function () {
                    $('#' + displaymode + '_checkout').fadeIn('fast');
                });

                var billOptionHTML = "<p>Price " + Store.storeitems[i].price + " <div class='button' onclick='Store.confirmPurchase(" + i + "); return false;'>Buy</div></p>";
                $('.itempurchasedetails').html(billOptionHTML);
            }
            else {
                //UB and facebook credits 
                //go to db and log the fact the user has clicked on this item
                Store.confirmPurchase(i, displayotherstoreitems);
            }

        },  //end DisplayStoreItem 

        confirmPurchase: function (i, displayotherstoreitems) {  //show confirm purchase screen
            //If the user is on the iOS app perform iOS billing, if not display the confirm popup
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var storeItemid = Store.storeitems[i].id;

            var currencyCode = "";
            try
            {
                var currencyData = typeof user.CurrencyData != 'object' ? JSON.parse(user.CurrencyData) : user.CurrencyData;

                if (currencyData.currency) {
                    currencyCode = currencyData.currency.user_currency;
                }
                else {
                    currencyCode = currencyData.user_currency;
                }

                //if (!currencyCode) {}
            } catch(ex){}


            $.ajax(
                {
                    url: WS_URL_ROOT + "/Game/LogPurchaseRequest",
                    type: "POST",
                    data: "fixtureID=" + GetCurrentfixtureID() + "&cc=" + currencyCode + "&userid=" + user.id + "&si=" + storeItemid + "&p=" + getPlatform() + "&fu=" + uiUser.fbuserid + "&c=" + Store.storeitems[i].c,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("confirmPurchase", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        if (response.id > 0) {
                            //we have successfully recorded the request in our DB -

                            if (getPlatform() == 2) { //IOS
                                //we have successfully recorded the fact the user has chosen to buy this item
                                //so ..Hugh - do IOS BILLING STUFF HERE!!!!!!!!!!!!    
                                Store.DoIOSBilling(response);
                            }
                            else if (getPlatform() == 4) { //Facebook credits 
                                //call facebook credits ui here!!!


                                if ((user.payment_test_group) && (user.payment_test_group == 1))
                                {
                                    //facebook want us to keep all users in payment_test_group 1
                                    //to use legacy system - for how long???????

                                    ////////////////////////////////oLD FACEBOOK WAY - removed 2-sep-2013//////////////////////////////////////////
                                    var obj =
                                    {
                                        method: 'pay',
                                        action: 'buy_item',
                                        order_info: { 'item_id': "'" + response.fboi + "'" },
                                        dev_purchase_params: { 'oscif': true } //mine //"We refer to credits as a Payment on Facebook as 'oscif' which 'Optimized sole cash-in flow'."
                                        //,dev_purchase_params: {'oscif': true}   //thiers
                                    };
                                    Store.lastfbid = response.id;
                                    FB.ui(obj, Store.HandleFacebookBilingResponse);
                                    ////////////////////ENd OLD FACEBOOK WAY - removed 2-sep-2013//////////////////////////////////////////////////
                                }
                                else
                                {
                                    //all other users do NEW fb billing method!!!!

                                    ////////////////////////////////NEW FACEBOOK WAY - added 2-sep-2013//////////////////////////////////////////
                                    Store.lastfbid = response.id;
                                    FB.ui({
                                        method: 'pay',
                                        action: 'purchaseitem',
                                        product: response.u,  //url of item //'http://www.friendsmash.com/og/coins.html',
                                        //quantity: 10,                 // optional, defaults to 1
                                        request_id: response.id // optional, must be unique for each payment
                                    },
                                        Store.HandleFacebookBilingResponseV2
                                    );
                                    ////////////////////////////////END NEW FACEBOOK WAY - added 2-sep-2013//////////////////////////////////////////
                                }
                            }
                            else {
                                //UB
                                $('.itemdescriptiondetails').html("<p><strong>" + Store.storeitems[i].name + "</strong> <br />" + Store.storeitems[i].description + "</p><br />");

                                $('#' + displaymode + '_inventory').fadeOut('fast', function () {
                                    $('#' + displaymode + '_checkout').fadeIn('fast');
                                });

                                //what we need to do here is call Jimbos's API - get the response - then update our DB with response and show the user the options that the response gave us!!!!!!
                                //Store.InitiateUBBilling(response, Store.storeitems[i].price);
                                Store.InitiateUBBillingV2(response, Store.storeitems[i].price,i);

                                $('.itempurchasedetails').html("<p>Retrieving purchase details........</p>");

                                if (displayotherstoreitems) {
                                    //this means we have opened the store and gone directly to a particular store item
                                    //what we want to do now is set (but not display) the html for the other store items
                                    //in case the user clicks to see them (which they can do from the store item they are viewing!!!)
                                    Store.DisplayStoreItems(Store.storeitems);
                                }
                            }
                        }
                        else {
                            $('.itemdescriptiondetails').html("<p>Error displaying item details. Please try again later</p><br />");
                        }
                    }
                }
            );

        },  //end confirmpurchase 


        HandleFacebookBilingResponseV2: function (fbBillingObject) {
            //var fbBillingObject = JSON.parse(data);


            //if we get an error here we should log it - we should have the last generated reponseid saved as a property somewhere!!!!!!
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (fbBillingObject.payment_id) {
                //the billing was a success!!!! - log this in the DB and get the purchaseID and then call Store.CompletePurchase 

                $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/UpdateFBStorePurchase",
                        type: "POST",
                        
                        data: { pid: fbBillingObject.payment_id, spid: Store.lastfbid, a: fbBillingObject.amount, c: fbBillingObject.currency, q: fbBillingObject.quantity, s: fbBillingObject.status, sr: fbBillingObject.signed_request, u: user.id, fu: user.fbuserid },

                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("UpdateFBStorePurchase", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (completedStorePurchase) {
                            if ((completedStorePurchase) && (completedStorePurchase.id > 0)) {
                                Store.CompletePurchase(completedStorePurchase);
                            }
                        }
                    }
                );
            }
            else if 
            ((fbBillingObject.error_code) && (Store.lastfbid)) {
                //log the fact there was an error!!!!!  
                $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/LogFailedFBStorePurchase",
                        type: "POST",
                        data: "u=" + user.id + "&spid=" + Store.lastfbid + "&ec=" + fbBillingObject.error_code + "&em=" + encodeURIComponent(fbBillingObject.error_message) + "&fu=" + uiUser.fbuserid,
                        //data: "&u=" + user.id + "spid=" + Store.lastfbid + "ec=" + fbBillingObject.error_code + "&fu=" + uiUser.fbuserid,
                        //data: "u=" + user.id + "spid=" + Store.lastfbid + "&fu=" + uiUser.fbuserid,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("CompleteFailedFBStorePurchase", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (StorePurchase) {
                            if ((StorePurchase) && (StorePurchase.id > 0)) {
                                Store.CompletePurchase(StorePurchase);
                            }
                        }
                    }
                );

            }
        }, //HandleFacebookBilingResponseV2



        HandleFacebookBilingResponse: function (fbBillingObject) {
            //var fbBillingObject = JSON.parse(data);


            //if we get an error here we should log it - we should have the last generated reponseid saved as a property somewhere!!!!!!
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if (fbBillingObject.order_id) {
                //the billing was a success!!!! - log this in the DB and get the purchaseID and then call Store.CompletePurchase 

                $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/CompleteFBStorePurchase",
                        type: "POST",
                        data: "fboid=" + fbBillingObject.order_id + "&u=" + user.id + "&fu=" + uiUser.fbuserid,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("UpdateFBStorePurchase", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (completedStorePurchase) {
                            if ((completedStorePurchase) && (completedStorePurchase.id > 0)) {
                                Store.CompletePurchase(completedStorePurchase);
                            }
                        }
                    }
                );
            }
            else if
            ((fbBillingObject.error_code) && (Store.lastfbid)) {
                //log the fact there was an error!!!!!  
                $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/LogFailedFBStorePurchase",
                        type: "POST",
                        data: "u=" + user.id + "&spid=" + Store.lastfbid + "&ec=" + fbBillingObject.error_code + "&em=" + encodeURIComponent(fbBillingObject.error_message) + "&fu=" + uiUser.fbuserid,
                        //data: "&u=" + user.id + "spid=" + Store.lastfbid + "ec=" + fbBillingObject.error_code + "&fu=" + uiUser.fbuserid,
                        //data: "u=" + user.id + "spid=" + Store.lastfbid + "&fu=" + uiUser.fbuserid,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("CompleteFailedFBStorePurchase", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (StorePurchase) {
                            if ((StorePurchase) && (StorePurchase.id > 0)) {
                                Store.CompletePurchase(StorePurchase);
                            }
                        }
                    }
                );

            }
        }, //HandleFacebookBilingResponse

        InitiateUBBilling: function (purchaserequest, price) { //this function goes to DB and logs the fact that the user has requested to buy item i at price p - after this function we then present te billin options to the user (UB etc)
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var thispurchaseId = purchaserequest.id;
            $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/CallUBBillRequest",
                        type: "POST",
                        data: "fixtureID=" + GetCurrentfixtureID() + "&userid=" + user.id + "&si=" + purchaserequest.storeitemid + "&pid=" + purchaserequest.id + "&price=" + price,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("InitiateUBBilling", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {
                            var jsonstring = response.replace(/@/g, "");
                            Store.ubbillingobject = typeof jsonstring != 'object' ? JSON.parse(jsonstring) : jsonstring; //JSON.parse(jsonstring);

                            if ((!user.sak) && (user.sak != Store.ubbillingobject.Billing.SAK))
                            {
                                user.sak = Store.ubbillingobject.Billing.SAK;
                            }

                            //later we will loop through all bill options displaying each one to the 
                            var billOptionHTML = "<p>Price " + Store.ubbillingobject.Billing.BillOptions.Billoption.BillingPrice + " <div class='button' onclick='Store.DoUBBilling(" + Store.ubbillingobject.Billing.BillOptions.Billoption.BillOptionID + "," + Store.ubbillingobject.Billing.BillOptions.Billoption.BillingPrice + "," + thispurchaseId + "); return false;'>Buy</div></p>";
                            $('.itempurchasedetails').html(billOptionHTML);
                        }
                    }
                    );
        }, //end InitiateUBBilling


        InitiateUBBillingV2: function (purchaserequest, price,item) { //this function goes to DB and logs the fact that the user has requested to buy item i at price p - after this function we then present te billin options to the user (UB etc)
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            var thispurchaseId = purchaserequest.id;
            $.ajax(
                    {
                        url: WS_URL_ROOT + "/Game/CallUBBillRequestV2",
                        //url: WS_URL_ROOT + "/Game/ubtest",
                        type: "POST",
                        data: "fixtureID=" + GetCurrentfixtureID() + "&userid=" + user.id + "&si=" + purchaserequest.storeitemid + "&pid=" + purchaserequest.id + "&price=" + price + "&title= " + encodeURIComponent(Store.storeitems[item].name) + "&sak=" + user.sak,
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            AjaxFail("InitiateUBBillingV2", XMLHttpRequest, textStatus, errorThrown);
                        },
                        success: function (response) {

                            if ((response == "-1") || (response == "-2")) {
                                //failed to call api
                                $('.itempurchasedetails').html("Error retrieving purchase details. Please try again later. <br />");
                            }
                            else {
                                var jsonstring = response.replace(/@/g, "");
                                Store.ubbillingobject = typeof jsonstring != 'object' ? JSON.parse(jsonstring) : jsonstring; //JSON.parse(jsonstring);

                                //later we will loop through all bill options displaying each one to the 

                                var currmap = {
                                    USD: '$',
                                    EUR: '€', //... cover whichever currencies are relevant to your app
                                    GBP: '£'
                                };

                                if (Store.ubbillingobject.Billing.BillOptions.BillOption.BillingPrice)
                                {
                                    //var currency = currmap[Store.ubbillingobject.Billing.BillOptions.BillOption.BillingCurrency];
                                    var currency;
                                    try{
                                        currency = Store.ubbillingobject.Billing.BillOptions.BillOption.BillingCurrencyDisplay;
                                    }
                                    catch (ex) {
                                        currency = currmap[Store.ubbillingobject.Billing.BillOptions.BillOption.BillingCurrency];
                                    }
                                    if (!currency) {
                                        currency = "";
                                    }
                                    
                                    var billOptionHTML = "<p>Price " + currency + Store.ubbillingobject.Billing.BillOptions.BillOption.BillingPrice + " <div class='button' onclick='Store.DoUBBilling(" + Store.ubbillingobject.Billing.BillOptions.BillOption.BillOptionID + "," + Store.ubbillingobject.Billing.BillOptions.BillOption.BillingPrice + "," + thispurchaseId + "); return false;'>Buy</div></p>";
                                    $('.itempurchasedetails').html(billOptionHTML);
                                }
                                else {
                                    //var currency = currmap[Store.ubbillingobject.Billing.BillOptions.BillOption[0].BillingCurrency];
                                    var currency;
                                    try {
                                        currency = Store.ubbillingobject.Billing.BillOptions.BillOption[0].BillingCurrencyDisplay;
                                    }
                                    catch (ex) {
                                        currency = currmap[Store.ubbillingobject.Billing.BillOptions.BillOption[0].BillingCurrency];
                                    }
                                    if (!currency) {
                                        currency = "";
                                    }
                                    var billOptionHTML = "<p>Price " + currency + Store.ubbillingobject.Billing.BillOptions.BillOption[0].BillingPrice + " <div class='button' onclick='Store.DoUBBilling(" + Store.ubbillingobject.Billing.BillOptions.BillOption[0].BillOptionID + "," + Store.ubbillingobject.Billing.BillOptions.BillOption[0].BillingPrice + "," + thispurchaseId + "); return false;'>Buy</div></p>";
                                    $('.itempurchasedetails').html(billOptionHTML);
                                }
                            }
                        }
                    }
                    );
        }, //end InitiateUBBillingV2

        DoUBBilling: function (BillOptionID, BillOptionPrice, thispurchaseId) {


            //first update our DB that the user has selected to buy this BillOptionID for this row in tblStorePurchases (i.e for this purchaserequest)
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            $.ajax(
            {
                url: WS_URL_ROOT + "/Game/LogUsersSelectedUBBillOption",
                type: "POST",
                data: "&userid=" + user.id + "&pid=" + thispurchaseId + "&ubboid=" + BillOptionID + "&ubp=" + BillOptionPrice + "&fu=" + uiUser.fbuserid,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("DoUBBilling", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    //we have successfully recorded the fact the user has chosen to buy this bet option
                    //now - redirect to the appropriate url!!!!!

                    //later we will take the BillOptionID and we will look through the list of billoptions and find the URL linked
                    //to the BillOptionID - for now however there is only 1 bill option
                    if (response > 0) {

                        var redirecturl;
                        try
                        {
                            redirecturl = Store.ubbillingobject.Billing.BillOptions.BillOption.InstructionSet.IS.Step.URI;
                        } catch (ex) { }
                        
                        if (!redirecturl) {
                            try {
                                redirecturl = Store.ubbillingobject.Billing.BillOptions.BillOption.InstructionSet.IS.Step[0].URI;
                            } catch (ex) { }
                        }
                        
                        if (!redirecturl) {
                            try {
                                redirecturl = Store.ubbillingobject.Billing.BillOptions.BillOption[0].InstructionSet.IS.Step[0].URI;
                            } catch (ex) { }
                        }

                        if (!redirecturl) {
                            try {
                                redirecturl = Store.ubbillingobject.Billing.BillOptions.BillOption[0].InstructionSet.IS.Step.URI;
                            } catch (ex) { }
                        }
                        window.location.href = redirecturl;
                    }
                    else if (response == -999) {
                        $('.itemdescriptiondetails').html("<p>Error - invalid user</p><br />");
                    }
                    else {
                        $('.itemdescriptiondetails').html("<p>Error. Please try again later</p><br />");
                    }
                }
            });


        }, //DoUBBilling


        DoIOSBilling: function (thisStorePurchase) {
            //1 - call IOS specific billing function - when the IOS function returns go to Store.UpdateIOSPurchases()

            //when calling this function - pass in storeitemid (i.e is it a forfeit,powerplay etc), also pass the unique transactionid (thisStorePurchase.id)
            //if you get ANY resonse at all here log it

            //assume at this stage - the user sees a prompt to bill and we are now waiting for the user to hit buy or cancel

            try {
                window.location = "livegames:BuyItem:" + thisStorePurchase.storeitemid + ":" + thisStorePurchase.id;
                //Store.UpdateIOSPurchases("madeUpReceiptID", thisStorePurchase.id);
            }
            catch (ex2) {
                logError("DoIOSBilling", ex2);
            }
        }, //end DoIOSBilling

        LogIOSBillingError: function (errorText, purchaseID, errorCode) {
            $.ajax(
            {
                url: WS_URL_ROOT + "/Game/LogIOSReceiptError",
                type: "POST",
                data: "&errorText=" + errorText + "&purchaseID=" + purchaseID + "&errorCode=" + errorCode,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("DoUBBilling", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                }
            });
        }, //end LogIOSBillingError



        DoAndroidBilling: function () {
            //1- go to DB - log the fact that user clicked buy for this item at this price at this time

            //2 - call Android specific function - when the android function 

        },



        //after a UB transaction we will get redirected back to the game page ( i.e here!!!!!!!!!!)
        //1 - we want to check our DB to see if we have any open transactions
        //2 - then - for each of the open transactions we call a UB API to see if the transaction was a success
        //3 - if the transaction WAS a success we update our system and give the user the relevant store item (redits,forfeits etc)
        //4 - if the transaction was NOT a success we update our DB!!!
        //5 -  OR - if the transaction was processing - we check again in 30 seconds!!!!
        CheckForOpenStorePurchases: function () { //BillOptionID, thispurchaseId
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));
            if ((user) && (user.id > 0)) {
                if (getPlatform() == 1) {
                    //UB billings are only relevant for WEB!!!!!!!
                    $.ajax(
                        {
                            url: WS_URL_ROOT + "/Game/CheckForSuccessfullUBPurchases",
                            type: "POST",
                            data: "f=" + GetCurrentfixtureID() + "&u=" + user.id + "&fu=" + user.fbuserid,
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                AjaxFail("CheckForOpenStorePurchases" + " additional data we sent was " + "f=" + GetCurrentfixtureID() + "&u=" + user.id + "&fu=" + user.fbuserid, XMLHttpRequest, textStatus, errorThrown);
                            },
                            success: function (response) {
                                //the response here will be a comma seperated list of successfull livegames store purchase ID's
                                //we will call a generic function from here - that EVERY platform will call ( i.e ios and android will both call)
                                //this function will complete the transaction in the DB and return to the client what the user is now entitled to

                                if (response) {
                                    var ListOfCompletedPurchaseIDs = typeof response != 'object' ? JSON.parse(response) : response; //JSON.parse(jsonstring);
                                    var numberOfPurchasesinProcesingState = 0;
                                    for (var i = 0; i <= ListOfCompletedPurchaseIDs.length - 1; i++) {

                                        if ((ListOfCompletedPurchaseIDs[i].ubresultid < 0) || (ListOfCompletedPurchaseIDs[i].ubresultid == 2)) {
                                            //only complete the purchase if it is in a comlete state (i.e dont complete it if it is still processing!!)
                                            Store.CompletePurchase(ListOfCompletedPurchaseIDs[i]);
                                        }
                                        else {
                                            numberOfPurchasesinProcesingState = numberOfPurchasesinProcesingState + 1;
                                        }
                                    }
                                    if (numberOfPurchasesinProcesingState > 0) {
                                        //at least one of the open purchases was not complete ..so call this function again in 30 seconds!!!!

                                        $('.GameFeedInfo').prepend("<b>Store purchase pending - will check again in 30 seconds</b> <br />");
                                        refreshScroller(GameFeedScroller, "GameFeedInfo");

                                        setTimeout("Store.CheckForOpenStorePurchases();", 30000);
                                    }
                                }
                            }
                        }); //end ajax call
                }
                else if (getPlatform() == 2) {
                    //check for ios transactions!
                }
            } //end user check

        }, //CheckForSuccessfullPurchases
        GetStorePurchase: function (storePurchaseID) {
            //call function in GameController via AJAX call to return the StorePurtchase linked to this ID
            $.ajax(
                {
                    url: WS_URL_ROOT + "/Game/GetStorePurchase",
                    type: "POST",
                    data: "&id=" + storePurchaseID,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("LogIOSReceiptID", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {
                        return response;
                    }
                });

        }, //end GetStorePurchase

        //UpdateIOSPurchases: function (IOSReceiptObject, storePurchase) { //BillOptionID, thispurchaseId
        UpdateIOSPurchases: function (IOSReceiptObject, storePurchaseID) { //BillOptionID, thispurchaseId
            //1- log recipt value in DB


            try {

                var storePurchase = Store.GetStorePurchase(storePurchaseID);

                $.ajax(
                {
                    url: WS_URL_ROOT + "/Game/LogIOSReceiptID",
                    type: "POST",
                    data: "&receiptID=" + IOSReceiptObject + "&purchaseID=" + storePurchaseID,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        AjaxFail("LogIOSReceiptID", XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (response) {

                        //if we get in here it means we have logged the receipt id in our DB - now we need to call their API with this ID
                        $.ajax({
                            url: WS_URL_ROOT + "/Game/ValidateReceipt",
                            type: "POST",
                            data: "&jsonString=" + "{\"receipt-data\": \"" + IOSReceiptObject + "\"}",
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                AjaxFail("LogIOSReceiptID", XMLHttpRequest, textStatus, errorThrown);
                            },
                            success: function (response) {
                                var jsonObject = JSON.parse(response);

                                //2 - update DB with these details
                                try {
                                    $.ajax(
                                    {
                                        url: WS_URL_ROOT + "/Game/LogIOSReceiptInfo",
                                        type: "POST",
                                        data: "&transactionID=" + jsonObject["receipt"]["transaction_id"] + "&purchaseDate=" + jsonObject["receipt"]["purchase_date"] + "&purchaseID=" + storePurchaseID +
                                            "&quantity=" + jsonObject["receipt"]["quantity"] + "&productID=" + jsonObject["receipt"]["product_id"] + "&originalPurchaseDate=" + jsonObject["receipt"]["original_purchase_date"] +
                                            "&appItemID=" + jsonObject["receipt"]["app_item_id"] + "&versionExternalId=" + jsonObject["receipt"]["version_external_id"] + "&bid=" + jsonObject["receipt"]["bid"] +
                                            "&bvrs=" + jsonObject["receipt"]["bvrs"] + "&originalTransactionID=" + jsonObject["receipt"]["original_transaction_id"] + "&result=" + jsonObject["status"],
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            AjaxFail("LogIOSReceiptID", XMLHttpRequest, textStatus, errorThrown);
                                        },
                                        success: function (response) {
                                            //3 - call  CompletePurchase()
                                            CompletePurchase(storePurchase);
                                        }
                                    });
                                }
                                catch (ex2) {
                                    logError("DoIOSBilling", ex2);
                                    Store.LogIOSBillingError(jsonObject["exception"], storePurchaseID, jsonObject["status"]);
                                }
                            }
                        });

                    }
                });
            }
            catch (ex2) {
                logError("DoIOSBilling", ex2);
            }
        },

        UpdateAndroidPurchases: function () { //BillOptionID, thispurchaseId
            //1- ????
            //2 - ????
            //3 - ????

            //4 - call  CompletePurchase()


        },


        //this is going to be a generic function that will be called by all platforms after we have recieved the completion
        //of a purchase.
        //Each billing method (UB,ios,android) will, by the time they've reached this call,already have updated the DB with the response
        //they've recieved from their respective biling API's
        //we just need to go to DB now - update the store purchase table , give the user their item and return the details here to the client
        //so we can show the user the result!!!!!!!!
        CompletePurchase: function (completedStorePurchase) {
            var user = JSON.parse(window.sessionStorage.getItem("facebookuser"));

            //first update our DB that the user has selected to buy this BillOptionID for this row in tblStorePurchases (i.e for this purchaserequest)
            $.ajax(
            {
                url: WS_URL_ROOT + "/Game/completeStorePurchase",
                type: "POST",
                data: "fixtureID=" + GetCurrentfixtureID() + "&userid=" + user.id + "&id=" + completedStorePurchase.id + "&fu=" + uiUser.fbuserid, //+ "&s=" + completedStorePurchase.status
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    AjaxFail("CompletePurchase", XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (response) {
                    //the response here will be a store purchase object with details on what the user has just bought!!!

                    if (response.purchaseresult > 0) {
                        //purchase WAS a success - give the user what they paid for!!!!!!

                        $('.storepopup').fadeOut('fast');
                        $('.tooltip-shade').hide();
                        Store.resetinventory(); //this will make sure the store is hidden 

                        $('.popup-notify-purchase > h1').text("Purchase Complete!");
                        $('.popup-notify-purchase > span').text(response.purchaseresult);
                        $('.popup-notify-purchase').fadeIn(200).delay(3000).fadeOut(200);

                        switch (response.storeitemid) {
                            case 1: //the user has purchased an early unlocking of the 200 credit limit
                                thisFixture.unlockcredits = response.purchaseresult;
                                DisplayHigherCreditsAvailabilityToUserV2(response.purchaseresult, 0, 0, "updateTicker");
                                break;
                            case 2:
                                //the user has bought an extra power play!!!
                                var message = '<span>' + response.purchaseresult + '</span>Power Play';
                                if (response.purchaseresult > 1) {
                                    message += "s";
                                }

                                $('#' + displaymode + '_powerplayclickbtn').html(message);
                                $('#powerplayclickbtn2 span').html(response.purchaseresult);


                                $('.powerplayclick').removeClass("off");
                                thisFixture.remainingpowerplays = thisFixture.remainingpowerplays + 1;
                                break;
                            case 3:
                                //the user has bought an extra 5 forfeits
                                $('#' + displaymode + '_forfeitnum').html(response.purchaseresult);

                                var Currentbet;
                                try {
                                    Currentbet = JSON.parse(window.sessionStorage.getItem("Currentbet")); //get bet object from session storage
                                } catch (TempEx) { }

                                if ((Currentbet != null) && (Currentbet.status == 0)) {
                                    //the user currently has a pending bet - so make sure we are showing the option to forfeit
                                    $('#' + displaymode + '_forfeitnum').show();
                                    $('.forfeitclick').show();
                                }

                                remainingforfeits = response.purchaseresult;
                                break;
                            case 4:
                                //the user has bought an extra 1000 credits
                                $('.credits').html(response.purchaseresult);
                                break;
                        }

                    }
                    else {
                        //purchase was not a success - user gets nothing


                    }

                }
            });
        } //end CompletePurchase

    }; //end of return statement
}                        //end store object
