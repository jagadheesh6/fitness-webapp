import React, { Fragment, useEffect, useRef, useState } from "react";
import { Col } from "reactstrap";
import AsyncButton from "../../UI/AsyncButton/AsyncButton";
import MyCard from "../../UI/MyCard/MyCard";
import Spinner from "../../UI/Spinner/Spinner";
import { getImage } from "./getImage";
import { axiosInstance } from "../../Utility/axiosInstance";

import "./Profile.css";
import { changeLogo } from "../../Store/actions";
import { connect } from "react-redux";

const Profile = (props) => {
  const [avatar, setAvatar] = useState({ tag: 0, name: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [names, setNames] = useState([
    { tag: 0 },
    { tag: 1 },
    { tag: 2 },
    { tag: 3 },
    { tag: 4 },
    { tag: 5 },
  ]);

  const [validity, setValidity] = useState(true);
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const edit = useRef();

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .post("/userprofile")
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setAvatar({
          tag:
            res.data.avatar === null || res.data.avatar === undefined
              ? 0
              : parseInt(res.data.avatar),
          name: res.data.name,
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setAvatar({ tag: 0, name: "" });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const imageEdit = () => {
    setShow(true);
  };

  const imageChangeHandler = (event, id) => {
    console.log(id);
    console.log({
      name: avatar.name,
      avatar: avatar.tag,
    });
    event.preventDefault();
    setEditProfile(true);
    setAvatar(id);
    setShow(false);
    setSending(true);
    axiosInstance
      .post("/updateuserprofile", {
        name: avatar.name,
        avatar: id.tag,
      })
      .then((res) => {
        console.log(res.data);
        setSending(false);
        setEditProfile(false);
        props.changeLogo(id.tag);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
        setSending(false);
        setEditProfile(false);
        fetchData();
      });
    setTimeout(() => {
      setSending(false);
      setEditProfile(false);
    }, 5000);
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    let clone = avatar;
    let cloneArray = names;
    cloneArray = cloneArray.map((el) => {
      if (el.tag === clone.tag) {
        el.name = value;
      }
      return el;
    });
    clone.name = value;
    setAvatar({ ...clone });
    setNames([...cloneArray]);
  };

  return loading ? (
    <div>
      <Spinner />
    </div>
  ) : (
    <div className="flex-center flex-column">
      <form
        onSubmit={(event) => imageChangeHandler(event, avatar)}
        className="flex-center flex-column"
      >
        <div className="profile bg-white">
          <div
            style={{
              backgroundImage: "url('" + getImage(avatar.tag) + "')",
            }}
            className={`profile-page-logo ${sending ? "skeleton-loading" : ""}`}
          >
            <div onClick={sending ? () => {} : () => imageEdit()}>
              <p className="white">Edit</p>
            </div>
          </div>
        </div>
        <input
          required
          onChange={changeHandler}
          disabled={sending || !editProfile}
          name="name"
          value={avatar.name}
          className={`profile-name margin-auto bg-black-half-opacity edit-textbox white ${
            sending ? "skeleton-loading" : ""
          }`}
        />
        <div>
          <br />
          <div>
            {/* {editProfile ? ( */}
            <AsyncButton
              type="submit"
              disabled={sending}
              loading={submitLoading}
              className={`box-shadow-none sm bg-green ${
                !editProfile ? "hide" : ""
              }`}
            >
              Update
            </AsyncButton>
            {/* ) : ( */}
            <AsyncButton
              type="button"
              onClick={() => setEditProfile(true)}
              className={`box-shadow-none sm bg-green ${
                editProfile ? "hide" : ""
              }`}
            >
              Edit
            </AsyncButton>
            {/* )} */}
          </div>
        </div>
      </form>
      <br />
      {show ? (
        <Fragment>
          <h4 className="white">Choose Avatar</h4>
          <br />
          <MyCard
            className="bg-transparent box-shadow-none"
            style={{ maxWidth: "95%", margin: "auto" }}
          >
            <div className="flex-row flex-wrap">
              {names.map((el, index) => (
                <div key={index} className="flex-column">
                  <div
                    onClick={(event) => imageChangeHandler(event, el)}
                    className="profile bg-white"
                    style={{ margin: "10px 5px", cursor: "pointer" }}
                  >
                    <div
                      style={{
                        backgroundImage: "url('" + getImage(el.tag) + "')",
                      }}
                      className={`profile-page-logo`}
                    ></div>
                  </div>
                  <h4 className="white margin-auto"> {el.name} </h4>
                </div>
              ))}
            </div>
            <br />
            <button
              className="bg-red sm margin-auto"
              onClick={() => setShow(false)}
            >
              <p className="white remove-para-margin">Cancel</p>
            </button>
          </MyCard>
        </Fragment>
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLogo: (tag) => dispatch(changeLogo(tag)),
  };
};

export default connect(null, mapDispatchToProps)(Profile);
