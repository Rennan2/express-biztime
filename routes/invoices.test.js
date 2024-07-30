/** Tests for invoices */

const request = require("supertest");
const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");
const { describe } = require("yargs");


// clean up data 
beforeEach(createData);
afterAll(async () => {
  await db.end()
})

describe("GET /", function () {
    test("Should respond with array of invoices", async function () {
        const response = await request(app).get("/invoices");
        expect(response.body).toEqual({
            "invoices": [
                {id: 1, comp_code: "apple"},
                {id: 2, comp_code: "apple"},
                {id: 3, comp_code: "microsoft"},
            ]
        });
    })
});

describe("GET /1", function () {
    test("Should return invoice info", async function () {
        const response = await request(app).get("/invoices/1");
        expect(response.body).toEqual(
            {
                "invoice": {
                    id: 1,
                    amt: 200,
                    paid: false,
                    paid_date: null,
                    company: {
                        code: 'apple',
                        name: 'Apple',
                        description: 'Maker of OSX',
                    }
                }
            }
        );
        
    });
    test("Return 404 for no invoice", async function () {
        const response = await request(app).get("/invoices/4");
        expect(response.status).toBe(404);
    })
});

describe("POST /", function () {
    test("Should add invoice", async function (){
        const response = await request(app)
        .post("/invoices")
        .send({amt: 200, comp_code: 'microsoft'});
        expect(response.body).toEqual(
            {
                "invoice": {
                    id: 4,
                    comp_code: "microsoft",
                    amt: 200,
                    paid: false,
                    paid_date: null,
                }
            }
        );
    });
});

describe("PUT /", function () {
    test("Should update invoice", async function () {
        const response = await request(app)
          .put("/invoices/1")
          .send({amt: 500, paid: false});

          expect(response.body).toEqual(
            {
                "invoice": {
                    id: 1,
                    comp_code: "apple",
                    amt: 500,
                    paid: false,
                    paid_date: null,
                }
            }
          );
    });

    test("Should return 404 for no invoice", async function () {
        const response = await request(app)
          .put("/invoices/4")
          .send({amt: 500});

        expect(response.status).toEqual(404);
    });
    test("Should return 500 for missing data", async function (){
        const response = await request(app)
        .put("/invoices/4")
        .send({amt: 500});
        expect(response.status).toEqual(500);
    })
});

describe("DELETE /", function () {
    test("Should delete invoice", async function() {
        const response = await request(app)
        .delete("/invoices/1");
        expect(response.body).toEqual({"status": "deleted"});
    });

    test("Return 404 for no invoices", async function (){
        const response = await request(app)
        .delete("/invoices/4");
        expect(response.status).toEqual(404);
    })
})