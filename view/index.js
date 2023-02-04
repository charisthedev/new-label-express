function App(){
    const [file, setFile] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [progress, setProgress] = React.useState(0);

    const onChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('video', file);
        try {
          const res = await axios.post('http://localhost:5000/api/video-upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = (progressEvent.loaded / progressEvent.total) * 100;
              setProgress(progress);
            }
          });
          setMessage(res.data.message);
        } catch (err) {
          setMessage(err.response.data.message);
        }
    };

    return (
        <div>
        <form onSubmit={onSubmit}>
          <input type="file" onChange={onChange} />
          <button type="submit">Upload Video</button>
        </form>
        {progress > 0 && (
        <div>
          Upload progress: {Math.round(progress)}%
        </div>
      )}
      {message && <div>{message}</div>}
      <video src="http://localhost:5000/api/video/video-1675484472174.mp4" controls />
      </div>
    )
}

// Render React component to the DOM
ReactDOM.render(<App/>,document.getElementById('root'));