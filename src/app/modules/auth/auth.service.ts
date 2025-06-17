import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "../../../../generated/prisma";
import config from "../../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { ApiError } from "../../errors/ApiError";
import emailSender from "./emailSender";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }
  const accessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.jwt_secret as string,
    { expiresIn: config.jwt.expires_in } as SignOptions
  );
  const refreshToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.refresh_token_secret as string,
    { expiresIn: config.jwt.refresh_token_expires_in } as SignOptions
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  const decodedData = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_token_secret as string
  );
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.jwt_secret as string,
    { expiresIn: config.jwt.expires_in } as SignOptions
  );
  return { accessToken };
};

const changePassword = async (user: JwtPayload, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const isPasswordMatch = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }
  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_password_secret as string,
    { expiresIn: config.jwt.reset_password_expires_in } as SignOptions
  );
  const resetPasswordUrl = `${config.client_url}/reset-password?token=${resetToken}&email=${userData.email}`;
  await emailSender(userData.email, `
    <div>
        <p>Dear user</p>
        <p>Your password reset Link</p>
        <a href="${resetPasswordUrl}"><button>Reset Password</button></a>
    </div>
    `);

};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
};
