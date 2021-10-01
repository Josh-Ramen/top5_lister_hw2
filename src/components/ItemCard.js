import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.currentList.items[this.props.index],
            editActive: false,
            isDragging: false
        }
    }
    
    handleClick = (event) => {
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = () => {
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
    handleBlur = () => {
        let textValue = this.state.text;
        console.log("ItemCard handleBlur: " + textValue);
        this.handleRenameList(this.props.index, textValue);
        this.handleToggleEdit();
    }
    handleRenameList = (index, text) => {
        console.log(index);
        this.props.renameListItemCallback(index, text);
    }
    handleDragStart = () => {
        this.props.moveStartCallback(this.props.index);
        if (!this.state.isDragging) {
            this.setState({
                isDragging: true
            })
        }
    }
    handleDragEnd = () => {
        this.setState({
            isDragging: false
        })
    }
    handleDragOver = (event) => {
        event.preventDefault();
        
    }
    handleDragLeave = (event) => {
        event.preventDefault();
    }
    handleDrop = () => {
        this.props.moveEndCallback(this.props.index);
    }

    render() {
        const {currentList, index} = this.props;

        if (this.state.editActive) {
            return (
                <input
                autoFocus={true}
                className="top5-item"
                type='text'
                onKeyPress={this.handleKeyPress}
                onBlur={this.handleBlur}
                onChange={this.handleUpdate}
                defaultValue={currentList.items[index]}>
                </input>
                )
        } else {
            return (
                
                <div draggable
                className="top5-item"
                onClick={this.handleClick}
                onDragStart={this.handleDragStart}
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
                onDragEnd={this.handleDragEnd}
                onDrop={this.handleDrop}>
                    {currentList.items[index]}
                </div>
            )
        }
    }
}