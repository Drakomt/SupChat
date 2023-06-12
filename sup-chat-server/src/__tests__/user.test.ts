const { signUp, getUserByToken, login, addContact, addChat } = require("../controllers/user.ts");
const { mongoConnect, mongoDisconnect } = require("../services/mongo.ts");
const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());
app.post("/signup", signUp);
app.post("/login", login);
app.get("/getUserByToken", getUserByToken);
app.put("/addContact", addContact);
app.post("/addNewChat", addChat);

jest.mock("../repository/Sup.ts", () => {
    return {
        userRep: {
            add: jest.fn().mockImplementation((user) => {
                return user;
            }),
            findByEmail: jest.fn().mockImplementation((email) => {
                if(email === "tomer1@gmail.com") {
                    return { email: email, password: "$2b$12$m1S4eJ.asqAcYB6f4GqVgebYxVSkYxhsi8wn6T4ijNEAb0h.eO4TS" };
                } else {
                    return null;;
                }
            }),
            findById: jest.fn().mockImplementation((id) => {
                return { _id: id, username: "tomer1", email: "tomer1@gmail.com" };
            }),
            update: jest.fn().mockImplementation((id, user) => {
                return user;
            }),
        },
        chatRep: {
            add: jest.fn().mockImplementation((chat) => {
                return chat;
            }),
        },
    };
});

beforeAll(async () => {
    await mongoConnect();
});

afterAll(async () => {
    await mongoDisconnect();
});

describe("Testing user functions", () => {
    test("Signup should add a user", async () => {
        const res = await request(app)
            .post("/signup")
            .send({email: "tomer1@gmail.com", username: "tomer1", password: "$2b$12$m1S4eJ.asqAcYB6f4GqVgebYxVSkYxhsi8wn6T4ijNEAb0h.eO4TS"});
            expect(res.status).toBe(201);
    });

    test("login should return user and token if email and password are correct", async () => {
        const res = await request(app)
            .post("/login")
            .send({email: "tomer1@gmail.com", password: "$2b$12$m1S4eJ.asqAcYB6f4GqVgebYxVSkYxhsi8wn6T4ijNEAb0h.eO4TS"});
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
    });

    test("getUserByToken should return user if token is valid", async () => {
        const res = await request(app)
            .get("/getUserByToken")
            .send({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDZkZjU3ODNmYzcyZjAyZTliZDM0MGEiLCJpYXQiOjE2ODYxNDU1MDUsImV4cCI6MTY4NjE0OTEwNX0.BSXbpKbGd0MIfLhZhVOGNwG2ZjLGE9Wh4kQsTl0yYrM"});
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
    });

    test("addContact should update user's friend list", async () => {
        const res = await request(app)
            .put("/addContact")
            .send({user: {_id: "646df5783fc72f02e9bd340a", friends: ["646df5923fc72f02e9bd340f","646df5e73fc72f02e9bd3426"]}});
            expect(res.status).toBe(202);
    });

    test("addChat should add a chat", async () => {
        const res = await request(app)
            .post("/addNewChat")
            .send({participants: [{_id: "646df5783fc72f02e9bd340a"},{_id: "646df5923fc72f02e9bd340f"},{_id: "646df5e73fc72f02e9bd3426"}]});
            expect(res.status).toBe(202);
    })
})
