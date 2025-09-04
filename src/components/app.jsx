import React from 'react';
import { App, Panel, View } from 'framework7-react';

import routes from '../js/routes';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      // Framework7 Parameters
      f7params: {
        id: 'com.nehloo.studentgrader', // App bundle ID
        name: 'StudentGrader', // App name
        theme: 'auto', // Automatic theme detection
        // App root data
        data: function () {
          return {
          };
        },
        // App routes
        routes: routes,
        // Register service worker
        serviceWorker: {
          path: '/service-worker.js',
        },
        defaultData: {
          course: "",
          assignment: "",
          teacher: "",
          factors: [
            {
              title: "The student needed to do this...",
              importance: 5,
              topgrade: 10
            },
            {
              title: "The student needed to do that...",
              importance: 4,
              topgrade: 10
            },
            {
              title: "Other requirements for this assignment...",
              importance: 3,
              topgrade: 10
            },
            {
              title: "Other expectations from the student...",
              importance: 2,
              topgrade: 10
            },
            {
              title: "The student submitted on time, etc...",
              importance: 1,
              topgrade: 10
            }
          ],
          students: [
            "Student1",
            "Student2",
            "Student3",
            "Student4",
            "Student5"
          ],
          grades: [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""]
          ]
        }
      }
    }
  }

  componentDidMount() {
    //f7ready((f7Instance) => {
    //});
  }

  render() {
    return (
      <App params={ this.state.f7params } >

        <Panel right cover themeDark>
          <View url="/panel-right/" />
        </Panel>

        <View main className="safe-areas" url="/" pushState={true} pushStateSeparator="" pushStateRoot="" />

      </App>
    )
  }
}