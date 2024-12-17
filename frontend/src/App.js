import React, { useEffect, useState } from 'react';

import Modal from "./components/Modal";
import axios from "axios";

const App = () => {

    const [topicList , setTopicList]            = useState([]);
    const [modal , setModal]                    = useState(false);
    const [activeItem, setActiveItem]           = useState({ comment: "" });
    const [username, setUsername]               = useState('');
    const [password, setPassword]               = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading]             = useState(true);

    // Stateに username とpassword、isAuthenticated を追加しておく。
    useEffect(() => {
        refreshList();
    }, []);

    const refreshList = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken){ return false; }

        try{
            const response = await axios.get("/api/topics/",{ headers: { Authorization: `Bearer ${accessToken}` } })

            setTopicList(response.data);
            setIsAuthenticated(true);
            setIsLoading(false);
        }
        catch(error){
            console.log(error);
        }
    };

    const login = async () => {
        try {
            const response = await axios.post('/api/token/', {
                username,
                password,
            });
            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            console.log("認証に成功しました。");
            setIsAuthenticated(true);
            refreshList();
                
        } catch (error) {
            console.log("認証に失敗しました。");
            console.error('Login failed:', error);
        }
    }
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
    }

    // usernameとpasswordのstateの変更
    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    }

    const handleSubmit = async () => {

        const accessToken = localStorage.getItem('access_token');
        if (activeItem.id) {
            try {
                const response = await axios.put(`/api/topics/${activeItem.id}/`,
                                        activeItem,
                                        { headers: { Authorization: `Bearer ${accessToken}` }})
                refreshList();
            }
            catch (error){
                console.log(error);
            }
            
        } else {
            try {
                const response = await axios.post("/api/topics/",
                                        activeItem,
                                        { headers: { Authorization: `Bearer ${accessToken}` } })

                refreshList();
            }
            catch (error){
                console.log(error);
            }
        }

        closeModal();
    };

    const handleDelete = async (item) => {
        const accessToken = localStorage.getItem('access_token');

        try {
            const response = await axios.delete(`/api/topics/${item.id}/`,{ headers: { Authorization: `Bearer ${accessToken}` } } )
            refreshList();
        }
        catch (error){
            console.log(error);
        }

    };

    const openModal = (item) => {

        // 編集の場合はidも含める
        if (item.id) {
            setActiveItem(item);
        } else {
            setActiveItem({ comment: "" });
        }
        
        setModal(true);
    };

    const closeModal = () => {
        setActiveItem({ comment: "" });
        setModal(false);
    };

    const linebreaksbr = (string) => {
        return string.split('\n').map((item, index) => (
            <React.Fragment key={index}>
            {item}
            {index !== string.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };



    const renderItems = () => {
        return topicList.map((item) => (
            <div className="border" key={item.id}>
            <div>{item.id}</div>
            <div>{linebreaksbr(item.comment)}</div>
            <div className="text-end">
            <input type="button" className="mx-1 btn btn-success" value="編集" onClick={() => openModal(item)} />
            <input type="button" className="mx-1 btn btn-danger" value="削除" onClick={() => handleDelete(item)} />
            </div>
            </div>
        ));
    };

    if (isLoading){
        return (
            <div>Now Loading...</div>
        )
    }


    if (!isAuthenticated) {
        return (
            <div>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange(setUsername)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange(setPassword)}
                    placeholder="Password"
                />
                <input type="button" value="ログイン" onClick={login} />
            </div>
        );
    }
    return (
        <>
            <h1 className="bg-primary text-white text-center">簡易掲示板</h1>
            <main className="container">
                {isAuthenticated ? (
                    <input className="btn btn-danger" type="button" onClick={logout} value="ログアウト" />
                ) : (
                    <div>ログアウトしました</div>
                )}
                <input className="btn btn-primary" type="button" onClick={() => openModal(activeItem)} value="新規作成" />
                {modal ? (
                    <Modal
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    handleSubmit={handleSubmit}
                    closeModal={closeModal}
                    />
                ) : null }
                {renderItems()}
            </main>
        </>
    );
}

export default App;

