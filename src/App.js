import React, { useState, useEffect } from "react";
import "./App.css";
import Tesseract from "tesseract.js";
import TextWrapper from "./components/TextWrapper";
import ImageWrapper from "./components/ImageWrapper";
import axios from "axios";

const API_KEY = "72cdbedbf6cb03092ae7621172225b68";

function App() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState(null);

  const convertImageToText = async () => {
    setLoading(true);
    const result = await Tesseract.recognize(imageUrl, "eng");
    setText(result.data.text);
    setLoading(false);
  };

  const uploadFile = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData,
        config
      );
      setImageUrl(res.data.data.url);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (imageUrl != null) {
      convertImageToText();
    }
  }, [imageUrl]);

  return (
    <div className="App">
      <div className="container">
        {loading && <div className="loader"></div>}
        {text == null ? (
          <ImageWrapper loading={loading} uploadFile={uploadFile} />
        ) : (
          <TextWrapper text={text} />
        )}
      </div>
    </div>
  );
}

export default App;
