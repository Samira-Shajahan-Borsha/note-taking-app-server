"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/serverless.ts
var serverless_exports = {};
__export(serverless_exports, {
  default: () => handler
});
module.exports = __toCommonJS(serverless_exports);

// src/app.ts
var import_express6 = __toESM(require("express"), 1);
var import_http_status_codes12 = __toESM(require("http-status-codes"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);

// src/app/routes/index.ts
var import_express5 = require("express");

// src/app/modules/user/user.route.ts
var import_express = require("express");

// src/app/middlewares/validateRequest.ts
var validateRequest = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    next(error);
  });
};

// src/app/modules/user/user.interface.ts
var ROLE = /* @__PURE__ */ ((ROLE2) => {
  ROLE2["ADMIN"] = "ADMIN";
  ROLE2["USER"] = "USER";
  return ROLE2;
})(ROLE || {});

// src/app/modules/user/user.model.ts
var import_mongoose = require("mongoose");
var userSchema = new import_mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must contain at least 2 characters"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      trim: true
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLE),
        message: "{VALUE} is not supported as role"
      },
      default: "USER" /* USER */,
      required: true
    },
    interests: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ interests: 1 });
userSchema.index({ createdAt: -1 });
var User = (0, import_mongoose.model)("User", userSchema);

// src/app/utils/password.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/app/config/env.ts
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var loadEnvVariables = () => {
  const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_ACCESS_TOKEN_EXPIRES_IN",
    "JWT_REFRESH_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_EXPIRES_IN",
    "FRONTEND_URL"
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require env variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    FRONTEND_URL: process.env.FRONTEND_URL
  };
};
var envVars = loadEnvVariables();

// src/app/utils/password.ts
var hashPassword = (plainPassword) => import_bcryptjs.default.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND));
var verifyPassword = (plainPassword, hashedPassword) => import_bcryptjs.default.compare(plainPassword, hashedPassword);

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/modules/user/user.service.ts
var import_http_status_codes = __toESM(require("http-status-codes"), 1);

// src/app/utils/queryBuilder.ts
var QueryBuilder = class {
  modelQuery;
  query;
  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  sort() {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build() {
    return this.modelQuery;
  }
  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments(
      this.modelQuery.getFilter()
    );
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);
    return {
      page,
      limit,
      total: totalDocuments,
      totalPage
    };
  }
};

// src/app/modules/user/user.service.ts
var createUser = async (payload) => {
  const { name, email, password: plainPassword, role, interests } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError_default(import_http_status_codes.default.CONFLICT, "User with this email already exists");
  }
  const hashedPassword = await hashPassword(plainPassword);
  const result = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "USER" /* USER */,
    interests
  });
  const { password, ...user } = result.toObject();
  return user;
};
var getAllUsers = async (query) => {
  const queryBuilder = new QueryBuilder(User.find().select("-password"), query);
  const users = queryBuilder.paginate().sort();
  const [result, meta] = await Promise.all([users.build(), users.getMeta()]);
  return { result, meta };
};
var getSingleUser = async (id) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError_default(import_http_status_codes.default.NOT_FOUND, "User doesn't exist");
  }
  const { password, ...user } = isUserExist.toObject();
  return user;
};
var getUsersGroupedByInterests = async () => {
  const result = await User.aggregate([
    {
      $unwind: "$interests"
    },
    {
      $group: {
        _id: "$interests",
        count: {
          $sum: 1
        },
        users: {
          $push: {
            userId: "$_id",
            name: "$name",
            email: "$email",
            role: "$role"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        interest: "$_id",
        count: 1,
        users: 1
      }
    }
  ]);
  return result;
};
var updateUser = async (id, payload) => {
  const { name, email, password: plainPassword, role, interests } = payload;
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError_default(import_http_status_codes.default.NOT_FOUND, "User doesn't exist");
  }
  if (email) {
    const isEmailTaken = await User.findOne({ email, _id: { $ne: id } });
    if (isEmailTaken) {
      throw new AppError_default(import_http_status_codes.default.CONFLICT, "User with this email already exists");
    }
  }
  const updatedData = { name, email, role, interests };
  if (plainPassword) {
    updatedData.password = await hashPassword(plainPassword);
  }
  const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true
  });
  if (!updatedUser) {
    throw new AppError_default(import_http_status_codes.default.NOT_FOUND, "User doesn't exist");
  }
  const { password, ...user } = updatedUser.toObject();
  return user;
};
var deleteUser = async (id) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError_default(import_http_status_codes.default.NOT_FOUND, "User doesn't exist");
  }
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new AppError_default(import_http_status_codes.default.NOT_FOUND, "User doesn't exist");
  }
  return null;
};
var UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  getUsersGroupedByInterests,
  updateUser,
  deleteUser
};

