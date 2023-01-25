module.exports = class userDTO {
    constructor(email, password, fullName, address, age, phoneNumber){
        this.email = email
        this.password = password
        this.fullName = fullName
        this.address = address
        this.age = age
        this.phoneNumber = phoneNumber
    }
}