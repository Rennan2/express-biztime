/** Test for companies */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../test-common");
const db = require("../db");
const { describe } = require("yargs");

// clean out data 
beforeEach(createData);

afterAll(async () => {
    await db.end()
})

describe("GET /", function () {
    test("Should respond with array of companies", async function () {
        const response = await request(app).get("/companies");
        expect(response.body).toEqual({
            "companies": [
                {code: "apple", name: "Apple"},
                {code: "microsoft", name: "Microsoft"}
            ]
        })
    })
})

describe("GET /apple", function () {
    test("Should return company information", async function () {
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual(
            {
            "company": {
                code: "apple",
                name: "Apple",
                description: "Maker of OSX",
                invoices: [1, 2],
            }
         }
        );
    });
    test("Should return 404 if company not found", async function () {
        const response = await request(app).get("/companies/asdj");
        expect(response.body).toEqual[404];
    })

});


describe("POST /", function (){
    test("Should add company", async function () {
        const response = await request(app)
        .post("/companies")
        .send({name: "Spotify", description: "music"});

        expect(response.body).toEqual(
            {
                "company": {
                    code: "spotify",
                    name: "Spotify",
                    description: "music",
                }
            }
        );
    });
    test("Should return 500 conflict", async function () {
        const response = await request(app)
        .post("/companies")
        .send({name: "apple", description: "apple"});

        expect(response.status).toBe(500);
    })
});

describe("PUT /", function () {
    test("Should update company ", async function () {
        const response = await request(app)
        .put("/companies/apple")
        .send({name: "AppleEdit", description: "new"});

        expect(response.body).toEqual({
            "company": {
                code: "apple",
                name: "AppleEdit",
                description: "new",
            }
        }

        );

    });

    test("Should return 404 for no company", async function () {
        const response = await request(app)
        .put("/companies/asdj")
        .send({name: "AppleEdit", description: "new"});
        expect(response.status).toEqual(404);
    });

    test("Should return 500 for missing data", async function (){
        const response = await request(app)
        .put("/companies/apple")
        .send({});

        expect(response.status).toBe(500);
    })
});

describe("DELETE /", function (){
    test("Should delete company", async function (){
        const response = await request(app)
        .delete("/companies/apple");
        expect(response.body).toEqual({"status": "deleted"});
    });
    test("should return 404", async function () {
        const response = await request(app)
        .delete("/companies/asdj");
        expect(response.status).toEqual(404);
    });
});