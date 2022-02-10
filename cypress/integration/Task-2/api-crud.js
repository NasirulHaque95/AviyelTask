/// <reference types="Cypress" />

describe("Validate CRUD operation via API using Cypress", () => {
    it('Should check and validate the API', () => {
        cy.request({
            method: 'GET',
            url: 'https://restful-booker.herokuapp.com/ping'
        }).then(response => {
            expect(response.status).to.eq(201)
        })

        cy.request({
            method: 'GET',
            url: 'https://restful-booker.herokuapp.com/booking'
        }).then(response => {
            expect(response.status).to.eq(200)
            cy.log(JSON.stringify(response))
        })
    })
    it('Create,Read,Update,Delete a New Booking', () => {

        //Generate Token
        let token
        cy.request({
            method: 'POST',
            url : 'https://restful-booker.herokuapp.com/auth',
            body : {
                "username" : "admin",
                "password" : "password123"
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            // cy.log(JSON.stringify(response))
            token = response.body.token
            cy.log("Your token is: "+ token)
        })

        //Create Booking
        let lName = ""
        var pattern = "ABCdef"
        for (var i=0; i<5; i++)
        lName+=pattern.charAt(Math.floor(Math.random()*pattern.length));
        let bookId;
        cy.request({
            method: 'POST',
            url : 'https://restful-booker.herokuapp.com/booking/',
            body : {
                "firstname" : "Test",
                "lastname" : lName,
                "totalprice" : 123,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : "2023-05-05",
                    "checkout" : "2023-05-10"
                },
                "additionalneeds" : "Breakfast"
            },
            headers: {
                'content-type': 'application/json',
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.booking).has.property('firstname','Test')
            expect(response.body.booking).has.property('lastname',lName)
            expect(response.body.booking).has.property('totalprice',123)
            bookId = response.body.bookingid
            cy.log("Your Booking ID is: "+ bookId)

            //Get Booking details using bookingId
            cy.request({
                method: 'GET',
                url : 'https://restful-booker.herokuapp.com/booking/'+bookId,
                headers: {
                    'accept' : 'application/json',
                }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).has.property('firstname','Test')
                    expect(response.body).has.property('lastname',lName)
                    expect(response.body).has.property('totalprice',123)

                    //Update Firstname and Price field
                    cy.request({
                        method: 'PATCH',
                        url : 'https://restful-booker.herokuapp.com/booking/'+bookId,
                        headers: {
                            'content-type': 'application/json',
                            'accept' : 'application/json',
                            'cookie' : `token=${token}`
                        },
                        body : {
                            "firstname" : "PutTest",
                            "totalprice" : 12345,
                        }
                        }).then((response) => {
                            expect(response.status).to.eq(200)
                            expect(response.body).has.property('firstname','PutTest')
                            expect(response.body).has.property('totalprice',12345)
                        })

                        //Delete Booking using bookingId
                        cy.request({
                            method: 'DELETE',
                            url : 'https://restful-booker.herokuapp.com/booking/'+bookId,
                            headers: {
                            'content-type': 'application/json',
                            'accept' : 'application/json',
                            'cookie' : `token=${token}`
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(201)
                        })
                        cy.request({
                            method: 'GET',
                            url : 'https://restful-booker.herokuapp.com/booking/'+bookId,
                            failOnStatusCode: false,
                            headers: {
                            'content-type': 'application/json',
                            },
                        }).then((response) => {
                            expect(response.status).to.eq(404)
                        })
                })
        }) 
    });
})