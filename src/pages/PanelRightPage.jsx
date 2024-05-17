import React from 'react';
import { Block, Page, Navbar, NavRight, BlockTitle, Chip, Icon, Link, List, ListItem } from 'framework7-react';

import FileUploader from 'file-uploader-js';

import events from '../components/events';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      fileUploaderKey: 0
    }
  }

  loadNewData(data) {
    events.emit('loadNewData', {...JSON.parse(data)});
    this.$f7.panel.close("right")
  }

  componentDidMount() {
    this.$f7.panel.get('.panel-right').on('closed', () => {
      var fileUploaderKey = this.state.fileUploaderKey + 1
      this.setState({ fileUploaderKey:fileUploaderKey })
    })
  }

  render() {
    return (
      <Page>

        <Navbar title="StudentGrader">
          <NavRight>
            <Link iconF7="person_crop_circle_fill_badge_checkmark" iconSize="48" iconColor="white" />
            &nbsp;
            &nbsp;
          </NavRight>
        </Navbar>
        
        <Block>
          
          <List>
            <ListItem title="New" href="#" onClick={ () => {
              events.emit('loadNewData', null);
              this.$f7.panel.close("right")
            }} textColor="white">
              <Icon slot="media" f7="line_horizontal_3_decrease"></Icon>
            </ListItem>
          </List>

          <BlockTitle textColor="gray">SAVE TO LOCAL DISK</BlockTitle>
          <List>
            <ListItem title="Save" href="#" onClick={ () => {
              events.emit('saveData', null);
              this.$f7.panel.close("right")
            }} textColor="white">
              <Icon slot="media" f7="sort_down"></Icon>
            </ListItem>
          </List>

          <BlockTitle textColor="gray">LOAD FROM LOCAL DISK</BlockTitle>
          <List>
            <ListItem>
              <Icon slot="media" f7="sort_up" textColor="white"></Icon>
              <FileUploader
                key={ this.state.fileUploaderKey }
                accept=".studentgrader"
                uploadedFileCallback={ (data) => {
                  this.loadNewData(data)
                }}
              />
            </ListItem>
          </List>

          <Block textColor="gray">
            <Link href="https://github.com/nehloo/StudentGrader" target="_blank" external><Chip className="elevation-hover-3 elevation-transition" text="Contribute" mediaBgColor="gray" style={{ cursor:"pointer" }}>
              <Icon slot="media" ios="f7:logo_github" aurora="f7:logo_github" md="f7:logo_github"></Icon>
            </Chip></Link>
          </Block>

        </Block>

      </Page>
    );
  }
}
