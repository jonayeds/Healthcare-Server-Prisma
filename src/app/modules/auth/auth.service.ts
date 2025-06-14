import generateToken from "../../../helpers/jwtHelper";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";

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
  const accessToken = generateToken(
    { email: userData.email, role: userData.role },
    "efwefwfef",
    { expiresIn: "5m" }
  );
  const refreshToken = generateToken(
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

export const AuthService = {
  loginUser,
};
