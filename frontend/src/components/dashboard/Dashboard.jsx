import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from "../NavBar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`,
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error while fetching the Repository : ", error.message);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch("http://localhost:3002/repo/all");
        const data = await response.json();
        setSuggestedRepositories(data.repositories);
        console.log(suggestedRepositories);
      } catch (error) {
        console.error("Error while fetching the Repository : ", error.message);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  //Depend on seach query and user repo
  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar/>
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.map((repo) => {
            return (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <h4>{repo.description}</h4>
              </div>
            );
          })}
        </aside>
        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Seach...."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {repositories.map((repo) => {
            return (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <h4>{repo.description}</h4>
              </div>
            );
          })}
        </main>
        <aside>
          <h3>Upcoming Events</h3>
          <li>
            <p> Tech Conference - 15 December </p>
          </li>
          <li>
            <p> Developer Conference - 25 December </p>
          </li>
          <li>
            <p> React Summit - 5 December </p>
          </li>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
