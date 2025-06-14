import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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
    "efwefwfef",
    { expiresIn: "5m" }
  );
  const refreshToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    "efwefwfejnkf",
    { expiresIn: "10d" }
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  const decodedData = jwtHelpers.verifyToken(token, "efwefwfejnkf");
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    "efwefwfef",
    { expiresIn: "5m" }
  );
  return { accessToken };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
