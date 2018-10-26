$(document).ready(function(){

    // Bind functions to navbar links
    $.each($("#nav-bar .nav-item"), function(index, value) {
        $(value).click(function (event) {
            event.preventDefault();
            $("#container").empty()

            // Change active nav item
            $("#nav-bar .nav-item.active").removeClass("active");
            $(this).addClass("active");

            let requestedPage = $(this).find('a').attr("href")
            if(requestedPage === "manufacturers") {
                $("#container").append("<div id='manufacturers-container'></div>")

                loadManufacturersListPage();
            } else if (requestedPage === "cars") {
                $("#container").append("<div id='cars-container'></div>")

                loadCarsListPage();
            } else {
                open("index.html", "_self");
            }
        });
    })

    // List manufacturers
    function loadManufacturersListPage() {
        $("#manufacturers-container").empty();
        $("#manufacturers-container").append("<h1>Listing manufacturers</h1>");
    
        let list = $("<div id='manufacturers-list'></div>")
        $.get("manufacturers", function(manufacturers) {
            for (manufacturer of manufacturers) {

                let listItem = $("<div class='list-item'></div>");
                listItem.append("<div class='list-item-header'><img src='images/no_img.jpg'/></div>");

                let itemContent = $("<div class='list-item-content'></div>");
                itemContent.append("<table></table>");

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Name:</th>")
                itemContent.find("table tr:last").append("<td><a href='javascript:void(0)'>" + manufacturer.name + "</a></td>")
                
                // Needed to prevent global variable overriding
                let name = manufacturer.name;
                itemContent.find("table tr:last td a").click( function() {
                    loadCarsForManufacturersListPage(name)
                });

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Country:</th>")
                itemContent.find("table tr:last").append("<td>" + manufacturer.country + "</td>")


                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Founded:</th>")
                itemContent.find("table tr:last").append("<td>" + manufacturer.founded + "</td>")

                listItem.append(itemContent);

                list.append(listItem);
            }

            let addMoreItem = $("<div class='list-item-action'>");
            addMoreItem.append("<table><tr><td></td></tr></table>");
            addMoreItem.find("table tr td").append("<img src='images/plus_sign_blue.png' width='100px' height='100px'/>")
            
            $(addMoreItem).hover( function() {
                $(addMoreItem).find("table td img").attr("src","images/plus_sign_white.png");
            }, function() {
                $(addMoreItem).find("table td img").attr("src","images/plus_sign_blue.png");
            })
            
            $(addMoreItem).click(loadManufacturersAddPage);
            
            list.append(addMoreItem);
        })

        $("#manufacturers-container").append(list);
    }

    // List cars for specific manufacturer
    function loadCarsForManufacturersListPage(manufacturerName) {
        document.cookie = "name=" + manufacturerName;
        $("#container").empty()
        $("#container").append("<div id='cars-container'></div>")
        $("#cars-container").append("<h1>Listing cars for <span>" + manufacturerName + "</span></h1>");
    
        let list = $("<div id='cars-list'></div>")

        let backItem = $("<div class='list-item-action'>");
        backItem.append("<table><tr><td></td></tr></table>");
        backItem.find("table tr td").append("<img src='images/back_sign_blue.png' width='100px' height='100px'/>")
        
        $(backItem).hover( function() {
            $(backItem).find("table td img").attr("src","images/back_sign_white.png");
        }, function() {
            $(backItem).find("table td img").attr("src","images/back_sign_blue.png");
        })

        $(backItem).click(function() {
                $("#nav-bar .nav-item.active").trigger( "click" );
        });
            
        list.append(backItem);

        $.get("manufacturer", function(cars) {
            for (car of cars) {

                let listItem = $("<div class='list-item'></div>");
                listItem.append("<div class='list-item-header'><img src='images/no_img.jpg'/></div>");

                let itemContent = $("<div class='list-item-content'></div>");
                itemContent.append("<table></table>");

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Manufacturer:</th>")
                itemContent.find("table tr:last").append("<td>" + car.manufacturer + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Model:</th>")
                itemContent.find("table tr:last").append("<td>" + car.name + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Year:</th>")
                itemContent.find("table tr:last").append("<td>" + car.year + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Horsepower:</th>")
                itemContent.find("table tr:last").append("<td>" + car.horsepower + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Consumption:</th>")
                itemContent.find("table tr:last").append("<td>" + car.consumption + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Color:</th>")
                itemContent.find("table tr:last").append("<td>" + car.color + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Amount:</th>")
                itemContent.find("table tr:last").append("<td>" + car.available + "</td>")

                listItem.append(itemContent);
                list.append(listItem);
            }
        })

        $("#cars-container").append(list);

    }

    // Load add manufacturers form
    function loadManufacturersAddPage() {
        $("#manufacturers-container").empty();

        $("#manufacturers-container").append("<h1>Add new manufcaturer</h1>");

        $.get("addManufacturerForm.html", function( formHTML ) {
            form = $(formHTML)
            form.submit(function(event){
                event.preventDefault()

                $.ajax({
                    url: 'addManufacturers',
                    type: 'post',
                    data: $(this).serializeArray(),
                    success: function( data, textStatus, jQxhr ){
                        loadManufacturersListPage()
                    },
                    error: function( jqXhr, textStatus, errorThrown ) {
                        if (jqXhr.status === 409) {
                            alert("There is already a manufacturer in the database with that name")
                        } else {
                            alert("Something went wrong, see log for more information")
                            console.log(jqXhr)
                        }
                    }
                });

            })

            // Set callback for back button
            form.find(".form-action-row input.form-button[name=back]").click(loadManufacturersListPage);

            // Set founded input max value to tomorrow
            form.find(".form-row .form-row-content input[name='founded']").attr(
                "max",
                new Date().toISOString().split("T")[0]
            )

            $("#manufacturers-container").append(form)
        }, 'html')
    }

    // List cars
    function loadCarsListPage() {
        $("#cars-container").empty();
        $("#cars-container").append("<h1>Listing cars</h1>");

        let list = $("<div id='cars-list'></div>")
        $.get("cars", function(cars) {
            for (car of cars) {

                let listItem = $("<div class='list-item'></div>");
                listItem.append("<div class='list-item-header'><img src='images/no_img.jpg'/></div>");

                let itemContent = $("<div class='list-item-content'></div>");
                itemContent.append("<table></table>");

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Manufacturer:</th>")
                itemContent.find("table tr:last").append("<td><a href='javascript:void(0)'>" + car.manufacturer + "</a></td>")
                itemContent.find("table tr:last td a").click();

                // Needed to prevent global variable overriding
                let name = car.manufacturer;
                itemContent.find("table tr:last td a").click( function() {
                    loadCarsForManufacturersListPage(name)
                });

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Model:</th>")
                itemContent.find("table tr:last").append("<td>" + car.name + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Year:</th>")
                itemContent.find("table tr:last").append("<td>" + car.year + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Horsepower:</th>")
                itemContent.find("table tr:last").append("<td>" + car.horsepower + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Consumption:</th>")
                itemContent.find("table tr:last").append("<td>" + car.consumption + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Color:</th>")
                itemContent.find("table tr:last").append("<td>" + car.color + "</td>")

                itemContent.find("table").append("<tr></tr>");
                itemContent.find("table tr:last").append("<th>Amount:</th>")
                itemContent.find("table tr:last").append("<td>" + car.available + "</td>")

                listItem.append(itemContent);
                list.append(listItem);
            }

            let addMoreItem = $("<div class='list-item-action'>");
            addMoreItem.append("<table><tr><td></td></tr></table>");
            addMoreItem.find("table tr td").append("<img src='images/plus_sign_blue.png' width='100px' height='100px'/>")
            
            $(addMoreItem).hover( function() {
                $(addMoreItem).find("table td img").attr("src","images/plus_sign_white.png");
            }, function() {
                $(addMoreItem).find("table td img").attr("src","images/plus_sign_blue.png");
            })
            
            $(addMoreItem).click(loadCarsAddPage);
            
            list.append(addMoreItem);
        })

        $("#cars-container").append(list);
    }

    // Load add cars form
    function loadCarsAddPage() {
        $("#cars-container").empty();

        $("#cars-container").append("<h1>Add new car</h1>");

        $.get("addCarForm.html", function( formHTML ) {
            form = $(formHTML)
            form.submit(function(event){
                event.preventDefault()

                $.ajax({
                    url: 'addCar',
                    type: 'post',
                    data: $(this).serializeArray(),
                    success: function( data, textStatus, jQxhr ){
                        loadCarsListPage()
                    },
                    error: function( jqXhr, textStatus, errorThrown ) {
                        if (jqXhr.status === 409) {
                            alert("There is already a car in the database with that model")
                        } else {
                            alert("Something went wrong, see log for more information")
                            console.log(jqXhr)
                        }
                    }
                });

            })

            // Set callback for back button
            form.find(".form-action-row input.form-button[name=back]").click(loadCarsListPage);

             // Set year input max value to current year
             form.find(".form-row .form-row-content input[name='year']").attr("max", new Date().getFullYear())

             // Populate manufacturers select options
             $.get("manufacturerNames", function(manufacturers) {
                 for (manufacturer of manufacturers) {
                     form.find(".form-row select[name='manufacturer']").append("<option value='" + manufacturer + "'>" + manufacturer + "</option>")
                 }
             });
 

            $("#cars-container").append(form)
        }, 'html')
    }

});

