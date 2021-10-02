import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const {closeCallback} = this.props;
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
                    className={undoClass}>
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className={redoClass}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    onClick = {closeCallback}
                    className={closeClass}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}