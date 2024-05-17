import React from 'react';
import { Page, Navbar, NavLeft, NavTitle, NavRight, Button, Block, Link, Input, Icon, Row } from 'framework7-react';

import events from '../components/events'

export default class HomePage extends React.Component {
  constructor() {
    super()

    this.state = {
      data: JSON.parse(JSON.stringify(this.$f7.params.defaultData)),
      scoreTopGrade: 0,
      percentageTopGrade: 100,
      gradeTopGrade: 0,
      scores: [],
      percentages: [],
      grades: [],
      gradesLetters: []
    }
  }

  addStudent() {
    this.state.data.students.push("Student" + (this.state.data.students.length + 1))
    this.state.data.grades.push(Array(this.state.data.factors.length).fill(""))
    this.recalculate()
  }

  addRequirement() {
    this.state.data.factors.push({
      title: "",
      importance: 5,
      topgrade: this.state.gradeTopGrade
    })
    this.state.data.grades.map( (grade) => {
      grade.push("")
    })
    this.recalculate()
  }

  focusInput(e) {
    var input = e.target.querySelector('input')
    if (!input) input = e.target.querySelector('textarea')
    if (!input) input = e.target
    try {
      if (input) {
        input.focus()
        input.select()
      }
    } catch(e) {}
  }

  changeTopGradeInputValue(e, fi) {
    var factors = this.state.data.factors
    factors[fi].topgrade = e.target.value
    this.setState({data: {...this.state.data}})
    this.recalculateTopGrade(e)
    this.recalculate()
  }

  recalculateTopGrade(e) {
    if (parseInt(e.target.value) == this.gradeTopGrade) return
    this.state.data.factors.map((factor) => {
      factor.topgrade = parseInt(e.target.value)
    })
    this.setState({ data:{...this.state.data} })
    this.recalculate()
  }

  removeFactor(e, fi) {
    this.$f7.dialog.confirm('<i><b>' + (this.state.data.factors[fi].title || '[undefined]') + '</b></i><br /><br />All the grades associated with this assignment requirement will be removed forever, for all the students on this page.', "Remove this requirement?", () => {
      this.state.data.factors.splice(fi, 1)
      this.state.data.grades.map((grades) => {
        grades.splice(fi, 1)
      })
      this.recalculate()
    })
  }

  removeStudent(e, si) {
    this.$f7.dialog.confirm('<b>' + this.state.data.students[si] + '</b><br /><br />All the grades associated with this student will be removed forever.', "Remove this student?", () => {
      this.state.data.students.splice(si, 1)
      this.state.data.grades.splice(si, 1)
      this.recalculate()
    })
  }

  changeGradeInputValue(e, fi, gi) {
    this.state.data.grades[gi][fi] = e.target.value
    this.setState({ data:{...this.state.data} })
    this.recalculate()
  }

  changeImportanceInputValue(e, fi) {
    var factors = this.state.data.factors
    factors[fi].importance = e.target.value || 5
    this.setState({ data:{...this.state.data} })
    this.recalculate()
  }

  changeStudentNameInputValue(e, i) {
    var students = this.state.data.students
    students[i] = e.target.value || ('Student' + (i+1))
    this.setState({ data:{...this.state.data} })
  }

  changeFactorTitleInputValue(e, fi) {
    var factors = this.state.data.factors
    factors[fi].title = e.target.value
    this.setState({ data:{...this.state.data} })
  }

  changeCourseTitleInputValue(e) {
    this.state.data.course = e.target.value
    this.setState({ data:{...this.state.data} })
  }

  changeAssignmentTitleInputValue(e) {
    this.state.data.assignment = e.target.value
    this.setState({ data:{...this.state.data} })
  }

  changeTeacherNameInputValue(e) {
    this.state.data.teacher = e.target.value
    this.setState({ data:{...this.state.data} })
  }

  componentDidMount() {
    this.recalculate()

    events.on('loadNewData', (data) => {
      if (!data) { data = JSON.parse(JSON.stringify(this.$f7.params.defaultData)) }
      this.setState({ data:data })
      this.recalculate()
    })
    events.on('saveData', () => {
      this.saveToFile()
    })
  }

