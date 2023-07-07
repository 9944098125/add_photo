import React from "react";
import axios from "axios";

import "./App.css";

export default function App() {
  const [users, setUsers] = React.useState([]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  React.useEffect(() => {
    // create an asynchronous function to fetch the users
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:4000/api/get-users");
      // console.log(res.data.users);
      setUsers(res.data.users);
    };
    fetchUsers();
  });

  const onChangeImage = async (image) => {
    if (image === undefined) {
      return;
    }
    if (
      image.type === "image/jpeg" ||
      "image/jpg" ||
      "image/png" ||
      "image/svg"
    ) {
      const data = new FormData();
      data.append("file", image);
      // place your upload preset here
      data.append("upload_preset", "your_upload_preset");
      // place your cloud name here
      data.append("cloud_name", "your_cloud_name");
      // keep the fetching api and method same
      await fetch("https://api.cloudinary.com/v1_1/dakda5ni3/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // settiung the url with data.url we got from response
          // and send this to backend 
          // first console.log the data and see what's there in data.
          setUrl(data.url);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  const handleSubmit = async () => {
    // creating an object to send data to backend
    const data = {
      name: name,
      email: email,
      photo: url,
    };
    await axios
      .post("http://localhost:4000/api/post-users", data)
      .then((res) => setSuccessMessage(res.message))
      .catch((err) => console.log(err));
  };
  return (
    <React.Fragment>
      {users.map((user, idx) => (
        <div key={idx} className="row">
          <h1>{user.name}</h1>
          <h2>{user.email}</h2>
          <img src={user.photo} alt="" height="100px" width="100px" />
        </div>
      ))}
      <div className="row">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="file"
            name="url"
            onChange={(e) => onChangeImage(e.target.files[0])}
          />
          {url && <img src={url} alt="" height="50px" width="50px" />}
          <button type="submit">Submit</button>
        </form>
        {successMessage && successMessage}
      </div>
    </React.Fragment>
  );
}
