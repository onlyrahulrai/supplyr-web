import { Component } from 'react';
import { Card, CardBody } from 'reactstrap'
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "assets/scss/plugins/extensions/editor.scss"
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class RichEditor extends Component {
    constructor(props) {
      super(props);
      if(!props.defaultValue) {
        this.state = {
          editorState: EditorState.createEmpty(),
        }
      }
      else {
        const blocksFromHTML = htmlToDraft(this.props.defaultValue); //convertFromHTML(this.props.defaultValue);
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap,
        )
        this.state = {
          editorState: EditorState.createWithContent(contentState),
        };
      }
    }

  
    onEditorStateChange = (editorState) => {
      this.setState({
        editorState,
      });
      let rawContentState = convertToRaw(editorState.getCurrentContent())
      const markup = draftToHtml(
          rawContentState
      );
      console.log(markup)
      this.props.onChange(markup)
    };
  
    render() {
      const { editorState } = this.state;
      return (
          <Card>
          <CardBody>
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history' ],
                  inline: { options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'] },
                  blockType: {
                      inDropdown: true,
                      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                      className: undefined,
                      component: undefined,
                      dropdownClassName: undefined,
                  },
                  list: {
                      options: ['unordered', 'ordered', 'indent', 'outdent'],
                  },
              }}
            />
          </CardBody>
        </Card>
      )
    }
  }
  