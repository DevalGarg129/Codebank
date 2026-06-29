import React, { useState, useEffect } from "react";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            try{
                const response = await fetch(`http://localhost:3002/repo/user/${userId}`);
                const data = await response.json();
                console.log(data);
            }catch(error){
                console.error("Error while fetching the Repository : ", error.message);
            }
        }

        const fetchSuggestedRepositories = async () => {
            try{
                const response = await fetch("http://localhost:3002/repo/all");
                const data = await response.json();
                console.log(data);
                setSuggestedRepositories(data.repositories);
            }catch(error){
                console.error("Error while fetching the Repository : ", error.message);
            }
        };

        fetchRepositories();
    }, []);
}

export default Dashboard;