  saveToFile() {
    var courseAssignmentFilename = ''
    try {
      courseAssignmentFilename = this.state.data.course.replace(/[^A-Za-z0-9]+/g, '-') + '_' + this.state.data.assignment.replace(/[^A-Za-z0-9]+/g, '-')
    } catch(e) {}
    if (!courseAssignmentFilename.length) {
      return
    }
    this.$f7.dialog.confirm("Your data will be saved to your local folder of your choice, under this file name:<br /><br /><b>" + courseAssignmentFilename + ".studentgrader</b><br /><br />You will then be able to load this file back to StudentGrader at any time in the future.", "Save all data?", () => {
      const blob = new Blob([JSON.stringify(this.state.data)], {type: "text/plain;charset=utf-8"})
      const FileSaver = require('file-saver')
      FileSaver.saveAs(blob, courseAssignmentFilename + '.studentgrader')
      //this.$f7.dialog.confirm("Thank you for using StudentGrader!", "Your file was saved.", null)
    })
  }

  recalculate() {
    var scoreTopGrade = 0
    var gradeTopGrade = 0
    const scores = []
    this.state.data.factors.map((factor) => {
      scoreTopGrade += factor.topgrade * factor.importance
      if (!gradeTopGrade) gradeTopGrade = factor.topgrade
    })
    this.state.data.grades.map((grades, gindex) => {
      grades.map((grade, findex) => {
        if (!scores[gindex]) scores[gindex] = 0
        scores[gindex] += grade * this.state.data.factors[findex].importance
      })
    })
    var maxScore = Math.max(...scores.concat([scoreTopGrade]))
    const percentages = []
    const grades = []
    const gradesLetters = []
    scores.map((score, index) => {
      var percentage = 0
      if (maxScore) percentage = score / maxScore * 100
      percentages[index] = parseFloat(Math.round(percentage * 10) / 10).toFixed(1)
      grades[index] = parseFloat(Math.round(gradeTopGrade * percentage / 100 * 10) / 10).toFixed(1)
      gradesLetters[index] = (percentage < 60) ? "F" : ((percentage < 70) ? "D" : ((percentage < 80) ? "C" : ((percentage < 90) ? "B" : "A")))
    })
    this.setState({
      scoreTopGrade: scoreTopGrade,
      gradeTopGrade: gradeTopGrade || 10,
      scores: scores,
      percentages: percentages,
      grades: grades,
      gradesLetters: gradesLetters
    })
  }

