import React, { Component } from "react";

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
        };
    }

    handleChange    = (e) => {
        let { name , value }    = e.target;
        const activeItem        = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    }

    render() {
        const { handleSubmit, activeItem, closeModal } = this.props;

        return (
            <>
            <div className="modal_area" >
                <div className="modal_bg_area" onClick={closeModal}></div>
                <div className="modal_content_area">
                    <form>
                        
                        { activeItem.id ? ( <h2>編集</h2> ) : ( <h2>新規作成</h2> ) }
                        <textarea className="form-control" name="comment" onChange={this.handleChange} value={this.state.activeItem.comment}></textarea>
                        <input className="btn btn-success" type="button" onClick={ () => handleSubmit(this.state.activeItem) } value="保存" />
                    </form>
                </div>
            </div>

            </>
        );
    }
}

