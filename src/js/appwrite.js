import { Client, Account, Databases, Functions } from "https://cdn.jsdelivr.net/npm/appwrite@16/dist/esm/sdk.js";

export const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69b85fbc00206b1f13cd");

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export const DB_ID = "69b865a9003258b2cc5e";
export const COL_COMMENTS = "comments";
export const COL_VISITORS = "visitors";
export const COL_PROFILES = "profiles";
export const FN_INCREMENT = "increment_visitor";
