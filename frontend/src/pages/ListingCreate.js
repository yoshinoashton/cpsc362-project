import Layout from "../components/Layout";
import Select from 'react-select';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Navigate } from "react-router-dom";

export default function ListingCreate() {
  const { username } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isShiny, setIsShiny] = useState(false);
  const [postResponse, setPostResponse] = useState(null);

  useEffect(() => {
    fetch(`/api/inventory/${username}`)
      .then(response => response.json())
      .then(data => {console.log(data);
        const formattedOptions = data.pals.map(item => ({
          value: item._id,
          label: item.pal[0].name,
          imageURL: item.pal[0].imageURL // Assuming you want to use the imageURL for the preview
        }));
        setOptions(formattedOptions);
        console.log(formattedOptions);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [username]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    // Construct payload
    const payload = {
      userPal_id: selectedOption ? selectedOption.value : null,
      cost: price,
      description: description,
      isShiny: isShiny,
    };
  
    // Make the POST request
    fetch('/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setPostResponse(response);
      return response.json(); // or response.text() if your server responds with text
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };  

  const handleReset = () => {
    // Reset form state
    setSelectedOption(null);
    setPrice('');
    setDescription('');
    setIsShiny(false);
  };


  return (
    <Layout>
      <div className="create-listing-page">
        <div className="left-side">
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <Select
              options={options}
              value={selectedOption}
              onChange={handleChange}>
            </Select>
            <br />
            <label className="create-listing-lab" htmlFor="price">Enter the price: $</label>
            <input className="create-listing-input" name="price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <br />
            <label className="create-listing-lab" htmlFor="desc">Write a description:</label><br />
            <textarea className="create-listing-input" name="desc" rows="4" cols="50" value={description} onChange={e => setDescription(e.target.value)} />
            <br />
            <label className="create-listing-lab" htmlFor="isShiny">Shiny: </label>
            <input className="create-listing-input-isshiny" name="isShiny" type="checkbox" checked={isShiny} onChange={e => setIsShiny(e.target.checked)} />
            <br />
            <div className="buttons">
              <input type="submit" value="Create" />
              <input type="reset" value="Reset" />
            </div>
          </form>
        </div>
        <div className="right-side">
          <div className="pal-pic-preview">
            {selectedOption?.imageURL && <img src={selectedOption.imageURL} alt="Pal Preview" />}
          </div>
          {postResponse && postResponse.success && (
          <Navigate to="/" replace={true} />
          )}
        </div>
      </div>
    </Layout>
  );
}
