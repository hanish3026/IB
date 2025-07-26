import axios from 'axios';

const baseUrl = "http://localhost:8081/Portal";
const getTranfermenu = `${baseUrl}/transfer/menu`;
const updateTranfermenu = `${baseUrl}/update/transfer/menu`;
const Token = `${baseUrl}/token`;

class PaymentApiService {
    getTranfermenu(token) {
        console.log("sessionStorage.getItem('token')",token);
        return axios.post(getTranfermenu, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Version': '1.0',
                'ChannelID': 'IB',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching TranferMenu:", error);
                throw error;
            });
    }
    updateMenus(token,formdata) {
        console.log("sessionStorage.getItem('token')",token);
        return axios.put(updateTranfermenu,{...formdata,"status":"1"}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Version': '1.0',
                'ChannelID': 'IB',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching TranferMenu:", error);
                throw error;
            });
    }
    // validateLogin(formData) {
    //     return axios.post(LoginApi,formData)
    //     .then(response => response.data)
    //     .catch(error => {
    //         console.error("Login error:", error);
    //         throw error;
    //     });
    // }

    // getToken() {
    //     return axios.get(Token, {
    //         headers: {
    //         'ChannelID': 'IB',
    //       }
    // })
    //     .then(response => response.data)
    //     .catch(error => {
    //         console.error("Login error:", error);
    //         throw error;
    //     });
    // }
}

// Create an instance of the class
const PaymentMenuApis = new PaymentApiService();
export default PaymentMenuApis;