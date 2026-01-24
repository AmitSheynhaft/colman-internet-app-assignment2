import { Request, Response } from "express";
import { createUser, getAllUsers } from "../user.controller";
import User from "../../models/User.model";
import { HTTP_STATUS } from "../../constants/constants";

jest.mock("../../models/User.model");

describe("getAllUsers", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
    mockRequest = {};
  });

  it("should return all users successfully", async () => {
    const mockUsers = [
      { _id: "1", username: "user1", email: "user1@example.com" },
      { _id: "2", username: "user2", email: "user2@example.com" },
    ];
    (User.find as jest.Mock).mockResolvedValue(mockUsers);

    await getAllUsers(mockRequest as Request, mockResponse as Response);

    expect(User.find).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Users retrieved successfully",
      data: mockUsers,
    });
  });

  it("should return empty array when no users exist", async () => {
    (User.find as jest.Mock).mockResolvedValue([]);

    await getAllUsers(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Users retrieved successfully",
      data: [],
    });
  });

  it("should handle database errors", async () => {
    (User.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await getAllUsers(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  });
});

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
