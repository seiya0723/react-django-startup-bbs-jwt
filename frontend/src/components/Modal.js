const Modal = ({ activeItem, setActiveItem, handleSubmit, closeModal }) => {

    const handleChange    = (e) => {
        let { name , value }    = e.target;
        setActiveItem({ ...activeItem, [name]: value })
    }

    return (
        <>
        <div className="modal_area">
            <div className="modal_bg_area" onClick={closeModal}></div>
            <div className="modal_content_area">
                <form>
                    { activeItem.id ? ( <h2>編集</h2> ) : ( <h2>新規作成</h2> ) }
                    <textarea className="form-control" name="comment" onChange={handleChange} value={activeItem.comment}></textarea>
                    <input className="btn btn-success" type="button" onClick={handleSubmit} value="保存" />
                </form>
            </div>
        </div>

        </>
    );
}

export default Modal
