importScripts("https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBt1zUA7bz_rhmd4aITlS0zdEHCz9DR5wQ",
  authDomain: "aegle-healthcare.firebaseapp.com",
  databaseURL: "https://aegle-healthcare.firebaseio.com",
  projectId: "aegle-healthcare",
  storageBucket: "aegle-healthcare.appspot.com",
  messagingSenderId: "756985957982",
  appId: "1:756985957982:web:2b7df6c18dcb00d1072ecf",
  measurementId: "G-J1TPHYN3NH",
});

const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//   console.log("[firebase-messaging-sw.js] ", payload);
// });

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  payload &&
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.image,
    });

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Add an event listener to handle notification clicks
self.addEventListener("notificationclick", function (event) {
  if (event.action === "join") {
    // Like button was clicked

    // const photoId = event.notification.data.photoId;
    // like(photoId);
    console.log("user clicked to join");
  } else if (event.action === "cancel") {
    // Unsubscribe button was clicked

    console.log("user clicked to cancel");
  }

  event.notification.close();
});
