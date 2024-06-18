export const ORDER_STATUS = {
    CREATED: "CREATED",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    DELIVERED: "DELIVERED",
}

export const PAYMENT_STATUS = {
    DECLINED : "DECLINED",
    CONFIRMED: "CONFIRMED"
}

export const PAYMENT_SERVICE_ENDPOINT = process.env.PAYMENT_SERVICE_ENDPOINT || ""

export const ORDER_DELIVERY_PERIOD = process.env.ORDER_DELIVERY_PERIOD && Number(process.env.ORDER_DELIVERY_PERIOD) || 5 // after period in seconds confirmed orders automatically be moved to delivered status