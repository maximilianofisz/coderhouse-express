module.exports = class orderDTO {
    constructor(items, orderNumber, date, email ){
        this.items = items
        this.orderNumber = orderNumber
        this.date = date
        this.email = email
    }
}