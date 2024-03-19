const authenticate = async (token, setLogin) => {
  const token = localStorage.getItem('token');
  setToken(token);
  const response = await fetch('/api/account/auth', {
    headers: {
      'authorization': token
    }
  });

  if (!response.ok) {
    const message = `Error has occured: ${response.statusText}`;
    window.alert(message);
    return;
  }

  const user = await response.json();
  if (!user) {
    window.alert('Error: Unable to load user JSON data');
    return;
  }
  
  setUsername(user.username);
  return;
}

module.exports = {
  authenticate
};
