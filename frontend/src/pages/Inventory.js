import { React,  useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { useParams, Link } from 'react-router-dom';

import Layout from "../components/Layout";
import PalPreview from "../components/PalPreview";
import { SearchBar } from '../components/SearchBar';

export default function InventoryPage() {
  // TODO: formatting (css)
  const params = useParams();
  const param_username = params.id;
  const { username } = useContext(UserContext);
  const [inventory, setInventory] = useState(null);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadInventory = async () => {

      const response = await fetch(`/api/inventory/${param_username}`);

      const data = await response.json();
      if (!data) {
        window.alert('Error: Unable to load listing JSON data. :(');
        return;
      }

      if (!data.success || data.error) {
        setError(data.error);
      }

      const pals = data.pals;
      setInventory(pals);
    }

    loadInventory(param_username);
  }, [param_username]);
  // TODO: create function for the button click of adding pal

  // TODO: if the same user then add button to page to add pals to their inventory
  // TODO: when button clicked -> pop up form or change to new page then send request to backend

    if (error) {
      return (
        <Layout>
        <div className='inventory-container page'>
          <p className='error'>{error}</p>
        </div>
      </Layout>
      );
    }


    return (
    <Layout>
      <div className='inventory-container page'>
        <Link to={`/user/${param_username}`} className='back-button'>{`< ${param_username}`}</Link>
        {param_username === username && ( <Link to='/pal/new' className='back-button'>Add Pal</Link>)}
        <div className='search-bar-container'>
          <SearchBar setResults={setResults} />
          <div>SearchResults</div>
        </div>
        <div className='inventory'>
          {inventory && inventory.map(pal => ( <PalPreview key={pal._id} userPal={pal} user={param_username === username}/> ))}
        </div> 
      </div>
    </Layout>
    );
}
