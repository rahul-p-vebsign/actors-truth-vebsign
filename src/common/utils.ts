import { Response } from "express";
import { CustomResponse, CustomeSuccessResponse } from "../interfaces/types";
// import { saltRounds } from "./constants";

export const buildResponse = (data: any, message: string, error: any = "") => {
  const response: CustomResponse = {
    data,
    message,
    error,
  };

  return response;
};

export const customeResponse = (data: any, message: string) => {
  const response: CustomeSuccessResponse = {
    data,
    message,
    success: true,
  };
  return response;
};

export const makeResponse = async (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  payload: any
) =>
  new Promise<number>((resolve) => {
    res.status(statusCode).send({
      success,
      message,
      data: payload,
      code: statusCode,
    });
    resolve(statusCode);
  });

export enum roleNames{
  ADMIN="ADMIN",
  MENTOR="MENTOR",
  LECTURER="LECTURER",
  USER="USER",
}

export enum Currency{
  INR="INR",
  GBP="GBP",
  USD="USD",
  EUR="EUR",
  AUD="AUD"
}

export enum isTrial{
  YES="Yes",
  NO="No"
}