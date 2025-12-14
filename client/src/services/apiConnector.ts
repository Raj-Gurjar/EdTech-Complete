import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (
  method: string,
  url: string,
  bodyData?: any,
  headers?: Record<string, string>,
  params?: Record<string, any>
): Promise<AxiosResponse> => {
  console.log("entering api connector", bodyData);
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
