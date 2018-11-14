$(document).ready(function () {

    // Bind functions to nav-bar links
    $.each($("#nav-bar .nav-item"), function (index, value) {
        $(value).click(function (event) {
            event.preventDefault();

            // Change active nav item
            $("#nav-bar .nav-item.active").removeClass("active");
            $(this).addClass("active");

            let requestedPage = $(this).find('a').attr("href");
            if (requestedPage === "manufacturers") {
                loadManufacturersListPage();
            } else if (requestedPage === "cars") {
                loadCarsListPage();
            } else {
                open("index.html", "_self");
            }
        });
    });

    // List manufacturers
    function loadManufacturersListPage() {
        $("#container").html("<div id='manufacturers-container'><h1>Listing manufacturers</h1></div>");

        let list = $("<div id='manufacturers-list'></div>");
        $.get("/manufacturers", function (manufacturers) {
            for (let manufacturer of manufacturers) {
                list.append(createManufacturerHtml(manufacturer, true));
            }

            let addMoreItem = $("<div class='list-item-action'>");
            addMoreItem.append("<table><tr><td></td></tr></table>");
            addMoreItem.find("table tr td").append("<img src='images/plus_sign_blue.png' width='100px' height='100px'/>");

            $(addMoreItem).hover(function () {
                $(this).find("table td img").attr("src", "images/plus_sign_white.png");
            }, function () {
                $(this).find("table td img").attr("src", "images/plus_sign_blue.png");
            });

            $(addMoreItem).click(loadManufacturersAddPage);

            list.append(addMoreItem);
        });

        $("#manufacturers-container").append(list);
    }

    // List cars for specific manufacturer
    function loadCarsForManufacturersListPage(manufacturerName) {
        document.cookie = "name=" + manufacturerName;
        $("#container").html("<div id='cars-container'><h1>Listing cars for <span>" + manufacturerName + "</span></h1></div>");

        let list = $("<div id='cars-list'></div>");

        let backItem = $("<div class='list-item-action'>");
        backItem.append("<table><tr><td></td></tr></table>");
        backItem.find("table tr td").append("<img src='images/back_sign_blue.png' width='100px' height='100px'/>");

        $(backItem).hover(function () {
            $(this).find("table td img").attr("src", "images/back_sign_white.png");
        }, function () {
            $(this).find("table td img").attr("src", "images/back_sign_blue.png");
        });

        $(backItem).click(function () {
            $("#nav-bar .nav-item.active").trigger("click");
        });

        list.append(backItem);

        $.get("/manufacturer", function (cars) {
            for (let car of cars) {
                list.append(createCarCardHtml(car, false));
            }
        });

        $("#cars-container").append(list);

    }

    // List cars
    function loadCarsListPage() {
        $("#container").html("<div id='cars-container'><h1>Listing cars</h1></div>");

        let list = $("<div id='cars-list'></div>");
        $.get("/cars", function (cars) {
            for (let car of cars) {
                list.append(createCarCardHtml(car, true));
            }

            let addMoreItem = $("<div class='list-item-action'>");
            addMoreItem.append("<table><tr><td></td></tr></table>");
            addMoreItem.find("table tr td").append("<img src='images/plus_sign_blue.png' width='100px' height='100px'/>");

            $(addMoreItem).hover(function () {
                $(this).find("table td img").attr("src", "images/plus_sign_white.png");
            }, function () {
                $(this).find("table td img").attr("src", "images/plus_sign_blue.png");
            });

            $(addMoreItem).click(loadCarsAddPage);

            list.append(addMoreItem);
        });

        $("#cars-container").append(list);
    }

    // Create manufacturer's card html
    function createManufacturerHtml(manufacturer, hasLink) {
        let listItem = $("<div class='list-item'></div>");
        listItem.append("<div class='list-item-header'><img src='images/no_img.jpg'/></div>");

        let itemContent = $("<div class='list-item-content'></div>");
        itemContent.append("<table></table>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Name:</th>");

        if (hasLink === true) {
            let link = $("<a href='javascript:void(0)'>" + manufacturer.name + "</a>");
            link.click(function () {
                loadCarsForManufacturersListPage(manufacturer.name);
            });

            itemContent.find("table tr:last").append("<td></td>");
            itemContent.find("table tr:last td").append(link);
        } else {
            itemContent.find("table tr:last").append("<td>" + manufacturer.name + "</td>");
        }

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Country:</th>");
        itemContent.find("table tr:last").append("<td>" + manufacturer.country + "</td>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Founded:</th>");
        itemContent.find("table tr:last").append("<td>" + manufacturer.founded + "</td>");

        listItem.append(itemContent);

        return listItem;
    }

    // Create car's card html
    function createCarCardHtml(car, hasLink) {
        let listItem = $("<div class='list-item'></div>");
        listItem.append("<div class='list-item-header'><img src='images/no_img.jpg'/></div>");

        let itemContent = $("<div class='list-item-content'></div>");
        itemContent.append("<table></table>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Manufacturer:</th>");

        if (hasLink === true) {
            let link = $("<a href='javascript:void(0)'>" + car.manufacturer + "</a>");
            link.click(function () {
                loadCarsForManufacturersListPage(car.manufacturer);
            });

            itemContent.find("table tr:last").append("<td></td>");
            itemContent.find("table tr:last td").append(link);
        } else {
            itemContent.find("table tr:last").append("<td>" + car.manufacturer + "</td>");
        }

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Model:</th>");
        itemContent.find("table tr:last").append("<td>" + car.name + "</td>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Year:</th>");
        itemContent.find("table tr:last").append("<td>" + car.year + "</td>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Horsepower:</th>");
        itemContent.find("table tr:last").append("<td>" + car.horsepower + "</td>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Consumption:</th>");
        itemContent.find("table tr:last").append("<td>" + car.consumption + "</td>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Color:</th>");
        itemContent.find("table tr:last").append("<td>" + car.color + "</td>");

        itemContent.find("table").append("<tr></tr>");
        itemContent.find("table tr:last").append("<th>Amount:</th>");
        itemContent.find("table tr:last").append("<td>" + car.available + "</td>");

        listItem.append(itemContent);

        return listItem;
    }

    // Load add manufacturers form
    function loadManufacturersAddPage() {
        $("#container").html("<div id='manufacturers-container'><h1>Add new manufacturer</h1></div>");

        $.get("addManufacturerForm.html", function (formHTML) {
            let form = $(formHTML);
            form.submit(function (event) {
                event.preventDefault();

                $.ajax({
                    url: 'addManufacturers',
                    type: 'post',
                    data: $(this).serialize(),
                    success: function () {
                        loadManufacturersListPage()
                    },
                    error: function (jqXhr) {
                        if (jqXhr.status === 409) {
                            alert("There is already a manufacturer in the database with that name")
                        } else {
                            alert("Something went wrong, see log for more information");
                            console.log(jqXhr)
                        }
                    }
                });

            });

            // Set callback for back button
            form.find(".form-action-row input.form-button[name=back]").click(loadManufacturersListPage);

            // Set founded input max value to tomorrow
            form.find(".form-row .form-row-content input[name='founded']").attr(
                "max",
                new Date().toISOString().split("T")[0]
            );

            $("#manufacturers-container").append(form)
        }, 'html')
    }

    // Load add cars form
    function loadCarsAddPage() {
        $("#container").html("<div id='cars-container'><h1>Add new car</h1></div>");

        $.get("addCarForm.html", function (formHTML) {
            let form = $(formHTML);
            form.submit(function (event) {
                event.preventDefault();

                $.ajax({
                    url: 'addCar',
                    type: 'post',
                    data: $(this).serialize(),
                    success: function () {
                        loadCarsListPage()
                    },
                    error: function (jqXhr) {
                        if (jqXhr.status === 409) {
                            alert("There is already a car in the database with that model");
                        } else {
                            alert("Something went wrong, see log for more information");
                            console.log(jqXhr)
                        }
                    }
                });

            });

            // Set callback for back button
            form.find(".form-action-row input.form-button[name=back]").click(loadCarsListPage);

            // Set year input max value to current year
            form.find(".form-row .form-row-content input[name='year']").attr("max", new Date().getFullYear());

            // Populate manufacturers select options
            $.get("manufacturerNames", function (manufacturers) {
                for (let manufacturer of manufacturers) {
                    form.find(".form-row select[name='manufacturer']").append("<option value='" + manufacturer + "'>" + manufacturer + "</option>");
                }
            });


            $("#cars-container").append(form);
        }, 'html');
    }

});