  render() {
    if (!this.state.data) return (<></>);

    return (
      <Page name="home">

        <Navbar sliding={false}>
          <NavLeft>
            <Link href="./" external iconF7="person_crop_circle_fill_badge_checkmark" iconSize="48" iconColor="gray" />
          </NavLeft>
          <NavTitle sliding>StudentGrader</NavTitle>
          <NavRight>
            <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" iconColor="black" />
          </NavRight>
        </Navbar>
        
        <table className="tableMain">
          <thead>
            <tr>
              <th>
                <table>
                  <tbody>
                    <tr>
                      <td width="auto">
                        <h1><Link noLinkClass href="#" onClick={ () => this.saveToFile() }><Icon f7="sort_down"/> Save</Link></h1>
                        <p>
                          <Input
                            wrap={ false }
                            type="textarea"
                            placeholder="Course Title?..."
                            value={ this.state.data.course }
                            className="textareaCourseTitle"
                            onChange={ e => this.changeCourseTitleInputValue(e) }
                            />
                        </p>
                        <p>
                          <Input
                            wrap={ false }
                            type="textarea"
                            placeholder="Assignment Title?..."
                            value={ this.state.data.assignment }
                            className="textareaAssignmentTitle"
                            onChange={ e => this.changeAssignmentTitleInputValue(e) }
                            />
                        </p>
                        <p>
                          <Input
                            wrap={ false }
                            type="textarea"
                            placeholder="Teacher Name?..."
                            value={ this.state.data.teacher }
                            className="textareaTeacherName"
                            onChange={ e => this.changeTeacherNameInputValue(e) }
                            />
                        </p>
                        <p className="headerTitleRequirements">Assignment Requirements</p>
                        <p className="headerTitleRequirementsClone">Assignment</p>
                      </td>
                      <td width="25%" className="colImportance headerImportance">
                        <h1><Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" iconColor="gray" /></h1>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p className="headerTitleImportance">Importance</p>
                      </td>
                      <td width="25%" className="tdBase colBase">
                        <Row noGap>
                          <h1>A</h1>
                        </Row>
                        <Row noGap>
                          <p>{ this.state.gradeTopGrade }</p>
                        </Row>
                        <Row noGap>
                          <p>{ this.state.percentageTopGrade }%</p>
                        </Row>
                        <Row noGap>
                          <p>{ this.state.scoreTopGrade }</p>
                        </Row>
                        <Row noGap>
                          <p className="headerTitle headerTitleBase">Top Grade</p>
                        </Row>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="colImportanceClone">
                <table>
                  <tbody>
                    <tr>
                      <td className="headerImportance">
                        <h1>&nbsp;</h1>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <Row noGap>
                        <p className="headerTitleImportance" style={{ paddingRight:"10px", paddingLeft:"10px" }}>Importance</p>
                        </Row>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="colBaseClone">
                <table>
                  <tbody>
                    <tr>
                      <td className="tdBase">
                        <Row noGap>
                          <h1>A</h1>
                        </Row>
                        <Row noGap>
                          <p>{ this.state.gradeTopGrade }</p>
                        </Row>
                        <Row noGap>
                          <p>{ this.state.percentageTopGrade }%</p>
                        </Row>
                        <Row noGap>
                          <p>{ this.state.scoreTopGrade }</p>
                        </Row>
                        <Row noGap>
                          <p className="headerTitle headerTitleBase" style={{ whiteSpace:"noWrap", paddingRight:"10px", paddingLeft:"10px" }}>Top Grade</p>
                        </Row>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </th>
              {this.state.data.students.map((student, index) => {
                const multiplier = (this.state.scores[index] / this.state.scoreTopGrade) || 0
                const gradeRed = 201 - 127 * multiplier
                const gradeGreen = 217 - 83 * multiplier
                const gradeBlue = 248 - 16 * multiplier
                const percentageRed = 217 - 111 * multiplier
                const percentageGreen = 234 - 66 * multiplier
                const percentageBlue = 211 - 132 * multiplier
                const scoreRed = 255 - 14 * multiplier
                const scoreGreen = 242 - 48 * multiplier
                const scoreBlue = 204 - 154 * multiplier
                return (
                  <th key={ index } className="thChoice">
                    <Row noGap className="grade">
                      <h1>{ this.state.gradesLetters[index] || "F" }</h1>
                    </Row>
                    <Row noGap>
                      <p style={{ backgroundColor:"rgb(" + gradeRed + ", " + gradeGreen + ", " + gradeBlue + ")" }}>{ this.state.grades[index] || "0.0" }</p>
                    </Row>
                    <Row noGap>
                      <p style={{ backgroundColor:"rgb(" + percentageRed + ", " + percentageGreen + ", " + percentageBlue + ")" }}>{ this.state.percentages[index] || "0.0" }%</p>
                    </Row>
                    <Row noGap>
                      <p style={{ backgroundColor:"rgb(" + scoreRed + ", " + scoreGreen + ", " + scoreBlue + ")" }}>{ this.state.scores[index] || "0" }</p>
                    </Row>
                    <Row noGap onClick={ (e) => this.focusInput(e) }>
                      <div className="headerTitle headerTitleHover">
                        <Input
                          type="textarea"
                          placeholder={ "Student" + (index + 1) }
                          value={ student || ("Student" + (index + 1)) }
                          className="textareaStudentName"
                          onChange={ e => this.changeStudentNameInputValue(e, index) }
                          />
                      </div>
                    </Row>
                  </th>
                )})
              }
              <th key={ this.state.data.students.length } className="thChoice" style={{ verticalAlign:"bottom", paddingLeft:"20px", paddingRight:"20px", whiteSpace:"nowrap" }}>
                <a href="#" onClick={ () => this.addStudent() }>Add Student
                <br />
                <Icon f7="person_crop_circle_badge_plus"/></a>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.factors.map((factor, findex) => (
              <tr key={ findex } className="removeIconHover">
                <td className="tdFactor">
                  <table>
                    <tbody>
                      <tr>
                        <td width="auto" className="tdFactorTitle tdFactorTitleHover">
                          ­<Input
                          type="textarea"
                          resizable
                          placeholder="Type a requirement..."
                          value={ factor.title }
                          onChange={ e => this.changeFactorTitleInputValue(e, findex) }
                          />
                        </td>
                        <td width="25%" className="colImportance colImportanceHover" onClick={ (e) => { this.focusInput(e) }}>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="5"
                            value={ factor.importance || 5 }
                            className={ (factor.importance > 10) ? "error" : "" }
                            onChange={ e => this.changeImportanceInputValue(e, findex) }
                            />
                        </td>
                        <td width="25%" className="colBase colBaseHover" onClick={ (e) => { this.focusInput(e) }}>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="10"
                            value={ factor.topgrade || 10 }
                            className={ (factor.topgrade > 100) ? "error" : "" }
                            onChange={ e => this.changeTopGradeInputValue(e, findex) }
                            />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td onClick={ (e) => { this.focusInput(e) }} className="colImportanceClone colImportanceHover">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="5"
                    defaultValue={ factor.importance || 5 }
                    className={ (factor.importance > 10) ? "error" : "" }
                    onChange={ e => this.changeImportanceInputValue(e, findex) }
                    />
                </td>
                <td className="colBaseClone colBaseHover" onClick={ (e) => { this.focusInput(e) }}>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="10"
                    value={ factor.topgrade || 10 }
                    className={ (factor.topgrade > 100) ? "error" : "" }
                    onChange={ e => this.changeTopGradeInputValue(e, findex) }
                    onBlur={ e => this.recalculateTopGrade(e) }
                    />
                </td>
                {this.state.data.grades.map((grade, gindex) => {
                  const gradeValue = grade[findex] || 0
                  const multiplier = gradeValue / this.state.gradeTopGrade
                  const gradeRGB = 243 - 26 * multiplier
                  const backgroundColor = gradeValue ? "rgb(" + gradeRGB + ", " + gradeRGB + ", " + gradeRGB + ")" : ""
                  return (
                    <td key={ gindex } onClick={ (e) => { this.focusInput(e) }} className="inputGradeCell" style={{ backgroundColor:backgroundColor }}>
                      <Input
                        type="number"
                        min="0"
                        max={ this.state.gradeTopGrade }
                        placeholder="0"
                        value={ grade[findex] }
                        className={ (grade[findex] > this.state.gradeTopGrade) ? "error" : "" }
                        onClick={ (e) => { this.focusInput(e) }}
                        onChange={ e => this.changeGradeInputValue(e, findex, gindex) }
                        />
                      { grade[findex] > this.state.gradeTopGrade &&
                        <small className="error">[max. { this.state.gradeTopGrade }]</small>
                      }
                    </td>
                  )})
                }
                <td>
                  <Link iconF7="minus_circle" iconColor="gray" className="removeIcon" onClick={ (e) => this.removeFactor(e, findex) } />
                </td>
              </tr>
            ))}

            <tr>
              <td className="tdFactor">
                <table>
                  <tbody>
                    <tr>
                      <td width="auto" style={{ paddingTop:"20px", paddingBottom:"20px" }}>
                        ­<b><a href="#" onClick={ () => this.addRequirement() }>Add Requirement <Icon f7="plus_circle"/></a></b>
                      </td>
                      <td width="25%" className="colImportance">
                      </td>
                      <td width="25%" className="colBase">
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="colImportanceClone">
              </td>
              <td className="colBaseClone">
              </td>
              {this.state.data.students.map((student, sindex) => {
                return (
                  <td key={ sindex } className="removeIconHover" onClick={ (e) => this.removeStudent(e, sindex) }>
                    <Link iconF7="person_crop_circle_badge_minus" iconColor="gray" className="removeIcon" />
                  </td>
                )})
              }
            </tr>

          </tbody>
        </table>

        <Block>
          <center>
            Privacy &amp; FERPA: All data is processed locally on your device, and no information is being sent to any cloud service or external server without your permission. Cookies are third-party only.
          </center>
        </Block>

      </Page>
    )
  }
}