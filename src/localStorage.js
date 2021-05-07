export const setUserInfo = ({
  _id = "",
  userName = "",
  email = "",
  password = "",
  admin = false,
  verify = false,
}) => {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({
      _id,
      userName,
      email,
      password,
      admin,
      verify,
    })
  );
};

export const getUserInfo = () => {
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : {
        _id: "",
        userName: "",
        email: "",
        password: "",
        admin: false,
        verify: false,
      };
};

export const clearUser = () => {
  localStorage.removeItem("userInfo");
};

export const setShipping = ({
  firstName = "",
  lastName = "",
  address = "",
  city = "",
  postalCode = "",
  country = "",
  pickup = false,
}) => {
  localStorage.setItem(
    "shipping",
    JSON.stringify({
      firstName,
      lastName,
      address,
      city,
      postalCode,
      country,
      pickup,
    })
  );
};

export const getShipping = () => {
  const shipping = localStorage.getItem("shipping")
    ? JSON.parse(localStorage.getItem("shipping"))
    : {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        pickup: false,
      };
  return shipping;
};

export const getCartItems = () => {
  const cartItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];
  return cartItems;
};

export const setCartItems = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

export const clearCartItems = () => {
  localStorage.removeItem("cartItems");
};

export const setOrder = ({
  orderItems = [],
  shipping = null,
  itemsPrice = "",
  shippingPrice = "",
  taxPrice = "",
  totalPrice = "",
}) => {
  localStorage.setItem(
    "order",
    JSON.stringify({
      orderItems,
      shipping,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    })
  );
};

export const getOrder = () => {
  const order = localStorage.getItem("order")
    ? JSON.parse(localStorage.getItem("order"))
    : {
        orderItems: [],
        shipping: null,
        itemsPrice: "",
        shippingPrice: "",
        taxPrice: "",
        totalPrice: "",
      };
  return order;
};

export const setPaidOrder = ({
  userId = "",
  userName = "",
  orderItems = [],
  shipping = null,
  itemsPrice = "",
  shippingPrice = "",
  taxPrice = "",
  totalPrice = "",
  isPaid = false,
  orderID = "",
  date = Date(),
  shippingout = false,
  delivered = false,
}) => {
  localStorage.setItem(
    "paidOrder",
    JSON.stringify({
      userId,
      userName,
      orderItems,
      shipping,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid,
      orderID,
      date,
      shippingout,
      delivered,
    })
  );
};

export const getPaidOrder = () => {
  const order = localStorage.getItem("paidOrder")
    ? JSON.parse(localStorage.getItem("paidOrder"))
    : {
        userId: "",
        userName: "",
        orderItems: [],
        shipping: null,
        itemsPrice: "",
        shippingPrice: "",
        taxPrice: "",
        totalPrice: "",
        isPaid: false,
        orderID: "",
        date: Date(),
        shippingout: false,
        delivered: false,
      };
  return order;
};
export const setCount = ({ count = 0 }) => {
  localStorage.setItem("count", JSON.stringify({ count }));
};
export const getCount = () => {
  const count = localStorage.getItem("count")
    ? JSON.parse(localStorage.getItem("count"))
    : { count: 0 };
  return count;
};
