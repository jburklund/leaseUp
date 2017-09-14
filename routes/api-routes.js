// REQUIRE FILES
var db = require("../models/index.js");
var passport = require("passport");

// Routes ============================================================= //

module.exports = function(app) {

    // ---------------------------- GET ROUTES ---------------------------- //

    /// REDIRECT TO LOGIN
    app.get('/', function(req, res) {
        res.redirect('/login');
    });

    /// LOAD LOGIN
    app.get('/login', function(req, res) {
        res.render('login', req);
    });

    /// SHOW REGISTER ON BUTTON CLICK
    app.get("/register", function(req, res) {
        res.render('register', req);
    });

    /// DASHBOARD
    app.get('/dashboard', function(req, res) {
        db.Centers.findAll().then(function(data) {
            var hbsObject = { centers: data };
            res.render('dashboard', hbsObject);
        });
    });

    /// MAP
    app.get("/map", function(req, res) {
        res.render('map', req);
    });

    /// ROUTE TO SHOPPING CENTER PAGE BY ID
    app.get("/center/:id", function(req, res) {
        db.Tenants.findAll({
            where: {
                CenterId: req.params.id
            }
        }).then(function(data) {
            var hbsObject = { tenants: data, center: req.params.id}
            res.render('center', hbsObject);
        });
    });


    // ---------------------------- API GET ROUTES ---------------------------- //

    /// SHOW ALL SHOPPING CENTER INFO
    app.get("/api/centers", function(req, res) {
        db.Centers.findAll({}).then(function(dbCenters) {
            res.json(dbCenters);
        });
    })

    /// SHOW ALL TENANT INFO
    app.get("/api/tenants", function(req, res) {
        db.Tenants.findAll({}).then(function(dbTenants) {
            res.json(dbTenants);
        });
    })


    // ---------------------------- POST ROUTES ---------------------------- //


    /// PASSPORT AUTHENTICATION

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    /// ADD A NEW TENANT

    app.post("/api/newTenant", function(req, res) {

        // LOG INFO FROM REQ.BODY FROM MODAL FORM
        console.log("------------------------");
        console.log(req.body);
        console.log("------------------------");

        // ADD TO TENANTS TABLE
        db.Tenants.create({
            CenterId: req.body.centerId,
            tenantName: req.body.tenantName,
            tenantSF: req.body.tenantSF,
            leaseStart: req.body.leaseStart,
            leaseEnd: req.body.leaseEnd,
            basePSF: req.body.basePSF,
            camPSF: req.body.camPSF,
            totalPSF: parseInt(req.body.basePSF) + parseInt(req.body.camPSF),
            annualRent: (parseInt(req.body.basePSF) + parseInt(req.body.camPSF)) * parseInt(req.body.tenantSF),
            salesPSF: req.body.salesPSF,
            annualSales: parseInt(req.body.salesPSF) * parseInt(req.body.tenantSF),
            occupancy: (parseInt(req.body.basePSF) + parseInt(req.body.camPSF)) / parseInt(req.body.salesPSF),
            noticeDate: req.body.noticeDate,
            noticeRent: req.body.noticeRent
        }).then(function(data) {

            // REDIRECT TO CENTER PAGE
            res.redirect("/center/" + req.body.centerId);

        }).catch(function(error) {

            // REPORT ERRORS
            res.send(error);
        });

    });


    /// EDIT AN EXISTING TENANT

    app.post("/api/edit/:centerID/:tenantID", function(req, res) {

        console.log("\n\n\n>>>>");
        console.log("centerID:" + req.params.centerID);
        console.log("tenantID:" + req.params.tenantID);
        console.log(req.body);
        console.log("\n\n\n>>>>");

        var totalPSF = parseInt(req.body.basePSF) + parseInt(req.body.camPSF);
        var annualRent = parseInt(req.body.basePSF) * parseInt(req.body.tenantSF);
        var annualSales = parseInt(salesPSF) * parseInt(req.body.tenantSF);
        var occupancy = parseInt(salesPSF) / parseInt(totalPSF);

        // ADD EDITS TO TENANT TABLE BY TENANTID
        db.Tenants.update({
            tenantName: req.body.tenantName,
            centerID: req.params.centerID,
            tenantSF: req.body.tenantSF,
            leaseStart: req.body.leaseStart,
            leaseEnd: req.body.leaseEnd,
            basePSF: req.body.basePSF,
            camPSF: req.body.camPSF,
            totalPSF: totalPSF,
            annualRent: annualRent,
            salesPSF: req.body.salesPSF,
            annualSales: annualSales,
            occupancy: occupancy,
            noticeDate: req.body.noticeDate,
            noticeRent: req.body.noticeRent
        }, {
            where: { _id: req.params.id }

            // REDIRECT TO SHOPPING CENTER PAGE
        }).then(function(data) {

            res.redirect("/center/" + data.centerID);

            // CATCH ERRORS
        }).catch(function(error) {

            res.send(error);
        });


        /// DELETE A TENANT

        app.post("/api/remove/:centerID/:tenantID", function(req, res) {

            console.log("\n\n\n>>>>");
            console.log("centerID:" + req.params.centerID);
            console.log("tenantID:" + req.params.tenantID);
            console.log(req.body);
            console.log("\n\n\n>>>>");

            db.Tenants.destroy({
                where: { id: req.params.tenantID }

                // REDIRECT TO SHOPPING CENTER PAGE
            }).then(function(data) {

                res.redirect("/center/" + data.centerID);

                // CATCH ERRORS
            }).catch(function(error) {

                res.send(error);
            });

        });

    });

};