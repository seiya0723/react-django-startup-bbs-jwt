import React, { Component } from "react";

import Modal from "./components/Modal";
import axios from "axios";

import jwt_decode from 'jwt-decode';




class App extends Component {

    // Stateに username とpassword、isAuthenticated を追加しておく。
    constructor(props) {
        super(props);
        this.state = {
            topicList: [],
            modal: false,
            activeItem: {
                comment: "",
            },
            username: '',
            password: '',
            isAuthenticated: false,
        };

        this.api = axios.create({ baseURL: '/api/', });

    }


    componentDidMount() {
        if (localStorage.getItem('access_token')) {
            this.setState({ isAuthenticated: true }, this.refreshList);
        }
    }

    login = async (username, password) => {
        try {
            const response = await axios.post('/api/token/', {
                username,
                password,
            });
            const { access, refresh } = response.data;

            //console.log(response.data);

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            console.log("認証に成功しました。");
                
            return true;
        } catch (error) {

            console.log("認証に失敗しました。");

            console.error('Login failed:', error);
            return false;
        }
    }

    handleLoginSubmit = async (event) => {
        event.preventDefault();
        const { username, password }    = this.state;
        const success                   = await this.login(username, password);

        if (success) {
            console.log("認証に成功したので、ページをロードします。");
            this.setState({ isAuthenticated: true }, this.refreshList);
        } else {
            console.log('Login failed');
        }
    }

    handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.setState({ isAuthenticated: false, topicList: [] });
        // 任意の追加のクリーンアップ処理をここに追加することもできます
    };



    /*
    login = async () => {
        const { username, password } = this.state;
        const success = await this.login(username, password);
        if (success) {
            this.setState({ isAuthenticated: true }, this.refreshList);
        } else {
            console.log('Login failed');
        }
    }
    */

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    refreshList = () => {

        const accessToken = localStorage.getItem('access_token');

        console.log(accessToken);
        console.log("ロードします");
        this.api.get("/topics/",{ headers: { Authorization: `Bearer ${accessToken}` } })
            .then((res) => this.setState({ topicList: res.data }))
            .catch((err) => {
                console.log("==================");
                //console.log(err);
                console.log(err.response);
                console.log("==================");
            });
    };

    handleSubmit = (item) => {

        const accessToken = localStorage.getItem('access_token');

        if (item.id) {
            this.api.put(`/topics/${item.id}/`, item, { headers: { Authorization: `Bearer ${accessToken}` } })
                .then((res) => {
                    this.refreshList();
                })
                .catch((err) => console.log(err));
        } else {
            this.api.post("/topics/", item, { headers: { Authorization: `Bearer ${accessToken}` } })
                .then((res) => {
                    this.refreshList();
                })
                .catch((err) => console.log(err));
        }

        this.closeModal();
    };

    handleDelete = (item) => {

        const accessToken = localStorage.getItem('access_token');

        this.api.delete(`/topics/${item.id}/`,{ headers: { Authorization: `Bearer ${accessToken}` } } )
            .then((res) => this.refreshList());
    };

    openModal = (item) => {
        if (item.id) {
            this.setState({ activeItem: item, modal: true });
        } else {
            this.setState({ activeItem: { comment: "" }, modal: true });
        }
    };

    closeModal = () => {
        this.setState({ activeItem: { comment: "" }, modal: false });
    };

    linebreaksbr = (string) => {
        return string.split('\n').map((item, index) => (
            <React.Fragment key={index}>
            {item}
            {index !== string.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    renderItems = () => {
        return this.state.topicList.map((item) => (
            <div className="border" key={item.id}>
            <div>{item.id}</div>
            <div>{this.linebreaksbr(item.comment)}</div>
            <div className="text-end">
            <input type="button" className="mx-1 btn btn-success" value="編集" onClick={() => this.openModal(item)} />
            <input type="button" className="mx-1 btn btn-danger" value="削除" onClick={() => this.handleDelete(item)} />
            </div>
            </div>
        ));
    };

    render() {
        if (!this.state.isAuthenticated) {
            return (
                <div>
                    <h2>Login</h2>
                    <form onSubmit={this.handleLoginSubmit}>
                        <input
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            placeholder="Password"
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>

            );
        }

        return (
            <>
            <h1 className="bg-primary text-white text-center">簡易掲示板</h1>
            <main className="container">

                {this.state.isAuthenticated ? (
                  <button onClick={this.handleLogout}>ログアウト</button>
                ) : (
                  <div>ログアウトしました</div>
                )}

                <input className="btn btn-primary" type="button" onClick={() => this.openModal(this.state.activeItem)} value="新規作成" />
                {this.state.modal ? (
                    <Modal
                    activeItem={this.state.activeItem}
                    handleSubmit={this.handleSubmit}
                    closeModal={this.closeModal}
                    />
                ) : null}
                {this.renderItems()}



            </main>
            </>
        );
    }
}

export default App;



/*

// リクエスト送信用のaxiosとモーダルをimport
class App extends Component {

    // Stateの設計からやり直す。
    constructor(props) {
        super(props);
        this.state = {
            topicList: [],
            modal: false,
            activeItem: {
                comment: "",
            },
        };
    }
    componentDidMount() {
        this.refreshList();
    }

    refreshList     = () => {
        axios
            .get("/api/topics/")
            .then((res) => this.setState({ topicList: res.data }))
            .catch((err) => console.log(err));
    };


    // ログインの処理を行う関数 (ログイン後、ローカルストレージに記録をする)
    login = async (username, password) => {
        try {
            const response = await axios.post('/api/token/', {
                username: username,
                password: password,
            });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };


    // 認証済みのリクエストの作成
    api = axios.create({ baseURL: '/api/' });
    api.interceptors.request.use(
        (config) => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );





    // 保護されたエンドポイントへのリクエスト 
    export default api;
    const fetchProtectedData = async () => {
        try {
            // 任意のURLへリクエストを送る。
            const response = await api.get('/protected-endpoint/');
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch protected data:', error);
        }
    };



    // モーダルダイアログを表示させ、idがあれば編集処理のダイアログを、なければ新規作成のダイアログを表示させる
    handleSubmit    = (item) => {

        if (item.id){
            axios
                .put(`/api/topics/${item.id}/`, item)
                .then((res) => {
                    this.refreshList();
                })
                .catch((err) => console.log(err));
        }
        else{
            axios
                .post("/api/topics/", item)
                .then((res) => {
                    this.refreshList();
                })
                .catch((err) => console.log(err));
        }

        this.closeModal();
    };

    handleDelete    = (item) => {
        axios
            .delete(`/api/topics/${item.id}/`)
            .then((res) => this.refreshList());
    };


    openModal       = (item) => {
        // 編集時はコメントをセット
        if (item.id){
            this.setState({ activeItem: item, modal: true });
        }
        else{
            this.setState({ activeItem: { comment:"" }, modal: true });
        }
    };
    closeModal      = () => {
        this.setState({ activeItem: { comment:"" }, modal: false });
    };


    // 改行をする
    linebreaksbr    = (string) => {

        // React.Fragment は <></> と同じであるが、今回はkeyを指定する必要があるため、React.Fragmentとする 
        return string.split('\n').map((item, index) => (
            <React.Fragment key={index}>
                {item}
                {index !== string.split('\n').length - 1 && <br />}
            </React.Fragment>
        )); 
    };

    renderItems     = () => {
        return this.state.topicList.map((item) => (
            <div className="border" key={item.id}>
                <div>{item.id}</div>
                <div>{ this.linebreaksbr(item.comment) }</div>
                <div className="text-end">
                    <input type="button" className="mx-1 btn btn-success" value="編集" onClick={ () => this.openModal(item) } />
                    <input type="button" className="mx-1 btn btn-danger" value="削除" onClick={ () => this.handleDelete(item) } />
                </div>
            </div>
        ));
    };
    render() {
        return (
            <>
                <h1 className="bg-primary text-white text-center">簡易掲示板</h1>
                <main className="container">

                    <input className="btn btn-primary" type="button" onClick={ () => this.openModal(this.state.activeItem) } value="新規作成" />
                    { this.state.modal ? ( <Modal activeItem    = {this.state.activeItem}
                                                  handleSubmit  = {this.handleSubmit}
                                                  closeModal    = {this.closeModal} /> ): null }
                    { this.renderItems() }

                </main>
            </>
        );
    };
}

export default App;
*/