// src/app/modules/user/user.controller.ts
var import_http_status_codes2 = __toESM(require("http-status-codes"), 1);

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data
  });
};

// src/app/modules/user/user.controller.ts
var createUser2 = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: import_http_status_codes2.default.CREATED,
    success: true,
    message: "User created successfully",
    data: result
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserService.getAllUsers(query);
  sendResponse(res, {
    statusCode: import_http_status_codes2.default.OK,
    success: true,
    message: "All users retrieved successfully",
    meta: result.meta,
    data: result.result
  });
});
var getSingleUser2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.getSingleUser(userId);
  sendResponse(res, {
    statusCode: import_http_status_codes2.default.OK,
    success: true,
    message: "User retrieved successfully",
    data: result
  });
});
var getGroupedByInterests = catchAsync(async (req, res) => {
  const result = await UserService.getUsersGroupedByInterests();
  sendResponse(res, {
    statusCode: import_http_status_codes2.default.OK,
    success: true,
    message: "Users grouped by interests retrieved successfully",
    data: result
  });
});
var updateUser2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.updateUser(userId, req.body);
  sendResponse(res, {
    statusCode: import_http_status_codes2.default.OK,
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var deleteUser2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.deleteUser(userId);
  sendResponse(res, {
    statusCode: import_http_status_codes2.default.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var UserController = {
  createUser: createUser2,
  getAllUsers: getAllUsers2,
  getSingleUser: getSingleUser2,
  getGroupedByInterests,
  updateUser: updateUser2,
  deleteUser: deleteUser2
};

// src/app/modules/user/user.validation.ts
var import_zod = __toESM(require("zod"), 1);
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var createUserZodSchema = import_zod.default.object({
  name: import_zod.default.string().min(2, { message: "Name must be at least 2 characters long." }).max(50, { message: "Name cannot exceed 50 characters." }).trim(),
  email: import_zod.default.email({ pattern: emailRegex, message: "Please provide a valid email address." }).trim().toLowerCase(),
  password: import_zod.default.string().min(8, { message: "Password must be at least 8 characters long." }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." }).regex(/\d/, { message: "Password must contain at least one number." }).regex(/[@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`]/, {
    message: "Password must contain at least one special character."
  }),
  role: import_zod.default.enum(["USER" /* USER */, "ADMIN" /* ADMIN */]).optional().default("USER" /* USER */),
  interests: import_zod.default.array(import_zod.default.string().trim().min(1, "Interest cannot be empty.")).optional().default([])
});
var updateUserZodSchema = import_zod.default.object({
  name: import_zod.default.string().min(2, { message: "Name must be at least 2 characters long." }).max(50, { message: "Name cannot exceed 50 characters." }).trim().optional(),
  email: import_zod.default.email({ pattern: emailRegex, message: "Please provide a valid email address." }).trim().toLowerCase().optional(),
  password: import_zod.default.string().min(8, { message: "Password must be at least 8 characters long." }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." }).regex(/\d/, { message: "Password must contain at least one number." }).regex(/[@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`]/, {
    message: "Password must contain at least one special character."
  }).optional(),
  role: import_zod.default.enum(["USER" /* USER */, "ADMIN" /* ADMIN */]).optional(),
  interests: import_zod.default.array(import_zod.default.string().trim().min(1, "Interest cannot be empty.")).optional()
}).refine((data) => Object.values(data).some((value) => value !== void 0), {
  message: "At least one field must be provided for update."
});

// src/app/utils/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var generateToken = (payload, secret, expiresIn) => {
  const token = import_jsonwebtoken.default.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  const verifiedToken = import_jsonwebtoken.default.verify(token, secret);
  return verifiedToken;
};

// src/app/middlewares/checkAuth.ts
var import_http_status_codes3 = __toESM(require("http-status-codes"), 1);
var checkAuth = (...authRole) => async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new AppError_default(import_http_status_codes3.default.UNAUTHORIZED, "No token received");
  }
  const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_TOKEN_SECRET);
  const isUserExist = await User.findById(verifiedToken.userId);
  if (!isUserExist) {
    throw new AppError_default(import_http_status_codes3.default.NOT_FOUND, "User does not exist");
  }
  if (!authRole.includes(verifiedToken.role)) {
    throw new AppError_default(
      import_http_status_codes3.default.UNAUTHORIZED,
      "You are not permitted to access this route"
    );
  }
  req.user = verifiedToken;
  next();
};

