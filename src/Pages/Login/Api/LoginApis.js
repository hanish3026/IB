import axios from 'axios';

const baseUrl = "http://192.168.5.13:9090/HD-CONNECT_LOCAL/";
const SaltApi = `${baseUrl}/salt`;
const LoginApi = `${baseUrl}/HDPAY/login/validate`;
const Token = `${baseUrl}/token`;

class LoginApiService {
    getSalt() {
        return axios.get(SaltApi)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching salt:", error);
                throw error;
            });
    }
    
    validateLogin(formData) {
        return axios.post(LoginApi,formData)
        .then(response => response.data)
        .catch(error => {
            console.error("Login error:", error);
            throw error;
        });
    }

    getToken() {
        return axios.get(Token, {
            headers: {
            'ChannelID': 'IB',
          }
    })
        .then(response => response.data)
        .catch(error => {
            console.error("Login error:", error);
            throw error;
        });
    }
}

// Create an instance of the class
const LoginApis = new LoginApiService();
export default LoginApis;