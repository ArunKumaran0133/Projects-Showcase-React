import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {
  Header,
  Logo,
  ProjectListContainer,
  Select,
  ProjectListCart,
  FailureContainer,
  FailureImage,
  FailureHeading,
  Para,
  CustomButton,
  LoadingContainer,
} from './styledComponents'

import ProjectList from '../ProjectList'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusObj = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectShowCaseApp extends Component {
  state = {
    activeTabId: categoriesList[0].id,
    apiStatus: apiStatusObj.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectList()
  }

  filterProjects = event => {
    this.setState({activeTabId: event.target.value}, this.getProjectList)
  }

  reRenderApi = () => {
    this.getProjectList()
  }

  getProjectList = async () => {
    this.setState({apiStatus: apiStatusObj.inProgress})
    const {activeTabId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const formattedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        apiStatus: apiStatusObj.success,
        projectsList: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusObj.failure})
    }
  }

  renderProjectCategoryInput = () => {
    const {projectsList, activeTabId} = this.state
    return (
      <ProjectListContainer>
        <Select value={activeTabId} onChange={this.filterProjects}>
          {categoriesList.map(eachItem => (
            <option key={eachItem.id} value={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </Select>
        <ProjectListCart>
          {projectsList.map(eachItem => (
            <ProjectList key={eachItem.id} projectDetails={eachItem} />
          ))}
        </ProjectListCart>
      </ProjectListContainer>
    )
  }

  renderFailureView = () => (
    <FailureContainer>
      <FailureImage
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <FailureHeading>Oops! Something Went Wrong</FailureHeading>
      <Para>We cannot seem to find the page you are looking for.</Para>
      <CustomButton
        type="button"
        data-testid="retry"
        onClick={this.reRenderApi}
      >
        Retry
      </CustomButton>
    </FailureContainer>
  )

  renderLoadingView = () => (
    <LoadingContainer data-testid="loader">
      <Loader color="#4656a1" type="ThreeDots" />
    </LoadingContainer>
  )

  renderResultView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusObj.inProgress:
        return this.renderLoadingView()
      case apiStatusObj.failure:
        return this.renderFailureView()
      case apiStatusObj.success:
        return this.renderProjectCategoryInput()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header>
          <Logo
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </Header>

        {this.renderResultView()}
      </>
    )
  }
}

export default ProjectShowCaseApp
