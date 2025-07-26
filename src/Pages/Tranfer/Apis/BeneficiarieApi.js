import axios from 'axios';

const AllBeneficiarieApi = "http://localhost:8165/Portal/ib/get-all-beneficiary";
const AddBeneficiary = "http://localhost:8165/Portal/ib/add-beneficiary";
const DeleteBeneficiary = "http://localhost:8165/Portal/ib/delete-beneficiary";
const GetBeneficiaryById = "http://localhost:8165/Portal/ib/find-beneficiary";

class BeneficiarieApi {
    getAllBeneficiarieApi() {
        return axios.get(AllBeneficiarieApi)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching beneficiaries:", error);
                throw error;
            });
    }
    
    // Add method to add a new beneficiary
    addBeneficiary(beneficiaryData) {
        return axios.post(AddBeneficiary, beneficiaryData)
            .then(response => response.data)
            .catch(error => {
                console.error("Error adding beneficiary:", error);
                throw error;
            });
    }

    deleteBeneficiary(id) {
        return axios.delete(`${DeleteBeneficiary}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error deleting beneficiary:", error);
                throw error;
            });
    }
    getBeneficiaryById(id) {
        return axios.get(`${GetBeneficiaryById}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error("Error getting beneficiary:", error);
                throw error;
            });
    }
}

// Create an instance of the class
const BeneficiarieApis = new BeneficiarieApi();
export default BeneficiarieApis;