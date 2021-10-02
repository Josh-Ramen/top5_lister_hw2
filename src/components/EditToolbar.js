import React from "react";

export default class EditToolbar extends React.Component {
    handleClose = () => {
        if (this.props.canClose) {
            this.props.closeCallback();
        }
    }
    handleUndo = () => {
        if (this.props.canUndo) {
            this.props.undoCallback();
        }
    }
    handleRedo = () => {
        if (this.props.canRedo) {
            this.props.redoCallback();
        }
    }
    render() {
        let closeClass = "top5-button";
        let undoClass  = "top5-button";
        let redoClass  = "top5-button";
        
        if (!this.props.canClose) {
            closeClass = closeClass + "-disabled"
        }
        if (!this.props.canUndo) {
            undoClass = undoClass + "-disabled"
        }
        if (!this.props.canRedo) {
            redoClass = redoClass + "-disabled"
        }

        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    className={undoClass}
                    onClick = {this.handleUndo}>
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className={redoClass}
                    onClick = {this.handleRedo}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className={closeClass}
                    onClick = {this.handleClose}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}