// src/app/modules/user/user.route.ts
var router = (0, import_express.Router)();
router.post(
  "/create-user",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get(
  "/grouped-by-interests",
  checkAuth("ADMIN" /* ADMIN */),
  UserController.getGroupedByInterests
);
router.get(
  "/all-users",
  checkAuth("ADMIN" /* ADMIN */),
  UserController.getAllUsers
);
router.get("/:id", checkAuth("ADMIN" /* ADMIN */), UserController.getSingleUser);
router.patch(
  "/:id",
  checkAuth("ADMIN" /* ADMIN */),
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);
router.delete("/:id", checkAuth("ADMIN" /* ADMIN */), UserController.deleteUser);
var UserRoutes = router;

// src/app/modules/auth/auth.route.ts
var import_express2 = require("express");

// src/app/modules/auth/auth.controller.ts
var import_http_status_codes5 = __toESM(require("http-status-codes"), 1);

// src/app/modules/auth/auth.service.ts
var import_http_status_codes4 = __toESM(require("http-status-codes"), 1);

// src/app/utils/userToken.ts
var createTokens = (user) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRES_IN);
  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_TOKEN_SECRET, envVars.JWT_REFRESH_TOKEN_EXPIRES_IN);
  return {
    accessToken,
    refreshToken
  };
};

// src/app/modules/auth/auth.service.ts
var registerUser = async (payload) => {
  const { name, email, password: plainPassword, interests } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError_default(import_http_status_codes4.default.CONFLICT, "User with this email already exists");
  }
  const hashedPassword = await hashPassword(plainPassword);
  const result = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "USER" /* USER */,
    interests
  });
  const { password, ...user } = result.toObject();
  return user;
};
var login = async (payload) => {
  const { email, password: plainPassword } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError_default(import_http_status_codes4.default.NOT_FOUND, "User doesn't exist");
  }
  const isVerifiedPassword = await verifyPassword(plainPassword, isUserExist.password);
  if (!isVerifiedPassword) {
    throw new AppError_default(import_http_status_codes4.default.BAD_REQUEST, "Incorrect password");
  }
  const tokens = createTokens(isUserExist);
  const { password, ...rest } = isUserExist.toObject();
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: rest
  };
};
var getAccessToken = async (refreshToken) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN_SECRET);
  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });
  if (!isUserExist) {
    throw new AppError_default(import_http_status_codes4.default.NOT_FOUND, "User does not exist");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_TOKEN_SECRET,
    envVars.JWT_ACCESS_TOKEN_EXPIRES_IN
  );
  return {
    accessToken
  };
};
var getMe = async (userId) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError_default(import_http_status_codes4.default.NOT_FOUND, "User doesn't exist");
  }
  const { password, ...userProfile } = isUserExist.toObject();
  return userProfile;
};
var AuthService = {
  registerUser,
  login,
  getAccessToken,
  getMe
};

// src/app/utils/setCookie.ts
var setAuthCookie = (res, tokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production" ? true : false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 90
    });
  }
};

// src/app/modules/auth/auth.controller.ts
var registerUser2 = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);
  sendResponse(res, {
    statusCode: import_http_status_codes5.default.CREATED,
    success: true,
    message: "User registered successfully",
    data: result
  });
});
var login2 = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  setAuthCookie(res, result);
  sendResponse(res, {
    statusCode: import_http_status_codes5.default.OK,
    success: true,
    message: "User logged in successfully",
    data: result
  });
});
var getAccessToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError_default(import_http_status_codes5.default.BAD_REQUEST, "No refresh token received from cookies");
  }
  const tokenInfo = await AuthService.getAccessToken(refreshToken);
  setAuthCookie(res, tokenInfo);
  sendResponse(res, {
    statusCode: import_http_status_codes5.default.OK,
    success: true,
    message: "New Access token generated successfully",
    data: tokenInfo
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const decodedToken = req.user;
  const result = await AuthService.getMe(decodedToken.userId);
  sendResponse(res, {
    statusCode: import_http_status_codes5.default.OK,
    success: true,
    message: "User profile info retrieved successfully",
    data: result
  });
});
var logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    statusCode: import_http_status_codes5.default.OK,
    success: true,
    message: "User logged out successfully",
    data: null
  });
});
var AuthController = {
  registerUser: registerUser2,
  login: login2,
  getAccessToken: getAccessToken2,
  getMe: getMe2,
  logout
};

