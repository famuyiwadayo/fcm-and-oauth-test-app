import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import Pusher from "pusher-js";
import { messaging } from "./firebase";
import print from "fingerprintjs2";
import axios from "axios";

function App() {
  const currentUserId = "e72dd6cb-533a-4251-beec-b974eff7ec3d";

  const getFingerprint = (components: Array<any>): string => {
    const values = components.map(function (component) {
      return component.value;
    });
    console.log("Components", components);
    return print.x64hash128(values.join(""), 31);
  };

  const sendTokenToServer = async (fingerprint: string, token: string) => {
    const result = await axios
      .post("http://localhost:4000/devices", {
        userId: currentUserId,
        data: {
          fingerprint,
          fcmToken: token,
        },
      })
      .catch(console.error);

    result && localStorage.setItem("_vid", fingerprint);
    result && localStorage.setItem("_vid_", token);
  };

  const [token, setToken] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const requestIdleCallback = (window as any).requestIdleCallback;

  useEffect(() => {
    messaging
      .requestPermission()
      .then((p) => {
        console.log("Have permission");
        return messaging.getToken();
        // p === "granted" && console.log(messaging.getToken());
      })
      .then((tok) => setToken(tok))
      .catch(() => {
        console.log("Unable to get a token");
      });
    // Notification.requestPermission().

    messaging.onMessage((payload) => {
      console.log(payload);
    });
    console.log(token);

    if (requestIdleCallback) {
      requestIdleCallback(() => {
        print.get((components) => {
          const _fingerprint = getFingerprint(components);
          setFingerprint(_fingerprint);
          console.log("Finger Print Hash", _fingerprint);
        });
      });
    } else {
      setTimeout(() => {
        print.get((components) => {
          const _fingerprint = getFingerprint(components);
          setFingerprint(_fingerprint);
          console.log("Finger Print Hash", _fingerprint);
        });
      }, 500);
    }

    // const oldToken = localStorage.getItem("_vid_");
    // const oldFingerprint = localStorage.getItem("_vid");
    // token &&
    //   fingerprint &&
    //   (!oldFingerprint || !oldToken) &&
    //   sendTokenToServer(fingerprint, token);
  }, [token, fingerprint]);

  const responseGoogle = (res: any) => {
    console.clear();
    console.log(res);
  };

  // const responseFacebook = (res: any) => {
  //   console.clear();
  //   console.log(res);
  // };
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div>
          {/* <GoogleLogin
            // clientId="339802132424-a46ijrsobemlfgev125bkt11ciqqk5kr.apps.googleusercontent.com"
            clientId="756985957982-m64bd716h138ae0rdaesfespin9bbu24.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            // accessType="offline"
            // responseType="code"
          /> */}

          {/* <FacebookLogin
            appId="296546441369799"
            autoLoad={true}
            fields="name,email,picture"
            // scope="public_profile,user_friends,user_actions.books"
            callback={responseFacebook}
          /> */}
          <div style={{ maxWidth: 400 }}>{fingerprint}</div>
          <div style={{ maxWidth: 400 }}>{token}</div>
        </div>
      </header>
    </div>
  );
}

export default App;
