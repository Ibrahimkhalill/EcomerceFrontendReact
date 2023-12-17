import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import "./home.css";

import { Link, useLocation } from "react-router-dom";
function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const username = location.state?.username;

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      try {
        const result = await fetch("http://127.0.0.1:8000/api/get-videos/");

        if (!result.ok) {
          throw new Error("Network result was not ok");
        }

        const data = await result.json();

        if (isMounted) {
          setVideos(data);
          setLoading(false);
          console.log("Fetched data:", data);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchVideos();
    }

    // Cleanup function to update isMounted when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const token = localStorage.getItem("authToken");

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar username={username} />
      <div className="card-container">
        {videos.map((video) => (
          <Link
            to={
              token
                ? {
                    pathname: `/question/${video.youtubeID}`,
                    state: { title: video.title },
                  }
                : "/signup"
            }
            key={video.youtubeID}
          >
            <div className="card">
              <img
                src={`http://img.youtube.com/vi/${video.youtubeID}/maxresdefault.jpg`}
                alt={video.title}
              />
              <div className="card-content">
                <div className="card-title">{video.title}</div>
                <div className="card-description">
                  <div>{video.noq} Questions</div>
                  <div>Total Point: {video.noq * 5}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default React.memo(Home);