// src/app/modules/auth/auth.route.ts
var router2 = (0, import_express2.Router)();
router2.post("/register", validateRequest(createUserZodSchema), AuthController.registerUser);
router2.post("/login", AuthController.login);
router2.post("/refresh-token", AuthController.getAccessToken);
router2.post("/logout", AuthController.logout);
router2.get("/me", checkAuth(...Object.values(ROLE)), AuthController.getMe);
var AuthRoutes = router2;

// src/app/modules/note/note.route.ts
var import_express3 = require("express");

// src/app/modules/note/note.model.ts
var import_mongoose2 = require("mongoose");
var noteSchema = new import_mongoose2.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true
    },
    user: {
      type: import_mongoose2.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
noteSchema.index({ user: 1, createdAt: -1 });
var Note = (0, import_mongoose2.model)("Note", noteSchema);

// src/app/modules/note/note.service.ts
var import_http_status_codes6 = __toESM(require("http-status-codes"), 1);
var createNote = async (userId, payload) => {
  const { title, content } = payload;
  const result = await Note.create({
    title,
    content,
    user: userId
  });
  const note = result.toObject();
  return note;
};
var getMyNotes = async (userId, query) => {
  const queryBuilder = new QueryBuilder(
    Note.find({ user: userId }),
    query
  );
  const notes = queryBuilder.paginate().sort();
  const [result, meta] = await Promise.all([notes.build(), notes.getMeta()]);
  return { result, meta };
};
var getAllNotes = async (query) => {
  const queryBuilder = new QueryBuilder(Note.find().populate("user", "name email"), query);
  const notes = queryBuilder.paginate().sort();
  const [result, meta] = await Promise.all([notes.build(), notes.getMeta()]);
  return { result, meta };
};
var getSingleNote = async (noteId, userId, role) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new AppError_default(import_http_status_codes6.default.NOT_FOUND, "Note doesn't exist");
  }
  if (role !== "ADMIN" /* ADMIN */ && note.user.toString() !== userId) {
    throw new AppError_default(import_http_status_codes6.default.FORBIDDEN, "You are not permitted to view this note");
  }
  return note.toObject();
};
var updateNote = async (noteId, userId, payload) => {
  const { title, content } = payload;
  const note = await Note.findById(noteId);
  if (!note) {
    throw new AppError_default(import_http_status_codes6.default.NOT_FOUND, "Note doesn't exist");
  }
  if (note.user.toString() !== userId) {
    throw new AppError_default(import_http_status_codes6.default.FORBIDDEN, "You are not permitted to update this note");
  }
  const updatedData = { title, content };
  const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, {
    new: true,
    runValidators: true
  });
  if (!updatedNote) {
    throw new AppError_default(import_http_status_codes6.default.NOT_FOUND, "Note doesn't exist");
  }
  return updatedNote.toObject();
};
var deleteNote = async (noteId, userId) => {
  const note = await Note.findById(noteId);
  if (!note) {
    throw new AppError_default(import_http_status_codes6.default.NOT_FOUND, "Note doesn't exist");
  }
  if (note.user.toString() !== userId) {
    throw new AppError_default(import_http_status_codes6.default.FORBIDDEN, "You are not permitted to delete this note");
  }
  const deletedNote = await Note.findByIdAndDelete(noteId);
  if (!deletedNote) {
    throw new AppError_default(import_http_status_codes6.default.NOT_FOUND, "Note doesn't exist");
  }
  return null;
};
var NoteService = {
  createNote,
  getMyNotes,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote
};

