const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";
const bearer = "BEARER " + token;
const myInit = {
  method: "GET",
  // withCredentials: true,
  // credentials: 'include',
  headers: {
    "Content-Type": "application/json",
    Authorization: bearer,
  },
  mode: "cors",
  cache: "default",
};
let isFromGoogle = false;

// show profile image
const profileButton = document.getElementById("MyProfile").children[0];
fetch("https://g24-cvmake-backend.herokuapp.com/api/profile", myInit)
  .then((res) => {
    // console.log(res);
    if (!res.ok) {
      throw Error("Could not fetch data for that resource");
    } else {
      return res.json();
    }
  })
  .then((jsonRes) => {
    if (!jsonRes.isAdmin) {
      window.location.href = "dashboard.html";
    }
    console.log(jsonRes.photoURL);
    profileButton.src = jsonRes.photoURL;

    if (jsonRes.googleId) isFromGoogle = true;
  })
  .catch((err) => {
    window.location.href = "login.html";
  });

let users = [];
//const body=document.getElementById("container");
const characterList = document.getElementById("feedTable");
const searchbar = document.getElementById("userSearch");
const url = "https://g24-cvmake-backend.herokuapp.com/api/users";
fetch(url, myInit)
  .then((res) => {
    // console.log(res);
    if (!res.ok) {
      throw Error("Could not fetch data for that resource");
    } else {
      return res.json();
    }
  })
  .then((jsonRes) => {
    console.log(jsonRes);
    users = jsonRes;
  })
  .catch((err) => {
    console.log({ err });
  });

//body.onload=() => {displayFeed(users)};
let checker = true;
searchbar.addEventListener("keyup", (e) => {
  const htmlcharacters = e.target.value;

  if (htmlcharacters == "") {
    checker = false;
  } else {
    checker = true;
  }
  console.log(Array.from(users));
  const filteredNames = Array.from(users).filter((names) => {
    if (htmlcharacters !== "") {
      return names.username.includes(htmlcharacters);
    }
  });
  if (filteredNames.length === 0) {
    checker = false;
  }
  displayFeed(filteredNames);
});

const displayFeed = (names) => {
  if (checker) {
    characterList.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add("table");
    table.innerHTML = `
            <thead >
                <tr >
                    <th scope="col">Delete</th>
                    <th scope="col">Users</th>
                    <th scope="col">CVs Saved</th>
                    
                </tr>
            </thead>

        `;

    names.forEach((i) => {
      const tbody = document.createElement("tbody");

      const tr = document.createElement("tr");

      const td = document.createElement("td");

      td.innerText = i.username;

      const num_cv = document.createElement("span");
      num_cv.classList.add("badge", "badge-primary", "badge-pill");
      num_cv.innerText = 0;

      const delete_user = document.createElement("button");

      delete_user.classList.add(
        "fas",
        "fa-trash-alt",
        "border-0",
        "btn",
        "btn-outline",
        "btn-primary",
        "my-2",
        "my-sm-0"
      );

      delete_user.onclick = () => {
        const deleted_user = users.indexOf(i);
        const filtered_user_deleted = names.indexOf(i);
        if (deleted_user !== -1 && filtered_user_deleted !== -1) {
          users.splice(deleted_user, 1);
          names.splice(filtered_user_deleted, 1);
          displayFeed(names);
        }
        myInit.method = "DELETE";
        fetch(
          `https://g24-cvmake-backend.herokuapp.com/api/users/${i.username}`,
          myInit
        )
          .then((res) => {
            // console.log(res);
            if (!res.ok) {
              throw Error("Could not fetch data for that resource");
            } else {
              return res.json();
            }
          })
          .then((jsonRes) => {
            console.log(jsonRes);
          })
          .catch((err) => {
            console.log({ err });
          });
      };

      tr.appendChild(delete_user);
      tr.appendChild(td);

      tr.appendChild(num_cv);

      tbody.appendChild(tr);
      table.appendChild(tbody);
    });
    if (names.length === 0) {
      characterList.innerHTML = "";
    } else {
      characterList.append(table);
    }
  } else {
    characterList.innerHTML = "";
  }
};

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", (e) => {
  myInit.method = "GET";
  let url =
    "https://g24-cvmake-backend.herokuapp.com/api/" +
    (isFromGoogle ? "login/auth/google/" : "") +
    "logout";
  fetch(url, myInit)
    .then((res) => {
      if (!res.ok) {
        throw Error("Could not fetch data for that resource");
      } else {
        return res.json();
      }
    })
    .then((jsonRes) => {
      console.log({ jsonRes });
      localStorage.removeItem("token");
      window.location.href = "index.html";
    })
    .catch((err) => console.log(err));
});