import axios from "axios";

export const getApi = (url) => {
  try {
    if(!window.woocomanagePro){
      const response = axios.get(url, {
        headers: {
          "X-WP-Nonce": window.rest,
        },
      });
      return response;
    } 
  } catch (error) {
    return console.log("Error fetching products", error);
  }
};

export const putApi = (url, data) => {
  try {
    const response = axios.put(url, data, {
      headers: {
        "X-WP-Nonce": window.rest,
      },
    });
    return response;
  } catch (error) {
    return console.log("Error fetching products", error);
  }
};

export const postApi = (url, data) => {
  try {
    const response = axios.post(url, data, {
      headers: {
        "X-WP-Nonce": window.rest,
      },
    });
    return response;
  } catch (error) {
    return console.log("Error fetching products", error);
  }
};

export const deleteApi = (url) => {
  try {
    const response = axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": window.rest,
      },
      params: {
        force: true,
      },
    });
    return response;
  } catch (error) {
    return console.log("Error fetching products", error);
  }
};

export const getApiOut = (url) => {
    try {
        const response = axios.get(url);
        return response
    } catch (error) {
        return console.log("Error fetching products", error)
    }
}
