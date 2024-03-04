import './App.css'

function App() {
  const server = () => {
    fetch('http://localhost:2000/runTest')
      .then(response => response.json())
      .then(data => console.log(data));
  };

  return (

    <>
      <div>
        <button onClick={server}>Launch Spotify</button>
      </div>
    </>
  )
}

export default App
