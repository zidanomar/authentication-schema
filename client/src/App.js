import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [jwt, setJwt] = useState(null);
  const [foods, setFoods] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [newFoodMessage, setNewFoodMessage] = useState(null);

  const getJwt = async () => {
    const { data } = await axios.get(`/jwt`);
    setJwt(data.token);
  };

  const getFoods = async () => {
    try {
      const { data } = await axios.get(`/foods`);
      setFoods(data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const createFood = async () => {
    try {
      const { data } = await axios.post('/foods');
      setNewFoodMessage(data.message);
      setFoods(data.newFood);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/csrf-token');
      axios.defaults.headers.post['X-CSRF-Token'] = data.csrfToken;
    };
    getCsrfToken();
  }, []);

  return (
    <React.Fragment>
      <section style={{ marginBottom: '10px' }}>
        <button onClick={() => getJwt()}>Get JWT</button>
        {jwt && (
          <pre>
            <code>{jwt}</code>
          </pre>
        )}
      </section>
      <section style={{ marginBottom: '10px' }}>
        <button onClick={() => getFoods()}>Get Foods</button>
        <ul>
          {foods.map((food, i) => (
            <li key={i}>{food.description}</li>
          ))}
        </ul>
        {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      </section>
      <section>
        <button onClick={() => createFood()}>Create New Food</button>
        {newFoodMessage && <p>{newFoodMessage}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
