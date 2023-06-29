import axios from "axios";
const baseUrl = require("../../URL.json").url;

export async function customFetch(url, method, data) {
  try {
    if (method === "POST" && data instanceof FormData) {
      const response = await axios({
        method,
        url: `${baseUrl}/${url}`,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else if (method === "GET") {
      const resp = await axios.get(`${baseUrl}/${url}`, { params: data });
      return resp.data;
    } else {
      const resp = await axios({
        method,
        url: `${baseUrl}/${url}`,
        data,
      });
      return resp.data;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error occurred during the request");
    }
  }
}

// import axios from "axios";
// const baseUrl = require("../../URL.json").url;

// export async function customFetch(url, method, data) {
//   if (method === "POST" && data instanceof FormData) {
//     console.log("In POST in CustomFetch data: ", data);
//     const response = await axios({
//       method,
//       url: `${baseUrl}/${url}`,
//       data,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } else if (method === "GET") {
//     const resp = await axios.get(`${baseUrl}/${url}`, { params: data });
//     return resp.data;
//   } else {
//     console.log("In else in CustomFetch data: ", data);
//     const resp = await axios({
//       method,
//       url: `${baseUrl}/${url}`,
//       data,
//     });
//     return resp.data;
//   }
// }
