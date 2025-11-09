import PersonalDetails from "./components/PersonalDetails";

<Routes>
  …
  <Route path="/profile/details" element={<PersonalDetails />} />
</Routes>
import React, { useState } from "react";

function PersonalDetails() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadhar: "",
    income: "",
    caste: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend (MongoDB)
    console.log("Details saved", form);
  };

  return (
    <div className="details-page">
      <h2>Complete your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input name="aadhar" placeholder="Aadhaar Number" onChange={handleChange}/>
        <input name="income" placeholder="Income Certificate No" onChange={handleChange}/>
        <input name="caste" placeholder="Caste Certificate No" onChange={handleChange}/>
        <button>Save Details</button>
      </form>
    </div>
  );
}
export default PersonalDetails;