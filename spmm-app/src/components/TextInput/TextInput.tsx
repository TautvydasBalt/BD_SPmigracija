import React from 'react';
import { ITag, Label, TagPicker, TextField, initializeIcons } from '@fluentui/react';
initializeIcons();

interface TextInputProps {
    label: string;
    fieldValue: string;
}

class TextInput extends React.Component<TextInputProps, {}> {
    public render() {
        return (
            <div>
                <TextField onChange={this.handleTextFieldChange} label={this.props.label} />

            </div>
        );
    }

    private handleTextFieldChange (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        // const inputName = event.currentTarget.name;
        // if (newValue) this.props.fieldValue = newValue;
    };

}

export default TextInput;