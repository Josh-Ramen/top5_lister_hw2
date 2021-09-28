import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.currentList.items[this.props.index],
            editActive: false
        }
    }
    
    handleClick = (event) => {
        console.log(this.state.text);
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }
    handleUpdate = (event) => {
        let newText = event.target.value;
        this.setState({ text: newText });
        console.log(this.state.text);
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = (event) => {
        let textValue = this.state.text;
        console.log("ItemCard handleBlur: " + textValue);
        this.handleRenameList(this.props.index, textValue);
        this.handleToggleEdit();
    }
    handleRenameList = (index, text) => {
        console.log(index);
        this.props.renameListItemCallback(index, text);
    }

    render() {
        const {currentList, index} = this.props;

        if (this.state.editActive) {
            return (
                <input
                className="list-card"
                type='text'
                onKeyPress={this.handleKeyPress}
                onBlur={this.handleBlur}
                onChange={this.handleUpdate}
                defaultValue={currentList.items[index]}>
                </input>
                )
        } else {
            return (
                <div
                className="top5-item"
                onClick={this.handleClick}>
                    {currentList.items[index]}
                </div>
            )
        }
    }
}