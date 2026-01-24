import { Request, Response } from "express";
import { createUser } from "../user.controller";
import User from "../../models/User.model";
import { HTTP_STATUS } from "../../constants/constants";

jest.mock("../../models/User.model");

describe("createUser", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
    mockRequest = { body: {} };
  });

  it("should return 400 if required fields are missing", async () => {
    mockRequest.body = { username: "testuser" };
    await createUser(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Missing required fields: username and email are required",
    });
  });

  it("should return 409 if username already exists", async () => {
    mockRequest.body = { username: "existinguser", email: "new@example.com" };
    (User.findOne as jest.Mock).mockResolvedValueOnce({ username: "existinguser" });
    await createUser(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.CONFLICT);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Username already exists",
    });
  });

  it("should create user successfully with valid data", async () => {
    const userData = { username: "newuser", email: "new@example.com" };
    const savedUser = { _id: "123", ...userData, refreshTokens: [] };
    mockRequest.body = userData;
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const saveMock = jest.fn().mockResolvedValue(savedUser);
    (User as unknown as jest.Mock).mockImplementation(() => ({ save: saveMock }));
    await createUser(mockRequest as Request, mockResponse as Response);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  });
});
