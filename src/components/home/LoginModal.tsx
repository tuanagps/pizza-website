import React from "react";
import { useHistory } from "react-router-dom";
import { User } from "../../interfaces/ShareInterfaces";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import axios from "axios";

interface Props {
  open: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  user: User[];
}

interface InputValues {
  email: string;
  password: string;
}

const LoginModal: React.FC<Props> = ({
  open,
  openLoginModal,
  closeLoginModal,
  user,
}) => {
  const { register, handleSubmit, reset } = useForm<InputValues>();
  const history = useHistory();

  const redirect = () => {
    history.push("/user/register");
    closeLoginModal();
  };

  const forgotPassword = () => {
    history.push("/reset_password");

    closeLoginModal();
  };

  const onSubmit = (values: InputValues) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/login`, values)
      .then((res) => {
        localStorage.setItem("client_token", JSON.stringify(res.data.token));
        localStorage.setItem("id", JSON.stringify(res.data.id));
        closeLoginModal();
        history.push("/pizzas");
        reset();
        if (res.data.user === "omar12@gmail.com") {
          history.push("/admin/dashboard");
        } else {
          window.location.reload(true);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const signOut = () => {
    closeLoginModal();
    localStorage.clear();
    history.push("/");
    window.location.reload(true);
  };

  return user.length ? (
    <div>
      <button className="login" onClick={openLoginModal}>
        my account{" "}
        <span className="inner-btn">{`${user[0].first_name} ${user[0].last_name}`}</span>
      </button>
      <Modal open={open} onClose={closeLoginModal}>
        <div className="logout-wrapper">
          <div className="Logout">
            <h3>my account</h3>
            <div className="user-information">
              <p>{`${user[0].first_name} ${user[0].last_name}`}</p>
              <p>{user[0].email}</p>
              <p>{user[0].phone_number}</p>
            </div>
            <div className="logout-btn">
              <button onClick={signOut}>sign out</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  ) : (
    <div>
      <button className="login" onClick={openLoginModal}>
        login <span className="inner-btn">/ Create Account</span>
      </button>
      <Modal open={open} onClose={closeLoginModal}>
        <div className="Forms-wrapper">
          <div className="LoginForm">
            <h3>login</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="login_email">
                email
                <input
                  type="email"
                  name="email"
                  id="login_email"
                  placeholder="lou@malnatis.com"
                  ref={register}
                />
              </label>

              <label htmlFor="login_password">
                password
                <input
                  type="password"
                  name="password"
                  id="login_password"
                  ref={register}
                />
              </label>

              <button>sign in</button>
              <span className="forgot-pass" onClick={forgotPassword}>
                Forgot your password?
              </span>
            </form>
          </div>
          <div className="SignUpForm">
            <h3>create an account</h3>
            <div className="befenifts">
              <span>- Earn points for every dollar spent!</span>
              <span>- Use points for free food!</span>
              <span>- Save addresses for easy ordering.</span>
              <span>- Repeat previous orders.</span>
              <span>- Save payments for fast checkout.</span>
              <span className="create-account" onClick={redirect}>
                create account
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginModal;
