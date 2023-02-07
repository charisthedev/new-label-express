
function App(){
  const [file, setFile] = React.useState(null);
  const [chunks, setChunks] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const [chunkCount, setChunkCount] = React.useState();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const splitFile = (file, chunkSize) => {
    const fileSize = file.size;
    const numChunks = Math.ceil(fileSize / chunkSize);
    const fileChunks = new Array(numChunks);

    let start = 0;
    let end = chunkSize;

    for (let i = 0; i < numChunks; i++) {
      fileChunks[i] = file.slice(start, end);
      start = end;
      end = start + chunkSize;
    }

    setChunks(fileChunks);
  };

  React.useEffect(() => {
    if (file) {
      splitFile(file, 1024 * 1024);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChunkCount(chunks.length);
    const promises = chunks.map(async (chunk, i) => {
      try {
        const res = await axios.post("http://localhost:5000/api/asset-upload", { chunk: chunk.toString("base64"), chunkCount: chunkCount, chunkIndex: i });
        setProgress(prevProgress => prevProgress + 100 / chunks.length);
      } catch (error) {
        console.error(error);
      }
    });
  
    await Promise.all(promises);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/mp4"
          onChange={handleChange}
        />
        <button type="submit">Upload</button>
        {progress !== 0 && (
          <p>Upload progress: {progress.toFixed(2)}%</p>
        )}
      </form>
      <video width="400px" src="http://localhost:5000/api/video-Data Structures and Algorithms in JavaScript - Full Course for Beginners.mp4/play" controls />
    </div>
  )
}

// Render React component to the DOM
ReactDOM.render(<App/>,document.getElementById('root'));