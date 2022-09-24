import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  orderBy,
  query,
  limit,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbedQTkqbJjMAyZS3sb_rcpGIj8cs3Kd4",
  authDomain: "deathwish-2ae85.firebaseapp.com",
  projectId: "deathwish-2ae85",
  storageBucket: "deathwish-2ae85.appspot.com",
  messagingSenderId: "948907420860",
  appId: "1:948907420860:web:2e20c48dc895a82e34b4b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const collectionRef = collection(db, "wishes");
const q = query(collection(db, "wishes"), orderBy("length", "desc"), limit(10));

document.addEventListener("DOMContentLoaded", async () => {
  renderWishes();
});

document.querySelector("button").addEventListener("click", (e) => {
  e.preventDefault();

  const wish = document.querySelector("#wish").value;

  document.querySelector("[data-submit-button]").disabled = true;

  if (wish === "") {
    document.querySelector("[data-submit-button]").disabled = false;
    return;
  }

  addDoc(collectionRef, {
    wish,
    length: wish.length,
  })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

  // clear form after submit
  document.querySelector("#wish").value = "";

  document.querySelector("[data-submit-button]").disabled = false;
});

async function getWishes() {
  const querySnapshot = await getDocs(q);

  return querySnapshot;
}

onSnapshot(q, (snapshot) => {
  renderWishes(snapshot);
});

async function renderWishes(snapshot) {
  let wishes;
  if (!snapshot) wishes = await getWishes();
  else wishes = snapshot;

  console.log(wishes.docs);

  if (wishes.docs.length === 0) {
    document.querySelector("tbody").innerHTML = tableRow(
      "-",
      "No wishes yet. Be the first to wish."
    );

    return;
  }

  document.querySelector("tbody").innerHTML = wishes.docs
    .map((wish, index) => {
      return tableRow(index + 1, wish.data().wish);
    })
    .join("");
}

const tableRow = (serialNo, wish) => {
  return `<tr>
      <td> ${serialNo} </td>
      <td class="wish"> ${wish} </td>
    </tr>
  `;
};
