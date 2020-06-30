import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
// import { GoogleLogin } from "react-google-login";
// import FacebookLogin from "react-facebook-login";
// import Pusher from "pusher-js";
import { messaging } from "./firebase";
import print from "fingerprintjs2";
import axios from "axios";
import { format, isFuture } from "date-fns";
import { start } from "repl";
import eachMinuteOfInterval from "./eachMinuteOfInterval";
import curry from "lodash/fp/curryRight";
import throttle from "lodash/throttle";
import { count } from "console";
// import * as _ from 'lodash';

const curriedFormat = curry(format)({});

// const timeIntervals = (start: Date, end: Date, interval: number) =>
//   eachMinuteOfInterval({ start, end }, { step: interval }).map(
//     flow(curriedFormat("h:mm a"), filter(isFuture))
//   );

const timeIntervals = (
  start: Date,
  end: Date,
  interval: number,
  format = "h:mm a"
) =>
  eachMinuteOfInterval({ start, end }, { step: interval })
    .filter(isFuture)
    .map((date) => curriedFormat(format)(date));

let now = new Date();

const morning = timeIntervals(
  new Date(now.setHours(0, 0)),
  new Date(now.setHours(11, 59)),
  15
);

console.log("Morning", morning);

const afternoon = timeIntervals(
  new Date(now.setHours(12, 0)),
  new Date(now.setHours(17, 45)),
  15
);

console.log("Afternoon", afternoon);

const evening = timeIntervals(
  new Date(now.setHours(18, 0)),
  new Date(now.setHours(23, 59)),
  15
);

console.log("Evening", evening);

function App() {
  const currentUserId = "e72dd6cb-533a-4251-beec-b974eff7ec3d";

  const getFingerprint = (components: Array<any>): string => {
    const values = components.map(function (component) {
      return component.value;
    });
    // console.log("Components", components);
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

  // const startDate = new Date();
  // const endDate = Date.now();

  const [count, setCount] = useState(0);

  let now = new Date();
  let startDate = new Date(now.setHours(12, 0));
  let endDate = new Date(now.setHours(17, 45));
  const intervals = eachMinuteOfInterval(
    { start: startDate, end: endDate },
    { step: 15 }
  )
    .filter(isFuture)
    .map((date) => format(date, "h:mm a"));

  // console.log("Intervals", intervals);
  // console.log(new Date(endDate));

  const [token, setToken] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const requestIdleCallback = (window as any).requestIdleCallback;

  useEffect(() => {
    throttle(
      () => {
        console.log(count + 1);
      },
      500,
      { trailing: true }
    );

    messaging
      .requestPermission()
      .then((p) => {
        // console.log("Have permission");
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
          // console.log("Finger Print Hash", _fingerprint);
        });
      });
    } else {
      setTimeout(() => {
        print.get((components) => {
          const _fingerprint = getFingerprint(components);
          setFingerprint(_fingerprint);
          // console.log("Finger Print Hash", _fingerprint);
        });
      }, 500);
    }

    // const oldToken = localStorage.getItem("_vid_");
    // const oldFingerprint = localStorage.getItem("_vid");
    // token &&
    //   fingerprint &&
    //   (!oldFingerprint || !oldToken) &&
    //   sendTokenToServer(fingerprint, token);
  }, [token, fingerprint, count]);

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
          {count}

          <button
            onClick={() => {
              throttle(
                () => {
                  setCount((prev) => prev + 1);
                },
                500,
                { trailing: true }
              );
            }}
          >
            Click me {count}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