// src/app/modules/note/note.controller.ts
var import_http_status_codes7 = __toESM(require("http-status-codes"), 1);
var createNote2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await NoteService.createNote(userId, req.body);
  sendResponse(res, {
    statusCode: import_http_status_codes7.default.CREATED,
    success: true,
    message: "Note created successfully",
    data: result
  });
});
var getMyNotes2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const query = req.query;
  const result = await NoteService.getMyNotes(userId, query);
  sendResponse(res, {
    statusCode: import_http_status_codes7.default.OK,
    success: true,
    message: "My notes retrieved successfully",
    meta: result.meta,
    data: result.result
  });
});
var getAllNotes2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await NoteService.getAllNotes(query);
  sendResponse(res, {
    statusCode: import_http_status_codes7.default.OK,
    success: true,
    message: "All notes retrieved successfully",
    meta: result.meta,
    data: result.result
  });
});
var getSingleNote2 = catchAsync(async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  const role = req.user.role;
  const result = await NoteService.getSingleNote(noteId, userId, role);
  sendResponse(res, {
    statusCode: import_http_status_codes7.default.OK,
    success: true,
    message: "Note retrieved successfully",
    data: result
  });
});
var updateNote2 = catchAsync(async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  const result = await NoteService.updateNote(noteId, userId, req.body);
  sendResponse(res, {
    statusCode: import_http_status_codes7.default.OK,
    success: true,
    message: "Note updated successfully",
    data: result
  });
});
var deleteNote2 = catchAsync(async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.userId;
  const result = await NoteService.deleteNote(noteId, userId);
  sendResponse(res, {
    statusCode: import_http_status_codes7.default.OK,
    success: true,
    message: "Note deleted successfully",
    data: result
  });
});
var NoteController = {
  createNote: createNote2,
  getMyNotes: getMyNotes2,
  getAllNotes: getAllNotes2,
  getSingleNote: getSingleNote2,
  updateNote: updateNote2,
  deleteNote: deleteNote2
};

// src/app/modules/note/note.validation.ts
var import_zod2 = __toESM(require("zod"), 1);
var createNoteZodSchema = import_zod2.default.object({
  title: import_zod2.default.string().min(1, { message: "Title is required." }).max(200, { message: "Title cannot exceed 200 characters." }).trim(),
  content: import_zod2.default.string().min(1, { message: "Content is required." }).trim()
});
var updateNoteZodSchema = import_zod2.default.object({
  title: import_zod2.default.string().min(1, { message: "Title is required." }).max(200, { message: "Title cannot exceed 200 characters." }).trim().optional(),
  content: import_zod2.default.string().min(1, { message: "Content is required." }).trim().optional()
}).refine((data) => Object.values(data).some((value) => value !== void 0), {
  message: "At least one field must be provided for update."
});

// src/app/modules/note/note.route.ts
var router3 = (0, import_express3.Router)();
router3.post(
  "/create-note",
  checkAuth(...Object.values(ROLE)),
  validateRequest(createNoteZodSchema),
  NoteController.createNote
);
router3.get("/my-notes", checkAuth(...Object.values(ROLE)), NoteController.getMyNotes);
router3.get("/all-notes", checkAuth("ADMIN" /* ADMIN */), NoteController.getAllNotes);
router3.get("/:id", checkAuth(...Object.values(ROLE)), NoteController.getSingleNote);
router3.patch(
  "/:id",
  checkAuth(...Object.values(ROLE)),
  validateRequest(updateNoteZodSchema),
  NoteController.updateNote
);
router3.delete("/:id", checkAuth(...Object.values(ROLE)), NoteController.deleteNote);
var NoteRoutes = router3;

// src/app/modules/post/post.route.ts
var import_express4 = require("express");

// src/app/modules/post/post.model.ts
var import_mongoose3 = require("mongoose");
var postSchema = new import_mongoose3.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true
    },
    user: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
postSchema.index({ user: 1, createdAt: -1 });
var Post = (0, import_mongoose3.model)("Post", postSchema);

// src/app/modules/post/post.service.ts
var import_http_status_codes8 = __toESM(require("http-status-codes"), 1);
var import_mongoose4 = require("mongoose");
var createPost = async (userId, payload) => {
  const { title, content } = payload;
  const result = await Post.create({
    title,
    content,
    user: userId
  });
  const post = result.toObject();
  return post;
};
var getPostsByUser = async (userId, query) => {
  if (!import_mongoose4.Types.ObjectId.isValid(userId)) {
    throw new AppError_default(import_http_status_codes8.default.BAD_REQUEST, "Invalid user id");
  }
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const aggregation = await Post.aggregate([
    {
      $match: {
        user: new import_mongoose4.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email"
        }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $facet: {
        result: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "total" }]
      }
    }
  ]);
  const result = aggregation[0]?.result ?? [];
  const total = aggregation[0]?.totalCount[0]?.total ?? 0;
  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var PostService = {
  createPost,
  getPostsByUser
};

