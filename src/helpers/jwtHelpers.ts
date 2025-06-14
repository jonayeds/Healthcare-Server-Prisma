import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: any,
  secret: string,
  { expiresIn }: SignOptions
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
    algorithm: "HS256",
  });
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decodedData = jwt.verify(token, secret) as JwtPayload;
    return decodedData;
  } catch (error) {
    throw new Error("you are not authorized");
  }
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
