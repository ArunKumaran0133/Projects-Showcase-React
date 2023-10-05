import {ProjectItem, ProjectImage, Name} from './styledComponents'

const ProjectList = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <ProjectItem>
      <ProjectImage src={imageUrl} alt={name} />
      <Name>{name}</Name>
    </ProjectItem>
  )
}

export default ProjectList
