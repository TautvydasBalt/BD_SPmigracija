import React from 'react';
import { ITag, Label, TagPicker, initializeIcons } from '@fluentui/react';
initializeIcons();

interface UserPickerProps {
    fieldTitle?: string;
    allTags: ITag[];
    setSelectedTags?: any;
    setdefaultSelectedItems?: any;
}

interface UserPickerStates {
    defaultTags: ITag[];
}

class UserPicker extends React.Component<UserPickerProps, UserPickerStates> {
    public render() {
        return (
            <div>
                <Label>{this.props.fieldTitle}</Label>
                <TagPicker
                    removeButtonAriaLabel="Remove"
                    selectionAriaLabel={this.props.fieldTitle}
                    pickerCalloutProps={{ doNotLayer: true }} // this option tells the picker's callout to render inline instead of in a new layer
                    onResolveSuggestions={this.filterSuggestedTags}
                    defaultSelectedItems={this.props.setdefaultSelectedItems}
                />
            </div>
        );
    }

    private filterSuggestedTags = (filter: string, selectedItems?: ITag[]): ITag[] => {
        let tags = this.props.allTags ? this.props.allTags : [];
        if (this.props.setSelectedTags || selectedItems) this.props.setSelectedTags(selectedItems);
        return filter
            ? tags.filter(
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