// src/app/modules/post/post.controller.ts
var import_http_status_codes9 = __toESM(require("http-status-codes"), 1);
var createPost2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await PostService.createPost(userId, req.body);
  sendResponse(res, {
    statusCode: import_http_status_codes9.default.CREATED,
    success: true,
    message: "Post created successfully",
    data: result
  });
});
var getPostsByUser2 = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const query = req.query;
  const result = await PostService.getPostsByUser(userId, query);
  sendResponse(res, {
    statusCode: import_http_status_codes9.default.OK,
    success: true,
    message: "User posts retrieved successfully",
    meta: result.meta,
    data: result.result
  });
});
var PostController = {
  createPost: createPost2,
  getPostsByUser: getPostsByUser2
};

// src/app/modules/post/post.validation.ts
var import_zod3 = __toESM(require("zod"), 1);
var createPostZodSchema = import_zod3.default.object({
  title: import_zod3.default.string().min(1, { message: "Title is required." }).max(200, { message: "Title cannot exceed 200 characters." }).trim(),
  content: import_zod3.default.string().min(1, { message: "Content is required." }).trim()
});

// src/app/modules/post/post.route.ts
var router4 = (0, import_express4.Router)();
router4.post(
  "/create-post",
  checkAuth(...Object.values(ROLE)),
  validateRequest(createPostZodSchema),
  PostController.createPost
);
router4.get("/user/:userId", checkAuth(...Object.values(ROLE)), PostController.getPostsByUser);
var PostRoutes = router4;

// src/app/routes/index.ts
var router5 = (0, import_express5.Router)();
var moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/note",
    route: NoteRoutes
  },
  {
    path: "/post",
    route: PostRoutes
  }
];
moduleRoutes.forEach((route) => {
  router5.use(route.path, route.route);
});
var routes_default = router5;

// src/app/middlewares/notFound.ts
var import_http_status_codes10 = __toESM(require("http-status-codes"), 1);
var notFound = (req, res) => {
  res.status(import_http_status_codes10.default.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!"
    }
  });
};
var notFound_default = notFound;

// src/app/middlewares/globalErrorHandler.ts
var import_http_status_codes11 = __toESM(require("http-status-codes"), 1);
var import_zod4 = require("zod");
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = import_http_status_codes11.default.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorSources = [];
  const stack = err instanceof Error ? err.stack : void 0;
  if (err instanceof import_zod4.ZodError) {
    statusCode = import_http_status_codes11.default.BAD_REQUEST;
    message = "Validation failed";
    errorSources = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }));
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }
  if (envVars.NODE_ENV === "development") console.error("\u274C Global Error:", err);
  res.status(statusCode).json({
    success: false,
    message,
    errorSources: errorSources.length ? errorSources : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  });
};

// src/app/utils/connectDB.ts
var import_mongoose5 = __toESM(require("mongoose"), 1);
var connectionPromise = null;
var connectDB = () => {
  if (!connectionPromise) {
    connectionPromise = import_mongoose5.default.connect(envVars.DB_URL);
  }
  return connectionPromise;
};

// src/app.ts
var import_cors = __toESM(require("cors"), 1);
var app = (0, import_express6.default)();
app.use(import_express6.default.json());
app.use((0, import_cookie_parser.default)());
app.set("trust proxy", 1);
app.use(
  (0, import_cors.default)({
    origin: envVars.FRONTEND_URL,
    credentials: true
  })
);
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});
app.use("/api/v1", routes_default);
app.get("/", (req, res) => {
  res.status(import_http_status_codes12.default.OK).json({
    message: "Welcome to Secure Note Taking App Server",
    environment: "development",
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use(globalErrorHandler);
app.use(notFound_default);
var app_default = app;

// src/app/utils/seedSuperAdmin.ts
var seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });
    if (isSuperAdminExist) {
      console.log("Super admin already exists");
      return;
    }
    await User.create({
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: await hashPassword(envVars.SUPER_ADMIN_PASSWORD),
      role: "ADMIN" /* ADMIN */,
      interests: []
    });
    console.log("Super admin created successfully");
  } catch (error) {
    console.error("Error while seeding super admin:", error);
  }
};

// src/serverless.ts
(async () => {
  try {
    await connectDB();
    await seedSuperAdmin();
  } catch (error) {
    console.error("Serverless init failed:", error);
  }
})();
function handler(req, res) {
  app_default(req, res);
}
