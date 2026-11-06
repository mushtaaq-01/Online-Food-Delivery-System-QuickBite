import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    setCartItems,
    url,
  } = useContext(StoreContext);

  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );
      setLoading(false);

      if (response.data.success) {
        setCartItems({});
        setConfirmedOrder(
          response.data.order || {
            _id: "ORD" + Date.now().toString().slice(-6),
            address: data,
            items: orderItems,
            amount: orderData.amount,
          }
        );
        toast.success("Order Placed Successfully!");
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("An error occurred while placing the order.");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please Login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0 && !confirmedOrder) {
      navigate("/cart");
    }
  }, [token, confirmedOrder]);

  // If order is confirmed, display Order Confirmed Summary
  if (confirmedOrder) {
    return (
      <div className="order-confirmed-container">
        <div className="order-confirmed-card">
          <div className="order-confirmed-badge">
            <span className="checkmark">&#10003;</span>
          </div>
          <h2>Order Confirmed!</h2>
          <p className="order-confirmed-subtitle">
            Thank you for ordering with QuickBite! Your food is now being prepared.
          </p>

          <div className="order-id-box">
            <span>Order ID:</span>
            <b>#{confirmedOrder._id}</b>
          </div>

          <div className="order-summary-grid">
            <div className="summary-section">
              <h3>Delivery Address</h3>
              <p><b>{confirmedOrder.address?.firstName} {confirmedOrder.address?.lastName}</b></p>
              <p>{confirmedOrder.address?.street}</p>
              <p>{confirmedOrder.address?.city}, {confirmedOrder.address?.state} {confirmedOrder.address?.zipcode}</p>
              <p>{confirmedOrder.address?.country}</p>
              <p>Phone: {confirmedOrder.address?.phone}</p>
            </div>

            <div className="summary-section">
              <h3>Order Items</h3>
              <div className="summary-items-list">
                {confirmedOrder.items?.map((item, index) => (
                  <div key={index} className="summary-item-row">
                    <span>{item.name} &times; {item.quantity}</span>
                    <b>${item.price * item.quantity}</b>
                  </div>
                ))}
                <div className="summary-item-row fee-row">
                  <span>Delivery Charges</span>
                  <span>$2</span>
                </div>
              </div>
              <div className="summary-total-row">
                <b>Total Paid</b>
                <b>${confirmedOrder.amount}</b>
              </div>
            </div>
          </div>

          <div className="order-confirmed-actions">
            <button
              className="action-btn track-btn"
              onClick={() => navigate("/myorders")}
            >
              Track Order
            </button>
            <button
              className="action-btn home-btn"
              onClick={() => navigate("/")}
            >
              Order More Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="tel"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotals</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "PROCEED TO CHECKOUT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
