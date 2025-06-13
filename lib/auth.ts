import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getSession = async () => {
  return await getServerSession(authOptions);
};


declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add user id to session type
      role: string; // Add user role to session type
    } & DefaultSession["user"];
  }

  interface User {
    id: string; 
    role: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; 
    role: string; 
  }
}