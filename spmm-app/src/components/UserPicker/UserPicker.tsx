import React from 'react';
import styles from './UserPicker.module.scss';
import { ITag, Label, TagPicker } from '@fluentui/react';

interface UserPickerProps {
    fieldTitle?: string;
    allTags: ITag[];
}

class UserPicker extends React.Component<UserPickerProps, {}> {
    public render() {
        return (
            <div>
                <Label>{this.props.fieldTitle}</Label>
                <TagPicker
                    removeButtonAriaLabel="Remove"
                    selectionAriaLabel={this.props.fieldTitle}
                    pickerCalloutProps={{ doNotLayer: true }} // this option tells the picker's callout to render inline instead of in a new layer
                    onResolveSuggestions={this.filterSuggestedTags}
                />
            </div>
        );
    }

    private filterSuggestedTags = (filter: string, selectedItems?: ITag[]): ITag[] => {
        return filter
            ? this.props.allTags.filter(
                tag => tag.name.toLowerCase().indexOf(filter.toLowerCase()) === 0 && !this.listContainsTagList(tag, selectedItems),
            )
            : [];
    };

    private listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.some(compareTag => compareTag.key === tag.key);
    };

}

export default UserPicker;