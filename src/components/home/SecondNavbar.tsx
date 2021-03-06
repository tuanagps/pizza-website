import React, { useState, useEffect, SetStateAction } from "react";
import { ItemInformation, User } from "../../interfaces/ShareInterfaces";
import { Link } from "react-router-dom";
import logo from "../../imgs/logo.png";
import CheckoutCartModal from "./CheckoutCartModal";
import LoginModal from "./LoginModal";
import DeliveryModal from "./DeliveryModal";
import axios from "axios";

interface Props {
  open: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  getItemsInCart: () => void;
  cartData: ItemInformation[];
}

const SecondNavbar: React.FC<Props> = ({
  open,
  openLoginModal,
  closeLoginModal,
  getItemsInCart,
  cartData,
}) => {
  const [id, setId] = useState<SetStateAction<string> | null>("");
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      setId(userId);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getUserData();
    }
  }, [id]);

  function getUserData() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/cart/user/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  return (
    <div className="SecondNavbar">
      <div className="Navbar-wrapper">
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
        <nav>
          <div className="btn-delivery btns">
            <DeliveryModal user={user} />
          </div>
          <div className="btn-login btns">
            <LoginModal
              open={open}
              openLoginModal={openLoginModal}
              closeLoginModal={closeLoginModal}
              user={user}
            />
          </div>
          <div className="btn-checkout btns">
            <CheckoutCartModal
              getItemsInCart={getItemsInCart}
              cartData={cartData}
              user={user}
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SecondNavbar;
