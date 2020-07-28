import React from 'react'
import { Container, Button, Input, Col, Row, FormGroup, Label, Card, CardTitle, CardBody, CardHeader } from 'reactstrap'
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "assets/scss/plugins/extensions/editor.scss"
import draftToHtml from 'draftjs-to-html';

export default class RichEditor extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
  
    onEditorStateChange: Function = (editorState) => {
      this.setState({
        editorState,
      });
      let rawContentState = convertToRaw(editorState.getCurrentContent())
      const markup = draftToHtml(
          rawContentState
      );
      console.log(markup)
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
                  options: ['inline', 'blockType', 'list' ],
                  inline: { options: ['bold', 'italic', 'underline', 'superscript', 'subscript'] },
                  blockType: {
                      inDropdown: true,
                      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                      className: undefined,
                      component: undefined,
                      dropdownClassName: undefined,
                  },
                  list: {
                      options: ['unordered', 'ordered'],
                  },
              }}
            />
          </CardBody>
        </Card>
      )
    }
  }
  