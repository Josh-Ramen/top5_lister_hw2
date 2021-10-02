import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.currentList.items[this.props.index],
            editActive: false,
            isDragging: false,
            isDraggedOver: false
        }
    }

    handleClick = (event) => {
        if (event.detail === 1) {
            console.log(this.state.text);
        }
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = () => {
        this.setState(({
            editActive: !this.state.editActive
        }), () => {
            this.props.editingCallback(this.state.editActive);
        });
    }
    handleUpdate = (event) => {
        let newText = event.target.value;
        this.setState({ text: newText });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let textValue = this.state.text;
        this.handleRenameList(this.props.index, textValue);
        this.handleToggleEdit();
    }
    handleRenameList = (index, text) => {
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
        this.setState({
            isDraggedOver: true
        })
    }
    handleDragLeave = (event) => {
        event.preventDefault();
        this.setState({
            isDraggedOver: false
        })
    }
    handleDrop = () => {
        this.setState({
            isDraggedOver: false
        })
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
            let className;
            if (this.state.isDraggedOver) {
                className = "top5-item-dragged-to";
            } else {
                className = "top5-item"
            }
            return (
                <div draggable
                className={className}
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