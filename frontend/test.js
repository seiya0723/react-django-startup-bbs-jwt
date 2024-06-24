import React, { Component } from "react";
import axios from "axios";

//import Modal from "./components/Modal";
// リクエスト送信用のaxiosとモーダルをimport

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topicList: [],
            activeItem: {
                comment: "",
            },
        };
    }
    
    // コンポーネントがDOMにマウントされた時、Topicのデータを読み込みに行く。
    componentDidMount() {
        this.refreshList();
    }

    //ここでaxiosを使ってデータを取得する。jsonで返ってくるのでStateに入れる。
    refreshList = () => {
        axios
            .get("/api/topics/")
            .then((res) => this.setState({ topicList: res.data }))
            .catch((err) => console.log(err));
    }

    // モーダルダイアログを表示させ、idがあれば編集処理のダイアログを、なければ新規作成のダイアログを表示させる
    handleSubmit = (item) => {

        // 投稿処理
        axios
            .post("/api/topics/", item)
            .then((res) => {
                this.refreshList();
                // FIXME:投稿した後、テキストエリアに文字列が残ってしまう。
                this.setState({ activeItem: { comment: "" } });
            });
    }

    // 削除処理。axiosを使ってDELETEメソッドの送信。refreshListを使ってデータを取得する。
    handleDelete = (item) => {
        axios
            .delete(`/api/topics/${item.id}/`)
            .then((res) => this.refreshList());
    }

    handleChange = (e) => {
        let { name , value }    = e.target;
        const activeItem        = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    }

    // タブの中身 Topicの数だけレンダリングする。
    renderItems = () => {
        return this.state.topicList.map((item) => (
            <div className="border">

                <div>{item.id}:{item.comment}</div>
                <div className="text-end">
                    <input type="button" className="btn btn-danger" value="削除" onClick={ () => this.handleDelete(item) } />
                </div>

            </div>
        ));
    }

    // ページに表示させる内容(本体を表示、タブとタブの中身はそれぞれ呼び出し。)
    render() {
        return (
            <main className="container">
                <textarea className="form-control" name="comment" onChange={this.handleChange} value={this.state.activeItem.comment}></textarea>
                <input type="button" value="送信" onClick={ () => this.handleSubmit(this.state.activeItem) }/>
                {this.renderItems()}
            </main>
        );
    }
}

export default App;
