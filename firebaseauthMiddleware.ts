import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface ITask extends Document {
  userId: string;
}

if (!admin.apps.length) {
  admin.initializeApp({
    // if using service account json:
    // credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const idToken = authHeader.substring(7);
    const decoded = await admin.auth().verifyIdToken(idToken); // Firebase verification [web:432][web:530]

    req.userId = decoded.uid; // use Firebase uid as userId
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
