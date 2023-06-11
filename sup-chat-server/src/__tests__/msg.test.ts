const { addMessage } = require("../controllers/msg");
const  { Sup } = require("../repository/Sup");
const { Message } = require("../schemas/message");
const { Chat } = require("../schemas/chat");

jest.mock("../repository/Sup");

describe("add new message", () => {
    test("should add a message", async () => {
        const mockRequest: any = {
            body: {
                text: "Hello",
                dateTime: "2023-06-01T00:00:00Z",
                user: { _id: "646df5783fc72f02e9bd340a" },
                chat: { _id: "646df6833fc72f02e9bd3451" }
            },
        };

        const mockResponse: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const mockChat = new Chat();
        mockChat.messages = [];

        const sup = new Sup();
        sup.messageRep.add = jest.fn();
        sup.chatRep.getById = jest.fn().mockResolvedValue(mockChat);
        sup.chatRep.update = jest.fn();

        // It provides the mock Sup object when addMessage tries to instantiate it
        jest.spyOn(Sup.prototype, 'constructor').mockReturnValue(sup);
        await addMessage(mockRequest, mockResponse);

        expect(sup.messageRep.add).toBeCalledWith(expect.any(Message));
        expect(sup.chatRep.getById).toBeCalledWith("646df6833fc72f02e9bd3451");
        expect(sup.chatRep.update).toBeCalledWith("646df6833fc72f02e9bd3451",expect.any(Chat));
        expect(mockResponse.status).toBeCalledWith(201);
        expect(mockResponse.send).toBeCalledWith("message sent to server");
    });
});
