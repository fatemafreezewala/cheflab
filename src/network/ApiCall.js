import Axios from 'axios';

const axiosInstance = Axios.create();

const loc_global = global;
axiosInstance.interceptors.request.use(
  config => {
    if (loc_global.userData && loc_global.userData.token) {
      config.headers.Authorization = loc_global.userData.token;
    }
    // console.log("request =>", config);
    return config;
  },
  error => {
    // console.log("request error =>", error.response || error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    // console.log("response =>", config);
    return config;
  },
  error => {
    // console.log("response error =>", error.response || error);
    return Promise.reject(error);
  },
);

const getFormData = object => {
  const formData = new FormData();
  Object.keys(object).forEach(key => formData.append(key, object[key]));
  return formData;
};
const ApiCall = async (
  method = 'post',
  body,
  url = '',
  headers = null,
  formData = false,
) => {
  const config = {
    method: method.toLowerCase(),
    timeout: 1000 * 60 * 2,
  };
  if (url) {
    config.url = url;
  }
  if (
    body &&
    (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete')
  ) {
    config.params = body;
  } else if (body && method.toLowerCase() === 'post' && !formData) {
    config.data = body;
  } else if (body && method.toLowerCase() === 'post' && formData) {
    config.data = getFormData(body);
  } else {
    config.data = body;
  }
  if (headers) {
    config.headers = headers;
  }

  return new Promise(resolve => {
    axiosInstance(config)
      .then(res => resolve({statusCode: res.status, data: res.data}))
      .catch(error => {
        if (error.response) {
          if (error.response.status === 502 || error.response.status === 404) {
          }
          if (error.response.data?.message) {
          }
          resolve({
            statusCode: error.response.status,
            data: error.response.data,
          });
          return;
        }
        if (error.code === 'ECONNABORTED') {
          resolve({statusCode: 400});
          return;
        }
        resolve({statusCode: 400});
      });
  });
};

export default ApiCall;
